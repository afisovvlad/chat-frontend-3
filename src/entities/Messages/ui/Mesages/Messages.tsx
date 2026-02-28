import { MessageBubble } from '@/entities/Chat/ui/MessageBubble/MessageBubble';
import styles from './Messages.module.scss';

export function Messages() {
	return (
		<div className={styles.messages}>
			<MessageBubble
				id={'aaa'}
				time={1772236560}
				text={'hi'}
				status={'received'}
				onClick={() => {}}
				isGroupChat={true}
				senderName={'Stacy'}
				senderAvatar={
					'https://i.pinimg.com/736x/03/07/fd/0307fdc3552ddf80295158aea0737ae4.jpg'
				}
				isFirstInGroup={true}
				isLastInGroup={false}
			/>
			<MessageBubble
				id={'aaa'}
				time={1772236560}
				text={'hello'}
				status={'received'}
				onClick={() => {}}
				isGroupChat={true}
				senderName={'Stacy'}
				senderAvatar={
					'https://i.pinimg.com/736x/03/07/fd/0307fdc3552ddf80295158aea0737ae4.jpg'
				}
				isFirstInGroup={false}
				isLastInGroup={false}
			/>
			<MessageBubble
				id={'aaa'}
				time={1772236560}
				text={'hii'}
				status={'received'}
				onClick={() => {}}
				isGroupChat={true}
				senderName={'Stacy'}
				senderAvatar={
					'https://i.pinimg.com/736x/03/07/fd/0307fdc3552ddf80295158aea0737ae4.jpg'
				}
				isFirstInGroup={false}
				isLastInGroup={true}
			/>
		</div>
	);
}
