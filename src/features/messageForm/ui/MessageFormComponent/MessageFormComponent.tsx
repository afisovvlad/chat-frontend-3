'use client';

import { useState } from 'react';
import { sendMessage } from '../../model/lib/sendMessage';
import { FilePayload } from '../../model/types/types';
import { AttachmentButton } from '../AttachmentButton/AttachmentButton';
import { MessageForm } from '../MessageForm/MessageForm';
import { VoiceRecorder } from '../VoiceRecorder/VoiceRecorder';
import styles from './MessageFormComponent.module.scss';
import { SendButton } from '../SendButton/SendButton';

export function MessageFormComponent() {
	// { userUid }: { userUid: string }
	// Тестовые uid - потом подключить реальные
	const userUid = '2089f9d3-ea44-4d30-876a-ddf177fa352a'; //5555555555
	// const userUid = '54cdbe82-28aa-4abf-a69d-525d0ab4da93';  // 7777777777
	const [files, setFiles] = useState<FilePayload[]>([]);
	const [filledField, setFilledField] = useState(false);

	const handleSend = async (message: string) => {
		const textResponse = await sendMessage(userUid, {
			content: message,
			files: files ? files : []
		});
		console.log('textResponse', textResponse);
		setFiles([]);
	};

	const handleSendVoice = async (voice: FilePayload) => {
		const voiceResp = await sendMessage(userUid, { files: [voice] });
		console.log('voiceResp', voiceResp);
	};

	return (
		<section className={styles.messageFormComponent}>
			<AttachmentButton setFiles={setFiles} />
			<MessageForm
				onSendContent={handleSend}
				filledField={filledField}
				setFilledField={setFilledField}
			/>
			{!filledField && <VoiceRecorder onSendVoice={handleSendVoice} />}
		</section>
	);
}

// const handleSend = async (message: string) => {
// 	await sendMessage(userUid, { content: message, files: files ? files : [] });
// 	setFiles([]);
// };

// const handleSendVoice = async (voice: FilePayload) => {
// 	await sendMessage(userUid, { files: [voice] });
// };

// **Убрать *********
// const handleSendFile = async (file: FilePayload, caption?: string) => {
// 	await sendMessage(userUid, {
// 		content: caption,
// 		files: [file]
// 	});
// };

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
