'use client';

import { FormSettingsItem } from '@/entities/FormSettingsItem';
import { Button, ButtonType } from '@/shared/ui/Button';
import { Form, Label, SelectItem } from '@/shared/ui/Form';
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
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { StylesConfig } from 'react-select';

import { DateOption } from '@/shared/ui/Form/FormItems/model/selectTypes';
import styles from './EditProfileForm.module.scss';

interface SupportForm {
	name: string;
	lastName: string;
	nickname: string;
	message: string;
	day: number | undefined;
	month: number | undefined;
	year: number | undefined;
}

export function EditProfileForm() {
	const methods = useForm<SupportForm>({
		defaultValues: {
			day: 1,
			month: 1,
			year: 2026
		}
	});
	const { watch, setValue } = methods;
	const month = watch('month');
	const year = watch('year');
	const day = watch('day');

	const dayOptions = getDaysOptions(month, year);

	// 🔄 Синхронизация дня при смене месяца / года
	useEffect(() => {
		if (day && month && year) {
			const maxDay = getDaysInMonth(month as number, year as number);

			if (day > maxDay) {
				setValue('day', maxDay);
			}
		}
	}, [month, year]);

	const formItem = [
		{
			type: FormItemType.TEXT,
			name: FormItemNames.NAME,
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
		// {
		// 	type: FormItemType.TEXTAREA,
		// 	name: FormItemNames.MESSAGE,
		// 	label: 'Напишите пару слов о себе',
		// 	rules: {
		// 		required: 'Заполните это поле'
		// 	}
		// }
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

	const onSubmit: SubmitHandler<SupportForm> = data => {
		console.log(data);
	};

	return (
		<Form<SupportForm>
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
				<SelectItem<SupportForm, DateOption>
					options={dayOptions}
					name={'day'}
					classNameParentSelectWrapper={styles.selectWrapper}
					classNameSelect={styles.selectDay}
					customStyles={customStyles}
					width={80}
				/>
				<SelectItem<SupportForm, DateOption>
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
			<Button btnType={ButtonType.SUBMIT}>Сохранить</Button>
		</Form>
	);
}
