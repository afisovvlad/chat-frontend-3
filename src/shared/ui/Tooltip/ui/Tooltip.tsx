import {
	FontWeight,
	Text,
	TextColor,
	TextSize,
	TextType
} from '@/shared/ui/Text';
import styles from './Tooltip.module.scss';
import { classNames } from '@/shared/lib/classNames/classNames';

interface TooltipProps {
	classNameParent?: string;
}

export default function Tooltip({ classNameParent }: TooltipProps) {
	return (
		<div className={classNames(styles.tooltip, {}, [classNameParent])}>
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
