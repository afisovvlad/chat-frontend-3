'use client';

import { Form, Input, Label, SelectItem, Textarea } from '@/shared/ui/Form';
import {
	FormItemType,
	SelectOption
} from '@/shared/ui/Form/FormItems/model/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { StylesConfig } from 'react-select';
import styles from './page.module.scss';

interface LoginProfileForm {
	day: string;
	month: string;
	year: string;
}

export default function TestPage() {
	const day = 'day';
	const month = 'month';
	const year = 'year';

	const methods = useForm<LoginProfileForm>({
		defaultValues: {
			day: '1',
			month: '1',
			year: '2018'
		}
	});
	// const { setError } = methods;
	const days = [
		{ value: '1', label: '1' },
		{ value: '2', label: '2' },
		{ value: '3', label: '3' },
		{ value: '4', label: '4' },
		{ value: '5', label: '5' },
		{ value: '6', label: '6' },
		{ value: '7', label: '7' },
		{ value: '8', label: '8' },
		{ value: '8', label: '8' },
		{ value: '8', label: '8' },
		{ value: '8', label: '8' },
		{ value: '8', label: '8' },
		{ value: '8', label: '8' },
		{ value: '8', label: '8' },
		{ value: '8', label: '8' },
		{ value: '8', label: '8' },
		{ value: '8', label: '8' }
	];
	const months = [
		// { value: '', label: 'Выберите месяц' },
		{ value: '1', label: 'Январь' },
		{ value: '2', label: 'Февраль' },
		{ value: '3', label: 'Март' },
		{ value: '4', label: '4' },
		{ value: '5', label: '5' },
		{ value: '6', label: '6' },
		{ value: '7', label: '7' },
		{ value: '8', label: '8' }
	];
	const years = [
		// { value: '', label: 'Выберите год' },
		{ value: '2025', label: '2025' },
		{ value: '2024', label: '2024' },
		{ value: '2023', label: '2023' },
		{ value: '2022', label: '2022' },
		{ value: '2021', label: '2021' },
		{ value: '2020', label: '2020' },
		{ value: '2019', label: '2019' },
		{ value: '2018', label: '2018' },
		{ value: '2017', label: '2017' },
		{ value: '2016', label: '2016' }
	];

	// type Option = {
	// 	value: string;
	// 	label: string;
	// };

	// export const customStyles = <Option>( width?: number | string) : StylesConfig<Option> => ({
	// 	control: (base, state) => ({
	// 		...base,
	// 		width: '80px',
	// 		minHeight: '56px',
	// 		borderRadius: state.menuIsOpen ? '8px 8px 0 0 ' : '8px',
	// 		borderWidth: '1px',
	// 		borderColor: 'transparent',
	// 		outline: 'none',
	// 		boxShadow: '0',
	// 		'&:hover': {
	// 			borderColor: 'var(--color-primary)'
	// 		}
	// 	}),

	// 	menu: base => ({
	// 		...base,
	// 		marginTop: 0,
	// 		border: '1px solid var(--color-primary)',
	// 		borderRadius: '0 0 8px 8px',
	// 		boxShadow: '0',
	// 		overflow: 'hidden'
	// 	}),

	// 	option: (base, state) => ({
	// 		...base,
	// 		padding: '12px 16px',
	// 		backgroundColor: 'transparent',
	// 		// backgroundColor: state.isSelected
	// 		// 	? '#048e22'
	// 		// 	: state.isFocused
	// 		// 		? '#e6f4ea'
	// 		// 		: 'transparent',
	// 		color: state.isSelected ? '#fff' : '#000',
	// 		cursor: 'pointer'
	// 	}),

	// 	singleValue: base => ({
	// 		...base,
	// 		color: '#000'
	// 	})
	// });

	const customStyles = <
		Option extends SelectOption,
		IsMulti extends boolean = false
	>(
		width?: number | string
	): StylesConfig<Option, IsMulti> => ({
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

	const onSubmit: SubmitHandler<LoginProfileForm> = data => {
		console.log(data);
	};

	return (
		<>
			<Form<LoginProfileForm> onSubmit={onSubmit} methods={methods}>
				<Label name={'day'} classNameParentLabel={styles.label}>
					Введите дату своего рождения
				</Label>
				<div className={styles.selectContainer}>
					<SelectItem
						options={days}
						name={day}
						classNameParentSelectWrapper={styles.selectWrapper}
						classNameSelect={styles.selectDay}
						// icon={<Down className={styles.iconDown} />}
						customStyles={customStyles}
						width={80}
					/>
					<SelectItem
						options={months}
						name={month}
						classNameSelect={styles.selectMonth}
						// icon={<Down className={styles.iconDown} />}
						customStyles={customStyles}
						width={133}
					/>
					<SelectItem
						options={years}
						name={year}
						classNameSelect={styles.selectYear}
						// icon={<Down className={styles.iconDown} />}
						customStyles={customStyles}
						width={107}
					/>
				</div>
				<Label name={'name'} classNameParentLabel={styles.label}>
					Введите дату своего рождения
				</Label>
				<Input name={'name'} type={FormItemType.TEXT} />

				<Label name={'email'} classNameParentLabel={styles.label}>
					Введите email
				</Label>
				<Input name={'email'} type={FormItemType.EMAIL} />

				<Label
					name={'message'}
					classNameParentLabel={styles.label}
					isRequired={true}
				>
					Введите сообщение
				</Label>
				<Textarea name={'message'} />

				<button type='submit'>Сохранить</button>
			</Form>
		</>
	);
}

/* <Form<LoginProfileForm> onSubmit={onSubmit} methods={methods}>
<Label name={'day'} classNameParentLabel={styles.label}>
  Введите дату своего рождения
</Label>
<div className={styles.selectContainer}>
  <Select
    options={days}
    name={day}
    classNameParentSelectWrapper={styles.selectWrapper}
    classNameParentSelect={styles.selectDay}
    icon={<Down className={styles.iconDown} />}
  />
  <Select
    options={months}
    name={month}
    classNameParentSelect={styles.selectMonth}
    icon={<Down className={styles.iconDown} />}
  />
  <Select
    options={years}
    name={year}
    classNameParentSelect={styles.selectYear}
    icon={<Down className={styles.iconDown} />}
  />
</div>
<button type='submit'>Сохранить</button>
</Form> */
