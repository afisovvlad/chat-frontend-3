import {
	FontWeight,
	Text,
	TextColor,
	TextSize,
	TextType
} from '@/shared/ui/Text';
import clsx from 'clsx';
import styles from './Tooltip.module.scss';

interface TooltipProps {
	classNameParent?: string;
}

export default function Tooltip({ classNameParent }: TooltipProps) {
	return (
		<div className={clsx(styles.tooltip, classNameParent)}>
			<Text
				type={TextType.TEXT}
				fontSize={TextSize.S}
				fontWeight={FontWeight.REGULAR}
				color={TextColor.WHITE}
				className={styles.text}
			>
				Код должен содержать только цифры, длина — 5 символов.
			</Text>
			<Text
				type={TextType.TEXT}
				fontSize={TextSize.S}
				fontWeight={FontWeight.REGULAR}
				color={TextColor.WHITE}
				className={styles.text}
			>
				Не более 10 запросов кода в час. При превышении — блокировка номера на
				60 минут.
			</Text>
		</div>
	);
}
