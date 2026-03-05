'use client';

import { MessageForm } from '../MessageForm/MessageForm';
import styles from './MessageFormComponent.module.scss';

export function MessageFormComponent() {
	return (
		<section className={styles.messageFormComponent}>
			<MessageForm />
			{/* <VoiceRecorder
				onRecorded={blob => {
					setValue('voice', blob);
				}}
			/> */}
		</section>
	);
}
