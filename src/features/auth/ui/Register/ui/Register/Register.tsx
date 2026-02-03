import { RegisterForm } from '@/features/auth';
import {
	FontWeight,
	Text,
	TextColor,
	TextSize,
	TextType
} from '@/shared/ui/Text';
import styles from './Register.module.scss';

export function Register() {
	return (
		<div>
			<Text
				type={TextType.TEXT}
				fontSize={TextSize.L}
				color={TextColor.GRAY}
				fontWeight={FontWeight.REGULAR}
				className={styles.text}
			>
				Пожалуйста, заполните данные
			</Text>
			<RegisterForm />
		</div>
	);
}
