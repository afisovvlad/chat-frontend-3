import { SelectOption } from '../ui/Form/FormItems/model/selectTypes';

export const days = [
	{ value: 1, label: '1' },
	{ value: 2, label: '2' },
	{ value: 3, label: '3' },
	{ value: 4, label: '4' },
	{ value: 5, label: '5' },
	{ value: 6, label: '6' },
	{ value: 7, label: '7' },
	{ value: 8, label: '8' },
	{ value: 9, label: '9' },
	{ value: 10, label: '10' },
	{ value: 11, label: '11' },
	{ value: 12, label: '12' },
	{ value: 13, label: '13' },
	{ value: 14, label: '14' },
	{ value: 15, label: '15' },
	{ value: 16, label: '16' },
	{ value: 17, label: '17' },
	{ value: 18, label: '18' },
	{ value: 19, label: '19' },
	{ value: 20, label: '20' },
	{ value: 21, label: '21' },
	{ value: 22, label: '22' },
	{ value: 23, label: '23' },
	{ value: 24, label: '24' },
	{ value: 25, label: '25' },
	{ value: 26, label: '26' },
	{ value: 27, label: '27' },
	{ value: 28, label: '28' },
	{ value: 29, label: '29' },
	{ value: 30, label: '30' },
	{ value: 31, label: '31' }
];

export const getMonthsOptions = (): SelectOption<number>[] => [
	{ value: 1, label: 'Январь' },
	{ value: 1, label: 'Январь' },
	{ value: 2, label: 'Февраль' },
	{ value: 3, label: 'Март' },
	{ value: 4, label: 'Апрель' },
	{ value: 5, label: 'Май' },
	{ value: 6, label: 'Июнь' },
	{ value: 7, label: 'Июль' },
	{ value: 8, label: 'Август' },
	{ value: 9, label: 'Сентябрь' },
	{ value: 10, label: 'Октябрь' },
	{ value: 11, label: 'Ноябрь' },
	{ value: 12, label: 'Декабрь' }
];

export const getYearsOptions = (
	from = new Date().getFullYear(),
	to = from - 100
): SelectOption<number>[] =>
	Array.from({ length: from - to + 1 }, (_, i) => {
		const year = from - i;
		return { value: year, label: String(year) };
	});

/** Количество дней в месяце с учетом високосного года */
export const getDaysInMonth = (month: number, year: number): number =>
	new Date(year, month, 0).getDate();

export const getDaysOptions = (
	month?: number,
	year?: number
): SelectOption<number>[] => {
	if (!month || !year) {
		return days;
	}

	const daysCount = month && year ? getDaysInMonth(month, year) : 31;

	return Array.from({ length: daysCount }, (_, i) => ({
		value: i + 1,
		label: String(i + 1)
	}));
};
