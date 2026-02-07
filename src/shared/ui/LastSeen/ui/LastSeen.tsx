import { formatLastSeenText } from '@/shared/lib/formatLastSeen/formatLastSeen';
import { FontWeight, Text, TextColor, TextSize } from '@/shared/ui/Text';
import { useEffect, useState } from 'react';

type LastSeenProps = {
	wasOnlineAt: number | null; // UNIX (секунды)
	isOnline: boolean | null;
	hasConnection?: boolean;
};

export function LastSeen({
	wasOnlineAt,
	isOnline,
	hasConnection = true
}: LastSeenProps) {
	const [_, setTick] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setTick(prev => prev + 1); // Заставляем компонент обновиться
		}, 1000);

		return () => clearInterval(interval);
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
