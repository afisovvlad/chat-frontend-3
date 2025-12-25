'use client';

import { Form, Label, SelectItem } from '@/shared/ui/Form';
import { Down } from '@icons/index';
import { SubmitHandler, useForm } from 'react-hook-form';
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
	const days = [
		{ value: '1', label: '1' },
		{ value: '2', label: '2' },
		{ value: '3', label: '3' },
		{ value: '4', label: '4' },
		{ value: '5', label: '5' },
		{ value: '6', label: '6' },
		{ value: '7', label: '7' },
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
						classNameParentSelect={styles.selectDay}
						icon={<Down className={styles.iconDown} />}
					/>
					<SelectItem
						options={months}
						name={month}
						classNameParentSelect={styles.selectMonth}
						icon={<Down className={styles.iconDown} />}
					/>
					<SelectItem
						options={years}
						name={year}
						classNameParentSelect={styles.selectYear}
						icon={<Down className={styles.iconDown} />}
					/>
				</div>
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
