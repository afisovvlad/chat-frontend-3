import { Microphone } from '@icons/index';
import styles from './VoiceButton.module.scss';
import { Button, ButtonColor } from '@/shared/ui/Button';

export function VoiceButton() {
	return (
		<Button
			color={ButtonColor.TRANSPARENT}
			className={styles.button}
			aria-label='Начать запись голосового сообщения'
		>
			<Microphone className={styles.icon} />
		</Button>
	);
}
