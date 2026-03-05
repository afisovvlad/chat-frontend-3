'use client';

import { Microphone, MicrophoneFilled } from '@icons/index';
import { useVoiceRecorder } from '../../model/hooks/useVoiceRecorder';
import styles from './VoiceRecorder.module.scss';

interface VoiceRecorderProps {
	onRecorded: (blob: Blob) => void;
}

export function VoiceRecorder({ onRecorded }: VoiceRecorderProps) {
	const { startRecording, stopRecording, isRecording, audioBlob } =
		useVoiceRecorder();

	const handleStop = () => {
		stopRecording();
	};

	if (audioBlob) {
		onRecorded(audioBlob);
	}

	return (
		<button
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
