'use client';

import { useState } from 'react';
import { FilePayload } from '../../model/types/types';
import { AttachmentButton } from '../AttachmentButton/AttachmentButton';
import { MessageForm } from '../MessageForm/MessageForm';
import styles from './MessageFormComponent.module.scss';
import { sendMessage } from '../../model/lib/sendMessage';
import { VoiceRecorder } from '../VoiceRecorder/VoiceRecorder';

export function MessageFormComponent({ userUid }: { userUid: string }) {
	const [files, setFiles] = useState<FilePayload[]>([]);

	const handleSendText = async (content: string) => {
		await sendMessage(userUid, { content });
	};

	const handleSendVoice = async (voice: FilePayload) => {
		await sendMessage(userUid, { files: [voice] });
	};

	const handleSendFile = async (file: FilePayload, caption?: string) => {
		await sendMessage(userUid, {
			content: caption,
			files: [file]
		});
	};

	return (
		<section className={styles.messageFormComponent}>
			<AttachmentButton setFile={setFiles} />
			<MessageForm
				onSendContent={handleSendText}
				files={files}
				onSendFile={handleSendFile}
			/>
			<VoiceRecorder onSendVoice={handleSendVoice} />
		</section>
	);
}
// 'use client';

// import { MessageForm } from '../MessageForm/MessageForm';
// import styles from './MessageFormComponent.module.scss';

// export function MessageFormComponent() {
// 	return (
// 		<section className={styles.messageFormComponent}>
// 			<MessageForm />
// 			{/* <VoiceRecorder
// 				onRecorded={blob => {
// 					setValue('voice', blob);
// 				}}
// 			/> */}
// 		</section>
// 	);
// }
