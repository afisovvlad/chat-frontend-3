import { formatLastSeenText } from '@/shared/lib/formatLastSeen/formatLastSeen';
import { FontWeight, Text, TextColor, TextSize } from '@/shared/ui/Text';
import { useEffect, useRef } from 'react';

type LastSeenProps = {
	wasOnlineAt: number | null; // UNIX (секунды)
	isOnline: boolean;
	hasConnection?: boolean;
};

export function LastSeen({
	wasOnlineAt,
	isOnline,
	hasConnection = true
}: LastSeenProps) {
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		intervalRef.current = setInterval(() => {
			// Ничего не делаем с состоянием — просто заставляем компонент перерендериться
			window.dispatchEvent(new Event('tick'));
		}, 60_000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	const text = formatLastSeenText(wasOnlineAt, {
		isOnline,
		hasConnection
	});

	return (
		<Text
			fontSize={TextSize.S}
			fontWeight={FontWeight.REGULAR}
			color={isOnline ? TextColor.ACCENT : TextColor.GRAY}
		>
			{text}
		</Text>
	);
}
