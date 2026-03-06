import { MessageFormComponent } from '@/features/messageForm';
import { Messages } from '@/entities/Messages';
import MessageHeader from './MesageHeader';
import styles from './MessagesPage.module.scss';

export function MessagesPage({ chatUid }: { chatUid: string }) {
	return (
		<section className={styles.messagesPage}>
			<MessageHeader />
			<Messages />
			<MessageFormComponent chatUid={chatUid} />
		</section>
	);
}
