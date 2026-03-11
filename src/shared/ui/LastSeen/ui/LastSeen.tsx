import { formatLastSeenText } from '@/shared/lib/formatLastSeen/formatLastSeen';
import { FontWeight, Text, TextColor, TextSize } from '@/shared/ui/Text';
import { useEffect, useState } from 'react';

type LastSeenProps = {
	wasOnlineAt: number | null; // UNIX (секунды)
	isOnline: boolean | null;
	hasConnection?: boolean;
	invertColors?: boolean;
};

export function LastSeen({
	wasOnlineAt,
	isOnline,
	hasConnection = true,
	invertColors = false
}: LastSeenProps) {
	const [_, setTick] = useState(0);

	useEffect(() => {
		// Обновляем только когда пользователь не в сети и есть соединение
		if (!isOnline && hasConnection) {
			const interval = setInterval(() => {
				setTick(prev => prev + 1);
			}, 60000); // Обновляем раз в минуту вместо секунды

			return () => clearInterval(interval);
		}
	}, [isOnline, hasConnection]);

	const text = formatLastSeenText(wasOnlineAt, {
		isOnline,
		hasConnection
	});

	const statusColor = invertColors
		? undefined
		: isOnline
			? TextColor.ACCENT
			: TextColor.GRAY;

	return (
		<Text
			fontSize={TextSize.S}
			fontWeight={FontWeight.REGULAR}
			color={statusColor}
			inheritColor={invertColors}
		>
			{text}
		</Text>
	);
}
