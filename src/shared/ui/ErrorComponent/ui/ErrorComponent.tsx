import {
	FontWeight,
	Text,
	TextColor,
	TextSize,
	TextType
} from '@/shared/ui/Text';
import Image from 'next/image';
import styles from './ErrorComponent.module.scss';

export interface ErrorComponentProps {
	children: React.ReactNode;
}

export function ErrorComponent({ children }: ErrorComponentProps) {
	return (
		<div className={styles.errorBlock}>
			<Image
				src='/images/something-went-wrong.svg'
				width={200}
				height={200}
				alt='Ошибка'
			/>
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
