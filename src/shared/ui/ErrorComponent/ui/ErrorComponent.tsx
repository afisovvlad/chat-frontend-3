import {
	FontWeight,
	Text,
	TextColor,
	TextSize,
	TextType
} from '@/shared/ui/Text';
import { Error } from '@icons/index';
import styles from './ErrorComponent.module.scss';

export interface ErrorComponentProps {
	children: React.ReactNode;
}

export function ErrorComponent({ children }: ErrorComponentProps) {
	return (
		<div className={styles.errorBlock}>
			<Error width={200} height={200} className={styles.errorIcon} />
			<Text
				type={TextType.TEXT}
				fontSize={TextSize.S}
				color={TextColor.ERROR}
				fontWeight={FontWeight.REGULAR}
				className={styles.errorText}
			>
				{children}
			</Text>
		</div>
	);
}
