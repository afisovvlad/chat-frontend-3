import { AttachmentButton } from '../AttachmentButton/AttachmentButton';
import { MessageForm } from '../MessageForm/MessageForm';
import { VoiceButton } from '../VoiceButton/VoiceButton';
import styles from './MessageComponent.module.scss';

export function MessageFormComponent() {
	return (
		<section className={styles.message}>
			<AttachmentButton />
			<MessageForm />
			<VoiceButton />
		</section>
	);
}
