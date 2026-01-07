interface DateOptions {
	day: string;
	month: string;
	year: string;
}

export const convertNumberToDate = (num: number): DateOptions => {
	const date = new Date(num * 1000);

	const utcDay = date.getUTCDate();
	const utcMonth = date.getUTCMonth();
	const utcYear = date.getUTCFullYear();

	return {
		day: String(utcDay).padStart(2, '0'),
		month: String(utcMonth + 1).padStart(2, '0'),
		year: String(utcYear)
	};
};
