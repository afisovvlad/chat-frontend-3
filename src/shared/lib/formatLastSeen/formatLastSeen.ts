type Options = {
	now?: number;
	isOnline?: boolean;
	hasConnection?: boolean;
};

export function formatLastSeenText(
	wasOnlineAtUnix: number | null,
	options: Options = {}
): string {
	const nowMs = Date.now();
	const isOnline = options.isOnline ?? false;
	const hasConnection = options.hasConnection ?? true;

	if (!hasConnection) {
		return 'соединение...';
	}
	if (isOnline) {
		return 'в сети';
	}
	if (!wasOnlineAtUnix) {
		return '';
	}

	const lastSeenMs = wasOnlineAtUnix * 1000;
	const diffMs = nowMs - lastSeenMs;
	const diffSeconds = Math.floor(diffMs / 1000);
	const diffMinutes = Math.floor(diffMs / (1000 * 60));
	const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

	// 1. МЕНЕЕ 1 МИНУТЫ (секунды)
	if (diffSeconds < 60) {
		return 'был(а) только что';
	}

	// 2. 1-59 МИНУТ
	if (diffMinutes > 0 && diffMinutes < 60) {
		const m = diffMinutes;
		const minutesWord =
			m % 10 === 1 && m % 100 !== 11
				? 'минуту'
				: [2, 3, 4].includes(m % 10) && ![12, 13, 14].includes(m % 100)
					? 'минуты'
					: 'минут';

		return `был(а) ${m} ${minutesWord} назад`;
	}

	// 3. 1-23 ЧАСА
	if (diffHours > 0 && diffHours < 24) {
		const h = diffHours;
		const hoursWord =
			h % 10 === 1 && h % 100 !== 11
				? 'час'
				: [2, 3, 4].includes(h % 10) && ![12, 13, 14].includes(h % 100)
					? 'часа'
					: 'часов';

		return `был(а) ${h} ${hoursWord} назад`;
	}

	// 4. ВЧЕРА (24-47 часов)
	if (diffHours >= 24 && diffHours < 48) {
		const date = new Date(lastSeenMs);
		const hh = String(date.getHours()).padStart(2, '0');
		const mm = String(date.getMinutes()).padStart(2, '0');

		return `был(а) вчера в ${hh}:${mm}`;
	}

	// 5. ДАТА (≥ 48 часов)
	const date = new Date(lastSeenMs);
	const dd = String(date.getDate()).padStart(2, '0');
	const MM = String(date.getMonth() + 1).padStart(2, '0');
	const yy = String(date.getFullYear()).slice(-2);

	return `был(а) ${dd}.${MM}.${yy}`;
}
