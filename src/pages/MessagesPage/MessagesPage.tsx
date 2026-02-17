import { MessageFormComponent } from '@/features/messageForm';
import AiratComponent from './AiratComponent';
import styles from './MessagesPage.module.scss';
import { Messages } from '@/entities/Messages';

export function MessagesPage() {
	return (
		<section className={styles.messagesPage}>
			{/* Айрат, - AiratComponent замени на свой компонент */}
			<AiratComponent />
			<Messages />
			<MessageFormComponent />
		</section>
	);
}
