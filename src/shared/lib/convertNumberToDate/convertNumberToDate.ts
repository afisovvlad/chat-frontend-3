interface DateOptions {
	enteredDay: string;
	enteredMonth: string;
	enteredYear: string;
}

export const convertNumberToDate = (num?: number): DateOptions => {
	if (!num) {
		return {
			enteredDay: '',
			enteredMonth: '',
			enteredYear: ''
		};
	}

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
