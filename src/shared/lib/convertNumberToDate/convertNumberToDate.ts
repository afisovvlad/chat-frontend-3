interface DateOptions {
	enteredDay: string | undefined;
	enteredMonth: string | undefined;
	enteredYear: string | undefined;
}

export const convertNumberToDate = (num: number): DateOptions => {
	const date = new Date(num * 1000);
	const utcDay = date.getUTCDate();
	const utcMonth = date.getUTCMonth();
	const utcYear = date.getUTCFullYear();

	return {
		enteredDay: String(utcDay).padStart(2, '0'),
		enteredMonth: String(utcMonth + 1).padStart(2, '0'),
		enteredYear: String(utcYear)
	};
};
