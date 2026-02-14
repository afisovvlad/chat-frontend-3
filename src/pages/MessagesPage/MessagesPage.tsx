import { MessageFormComponent } from '@/features/message';
import styles from './MessagesPage.module.scss';

export function MessagesPage() {
	return (
		<section className={styles.messages}>
			<MessageFormComponent />
		</section>
	);
}
