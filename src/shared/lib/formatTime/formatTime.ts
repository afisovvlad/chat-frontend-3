export const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60) === 1 ? 0 : Math.floor(seconds / 60);
	const secs =
		Math.floor(seconds / 60) === 1 ? (seconds % 60) + 60 : seconds % 60;

	// if (minutes === 1) {
	// 	return { minutes = 0, secs: secs + 60 };
	// }

	return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
