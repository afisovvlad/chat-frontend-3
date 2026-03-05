import { MessageForm } from '../MessageForm/MessageForm';
import { VoiceButton } from '../VoiceButton/VoiceButton';
import styles from './MessageFormComponent.module.scss';

export function MessageFormComponent() {
	return (
		<section className={styles.messageFormComponent}>
			<MessageForm />
			<VoiceButton />
		</section>
	);
}
