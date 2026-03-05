'use client';

import { useRef, useState } from 'react';

export const useVoiceRecorder = () => {
	const [isRecording, setIsRecording] = useState(false);
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const chunks = useRef<Blob[]>([]);

	const startRecording = async () => {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true
		});

		const mediaRecorder = new MediaRecorder(stream);
		mediaRecorderRef.current = mediaRecorder;

		chunks.current = [];

		mediaRecorder.ondataavailable = event => {
			chunks.current.push(event.data);
		};

		mediaRecorder.onstop = () => {
			const blob = new Blob(chunks.current, { type: 'audio/webm' });
			setAudioBlob(blob);
		};

		mediaRecorder.start();
		setIsRecording(true);
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	};

	const reset = () => {
		setAudioBlob(null);
	};

	return {
		isRecording,
		audioBlob,
		startRecording,
		stopRecording,
		reset
	};
};
