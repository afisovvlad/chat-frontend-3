'use client';

import { Microphone, MicrophoneFilled } from '@icons/index';
import { useEffect } from 'react';
import { useVoiceRecorder } from '../../model/hooks/useVoiceRecorder';
import styles from './VoiceRecorder.module.scss';
import { FilePayload } from '../../model/types/types';

interface VoiceRecorderProps {
	onSendVoice: (file: FilePayload) => void;
}

export function VoiceRecorder({ onSendVoice }: VoiceRecorderProps) {
	const { startRecording, stopRecording, isRecording, audioFile, audioName } =
		useVoiceRecorder();

	const handleStop = () => {
		stopRecording();
	};

	useEffect(() => {
		if (!audioFile || !audioName) {
			return;
		}

		onSendVoice({
			data: audioFile,
			filename: audioName
		});
	}, [audioFile, audioName, onSendVoice]);

	return (
		<button
			type='button'
			onMouseDown={startRecording}
			onMouseUp={handleStop}
			onTouchStart={startRecording}
			onTouchEnd={handleStop}
			className={styles.button}
			aria-label='Начать запись голосового сообщения'
		>
			{isRecording ? (
				<MicrophoneFilled className={styles.icon} />
			) : (
				<Microphone className={styles.icon} />
			)}
		</button>
	);
}
// 'use client';

// import { Microphone, MicrophoneFilled } from '@icons/index';
// import { useEffect } from 'react';
// import { useVoiceRecorder } from '../../model/hooks/useVoiceRecorder';
// import styles from './VoiceRecorder.module.scss';
// import { FilePayload } from '../../model/types/types';

// interface VoiceRecorderProps {
// 	onSendVoice: (file: FilePayload) => void;
// }

// export function VoiceRecorder({ onSendVoice }: VoiceRecorderProps) {
// 	const { startRecording, stopRecording, isRecording, audioFile, audioName } =
// 		useVoiceRecorder();

// 	const handleStop = () => {
// 		stopRecording();
// 	};

// 	useEffect(() => {
// 		if (audioFile && audioName) {
// 			onSendVoice({
// 				data: audioFile,
// 				filename: audioName
// 			});
// 		}
// 	}, [audioFile, audioName, onSendVoice]);

// 	return (
// 		<button
// 			type='button'
// 			onMouseDown={startRecording}
// 			onMouseUp={handleStop}
// 			onTouchStart={startRecording}
// 			onTouchEnd={handleStop}
// 			className={styles.button}
// 			aria-label='Начать запись голосового сообщения'
// 		>
// 			{isRecording ? (
// 				<MicrophoneFilled className={styles.icon} />
// 			) : (
// 				<Microphone className={styles.icon} />
// 			)}
// 		</button>
// 	);
// }
