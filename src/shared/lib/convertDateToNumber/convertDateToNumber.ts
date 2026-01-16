interface ConvertDateToNumberProps {
	day: string | undefined;
	month: string | undefined;
	year: string | undefined;
}

export const convertDateToNumber = ({
	day,
	month,
	year
}: ConvertDateToNumberProps): number => {
	if (!day || !month || !year) {
		return 0;
	}
	const timestamp = Date.UTC(
		Number(year),
		Number(month) - 1,
		Number(day),
		0,
		0,
		0,
		0 // часы, минуты, секунды, миллисекунды
	);

	return Math.floor(timestamp / 1000);
};
