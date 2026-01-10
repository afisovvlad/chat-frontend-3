'use client';

import { FormSettingsItem } from '@/entities/FormSettingsItem';
import { useEditProfileMutation } from '@/features/profile/edit/api/editProfile.api';
import { classNames } from '@/shared/lib/classNames/classNames';
import { convertDateToNumber } from '@/shared/lib/convertDateToNumber/convertDateToNumber';
import { convertNumberToDate } from '@/shared/lib/convertNumberToDate/convertNumberToDate';
import { Button, ButtonType } from '@/shared/ui/Button';
import { ErrorComponent } from '@/shared/ui/ErrorComponent';
import { Form, SelectItem } from '@/shared/ui/Form';
import { DateOption } from '@/shared/ui/Form/FormItems/model/selectTypes';
import {
	FormItemAutocomplete,
	FormItemNames,
	FormItemType
} from '@/shared/ui/Form/FormItems/model/types';
import { Loader } from '@/shared/ui/Loader';
import { SuccessBlock } from '@/shared/ui/SuccessBlock';
import {
	getDaysInMonth,
	getDaysOptions,
	getMonthsOptions,
	getYearsOptions
} from '@/shared/utils/dateOptions';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { StylesConfig } from 'react-select';
import { CreateCustomStylesOptions, ProfileSchema } from '../..';
import styles from './EditProfileForm.module.scss';

interface EditBirthdayForm {
	day: DateOption | undefined;
	month: DateOption | undefined;
	year: DateOption | undefined;
}

interface EditProfileForm extends EditBirthdayForm, ProfileSchema {}

interface EditProfileFormProps {
	parentClass?: string;
}

export function EditProfileForm({ parentClass }: EditProfileFormProps) {
	const [isSuccess, setIsSuccess] = useState(false);
	const [serverErrorMessage, setServerErrorMessage] = useState('');
	const [editProfile, { isLoading }] = useEditProfileMutation();
	const methods = useForm<EditProfileForm>({
		defaultValues: {
			nickname: '',
			first_name: '',
			last_name: '',
			additional_information: '',
			birthday: 0
		}
	});
	const { watch, setValue, setError, formState, reset } = methods;
	const day = watch('day')?.value;
	const month = watch('month')?.value;
	const year = watch('year')?.value;
	const dayOptions = getDaysOptions(month, year);
	const hasError = formState.isSubmitted && (!day || !month || !year);
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

	const createCustomStyles = (
		options: CreateCustomStylesOptions = {}
	): StylesConfig<DateOption, boolean> => {
		const { hasError } = options;

		return {
			control: (base, state) => ({
				...base,
				position: 'relative',
				minHeight: 56,
				fontFamily: 'inherit',
				lineHeight: '130%',
				letterSpacing: '0.4px',
				borderRadius: state.menuIsOpen ? '8px 8px 0 0' : '8px',
				border: state.menuIsOpen
					? '1px solid var(--color-primary)'
					: `1px solid ${hasError ? 'transparent' : 'var(--settings-border-color)'}`,
				outline: hasError ? '2px solid var(--color-red)' : 'none',
				boxShadow: 'none',

				'&:hover': {
					borderColor: hasError ? 'var(--color-red)' : 'var(--color-primary)'
				},

				'&:focus': {
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
				backgroundColor: state.isSelected
					? 'transparent'
					: state.isFocused
						? 'transparent'
						: 'transparent',
				color: 'var(--color-black)',
				cursor: 'pointer'
			}),

			// singleValue: base => ({
			// 	...base,
			// 	color: '#000'
			// }),

			indicatorSeparator: () => ({
				display: 'none'
			})
		};
	};

	const fetchProfile = useCallback(async () => {
		const response = await editProfile({}); // Отправляем пустой {} для получения данных профиля
		if (response.data) {
			const data = response.data;

			if (data && data.birthday) {
				const { enteredDay, enteredMonth, enteredYear } = convertNumberToDate(
					data.birthday
				);

				reset({
					nickname: data.nickname || '',
					first_name: data.first_name || '',
					last_name: data.last_name || '',
					additional_information: data.additional_information || '',
					day: { label: String(enteredDay), value: String(enteredDay) },
					month: { label: String(enteredMonth), value: String(enteredMonth) },
					year: { label: String(enteredYear), value: String(enteredYear) }
				});
			}
		}
	}, [reset, editProfile]);

	// 🔄 Синхронизация дней при смене месяца / года, - 28, 29, 30 или 31
	useEffect(() => {
		if (!day || !month || !year) {
			return;
		}

		const maxDay = getDaysInMonth(Number(month), Number(year));

		if (Number(day) > maxDay) {
			setValue('day', { label: String(maxDay), value: String(maxDay) });
		}
	}, [day, month, year, setValue]);

	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

	useEffect(() => {});

	const onSubmit: SubmitHandler<EditProfileForm> = async data => {
		setServerErrorMessage('');
		const newBirthday =
			day && month && year && convertDateToNumber({ day, month, year });

		const newData = {
			nickname: data.nickname,
			first_name: data.first_name,
			last_name: data.last_name,
			birthday: newBirthday || 0,
			additional_information: data.additional_information
		};

		try {
			const result = await editProfile(newData);

			if ('data' in result) {
				// console.log('success', data);
				setIsSuccess(true);
			} else {
				const error = result.error;
				// console.log('error', error);
				if (
					error &&
					typeof error === 'object' &&
					'status' in error &&
					'data' in error
				) {
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
			// console.log(e);
			setServerErrorMessage('Произошла непредвиденная ошибка');
		}
	};

	if (isSuccess) {
		return (
			<SuccessBlock marginTop='100px' title={' Ваш профиль успешно изменен'} />
		);
	}

	if (serverErrorMessage) {
		return <ErrorComponent>{serverErrorMessage}</ErrorComponent>;
	}

	return (
		<Form<EditProfileForm>
			methods={methods}
			onSubmit={onSubmit}
			className={classNames(styles.form, {}, [parentClass])}
		>
			<p style={{ marginBottom: '30px' }}>Выбрать фотографию</p>
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

			<fieldset>
				{hasError ? (
					<legend
						className={classNames(
							`${styles.birthday} ${styles.birthdayError}`,
							{},
							[]
						)}
					>
						Пожалуйста, заполните дату рождения
					</legend>
				) : (
					<legend className={styles.birthday}>
						Введите дату своего рождения
					</legend>
				)}
				<div className={styles.selectContainer}>
					<SelectItem<EditProfileForm, DateOption>
						options={dayOptions}
						name={'day'}
						parentSelectWrapperClass={styles.selectWrapper}
						parentSelectControlClass={styles.selectDay}
						parentSelectMenuClass={styles.selectMenu}
						parentSelectMenuListClass={styles.selectMenuList}
						parentSelectOptionClass={styles.selectOption}
						parentSelectSingleValueClass={styles.selectSingleValue}
						parentSelectIndicatorSeparatorClass={
							styles.selectIndicatorSeparator
						}
						createCustomStyles={createCustomStyles}
						ariaLabel='Выбор дня месяца'
						hasError={hasError}
					/>
					<SelectItem<EditProfileForm, DateOption>
						options={getMonthsOptions()}
						name={'month'}
						parentSelectControlClass={styles.selectMonth}
						parentSelectMenuClass={styles.selectMenu}
						parentSelectMenuListClass={styles.selectMenuList}
						parentSelectOptionClass={styles.selectOption}
						parentSelectSingleValueClass={styles.selectSingleValue}
						parentSelectIndicatorSeparatorClass={
							styles.selectIndicatorSeparator
						}
						createCustomStyles={createCustomStyles}
						ariaLabel='Выбор месяца'
						hasError={hasError}
					/>
					<SelectItem
						options={getYearsOptions()}
						name={'year'}
						parentSelectControlClass={styles.selectYear}
						parentSelectMenuClass={styles.selectMenu}
						parentSelectMenuListClass={styles.selectMenuList}
						parentSelectOptionClass={styles.selectOption}
						parentSelectSingleValueClass={styles.selectSingleValue}
						parentSelectIndicatorSeparatorClass={
							styles.selectIndicatorSeparator
						}
						createCustomStyles={createCustomStyles}
						ariaLabel='Выбор года'
						hasError={hasError}
					/>
				</div>
			</fieldset>
			<FormSettingsItem
				key={FormItemNames.ADDITIONAL_INFORMATION}
				type={FormItemType.TEXTAREA}
				name={FormItemNames.ADDITIONAL_INFORMATION}
				label={'Напишите пару слов о себе'}
				rules={{ required: 'Заполните это поле' }}
				classNameParentInput={styles.formItem}
				textareaHeight={'56px'}
			/>
			<Button btnType={ButtonType.SUBMIT}>
				{isLoading ? <Loader width='22px' height='22px' /> : 'Сохранить'}
			</Button>
		</Form>
	);
}
