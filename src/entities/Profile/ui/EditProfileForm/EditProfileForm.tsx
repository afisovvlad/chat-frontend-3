'use client';

import { FormSettingsItem } from '@/entities/FormSettingsItem';
import { useEditProfileMutation } from '@/features/profile/edit/api/editProfile.api';
import { Button, ButtonType } from '@/shared/ui/Button';
import { Form, Label, SelectItem } from '@/shared/ui/Form';
import { DateOption } from '@/shared/ui/Form/FormItems/model/selectTypes';
import {
	FormItemAutocomplete,
	FormItemNames,
	FormItemType
} from '@/shared/ui/Form/FormItems/model/types';
import {
	getDaysInMonth,
	getDaysOptions,
	getMonthsOptions,
	getYearsOptions
} from '@/shared/utils/dateOptions';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { StylesConfig } from 'react-select';
import styles from './EditProfileForm.module.scss';

interface EditBirthdayForm {
	day: DateOption | null;
	month: DateOption | null;
	year: DateOption | null;
}

interface EditProfileForm extends EditBirthdayForm {
	nickname: string;
	first_name: string;
	last_name: string;
	// patronymic: string;
	message: string;
	// birthday: number;
	// email: string;
	// gender: string;
	// country: string;
	// city_id: number;
	// phone: string;
}

export function EditProfileForm() {
	const [serverErrorMessage, setServerErrorMessage] = useState('');
	const [editProfile] = useEditProfileMutation();
	const methods = useForm<EditProfileForm>({
		defaultValues: {
			day: { value: 1, label: '1' },
			month: { value: 1, label: 'Январь' },
			year: { value: 2026, label: '2026' }
		}
	});
	const { watch, setValue, setError } = methods;
	const day = watch('day')?.value;
	const month = watch('month')?.value;
	const year = watch('year')?.value;

	// console.log(day, month, year);

	const newBirthday = `${day}-${month}-${year}`;

	const dayOptions = month && year ? getDaysOptions(month, year) : [];

	const formItem = [
		{
			type: FormItemType.TEXT,
			name: FormItemNames.FIRST_NAME,
			label: 'Изменить имя',
			placeholder: 'Иван',
			autocomplete: FormItemAutocomplete.NAME,
			disabled: false,
			isRequired: false,
			rules: {
				required: 'Заполните это поле',
				minLength: {
					value: 3,
					message: 'Минимум 3 буквы'
				},
				pattern: {
					value: /^[a-zA-Zа-яёА-ЯЁ]+$/,
					message: 'Допускаются только буквы'
				}
			}
		},
		{
			type: FormItemType.TEXT,
			name: FormItemNames.LAST_NAME,
			label: 'Изменить фамилию',
			placeholder: 'Иванов',
			autocomplete: FormItemAutocomplete.LAST_NAME,
			disabled: false,
			isRequired: false,
			rules: {
				required: 'Заполните это поле',
				minLength: {
					value: 3,
					message: 'Минимум 3 буквы'
				},
				pattern: {
					value: /^[a-zA-Zа-яёА-ЯЁ]+$/,
					message: 'Допускаются только буквы'
				}
			}
		},
		{
			type: FormItemType.TEXT,
			name: FormItemNames.NICKNAME,
			label: 'Изменить никнейм',
			placeholder: 'ivan',
			autocomplete: FormItemAutocomplete.NICKNAME,
			disabled: false,
			isRequired: false,
			rules: {
				required: 'Заполните это поле',
				minLength: {
					value: 3,
					message: 'Минимум 3 буквы'
				},
				pattern: {
					value: /^[a-zA-Zа-яёА-ЯЁ]+$/,
					message: 'Допускаются только буквы'
				}
			}
		}
	];

	const customStyles = (
		width?: number | string
	): StylesConfig<DateOption, boolean> => ({
		control: (base, state) => ({
			...base,
			position: 'relative',
			width,
			minHeight: 56,
			fontFamily: 'inherit',
			fontSize: '18px',
			lineHeight: '130%',
			letterSpacing: '0.4px',
			borderRadius: state.menuIsOpen ? '8px 8px 0 0' : '8px',
			border: state.menuIsOpen
				? '1px solid var(--color-primary)'
				: '1px solid transparent',
			outline: 'none',
			boxShadow: 'none',

			'&:hover': {
				borderColor: 'var(--color-primary)'
			}
		}),

		menu: base => ({
			...base,
			minHeight: 140,
			maxHeight: 140,
			marginTop: 0,
			marginBottom: '4px',
			padding: '4px 6px 4px 10px',
			border: '1px solid var(--color-primary)',
			borderTop: 'none ',
			borderRadius: '0 0 8px 8px',
			boxShadow: 'none',
			overflow: 'hidden'
		}),

		menuList: base => ({
			...base,
			maxHeight: 140,
			overflowY: 'auto'
		}),

		option: (base, state) => ({
			...base,
			padding: '0 0 4px 0',
			fontFamily: 'inherit',
			fontSize: '18px',
			lineHeight: '130%',
			letterSpacing: '0.4px',
			backgroundColor: state.isSelected
				? 'transparent'
				: state.isFocused
					? 'transparent'
					: 'transparent',
			color: 'var(--color-black)',
			cursor: 'pointer'
		}),

		singleValue: base => ({
			...base,
			color: '#000'
		}),

		indicatorSeparator: () => ({
			display: 'none'
		})
	});

	// 🔄 Синхронизация дня при смене месяца / года
	useEffect(() => {
		if (!day || !month || !year) {
			return;
		}

		const maxDay = getDaysInMonth(month, year);

		if (day > maxDay) {
			setValue('day', { label: String(maxDay), value: maxDay });
		}
	}, [month, year]);

	const onSubmit: SubmitHandler<EditProfileForm> = async data => {
		setServerErrorMessage('');

		const newData = {
			nickname: data.nickname,
			first_name: data.first_name,
			last_name: data.last_name,
			birthday: 0,
			// birthday: newBirthday,
			additional_information: data.message,
			patronymic: 'Иванович',
			email: 'user@example.com',
			gender: 'male',
			country: 'RU',
			city_id: 2,
			phone: '+79870118530'
		};

		try {
			const result = await editProfile(newData);
			console.log(result);

			if ('data' in result) {
				console.log('success', data);
			} else {
				const error = result.error;
				console.log('error', error);
				if (
					error &&
					typeof error === 'object' &&
					'status' in error &&
					'data' in error
				) {
					console.log(error.data);
					const serverErrors = error.data as Record<string, string[]>;

					Object.entries(serverErrors).forEach(([field, messages]) => {
						setError(field as keyof EditProfileForm, {
							type: 'server',
							message: messages.join(' ') // объединяем все ошибки для одного поля
						});
					});
				} else {
					setServerErrorMessage('Произошла непредвиденная ошибка');
				}
			}
		} catch (e) {
			console.log(e);
			setServerErrorMessage('Произошла непредвиденная ошибка');
		}
	};

	return (
		<Form<EditProfileForm>
			methods={methods}
			onSubmit={onSubmit}
			className={styles.form}
		>
			{formItem.map(item => (
				<FormSettingsItem
					key={item.name}
					type={item.type}
					name={item.name}
					label={item.label}
					placeholder={item.placeholder}
					autoComplete={undefined}
					rules={item.rules || undefined}
					classNameParentInput={styles.formItem}
				/>
			))}
			<Label name={'day'}>Введите дату своего рождения</Label>
			<div className={styles.selectContainer}>
				<SelectItem<EditProfileForm, DateOption>
					options={dayOptions}
					name={'day'}
					classNameParentSelectWrapper={styles.selectWrapper}
					classNameSelect={styles.selectDay}
					customStyles={customStyles}
					width={80}
				/>
				<SelectItem<EditProfileForm, DateOption>
					options={getMonthsOptions()}
					name={'month'}
					classNameSelect={styles.selectMonth}
					customStyles={customStyles}
					width={133}
				/>
				<SelectItem
					options={getYearsOptions()}
					name={'year'}
					classNameSelect={styles.selectYear}
					customStyles={customStyles}
					width={107}
				/>
			</div>
			<FormSettingsItem
				key={FormItemNames.MESSAGE}
				type={FormItemType.TEXTAREA}
				name={FormItemNames.MESSAGE}
				label={'Напишите пару слов о себе'}
				rules={{ required: 'Заполните это поле' }}
				classNameParentInput={styles.formItem}
				textareaHeight={'56px'}
			/>
			{serverErrorMessage && <p>{serverErrorMessage}</p>}
			<Button btnType={ButtonType.SUBMIT}>Сохранить</Button>
		</Form>
	);
}
