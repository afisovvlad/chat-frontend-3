'use client';

import { useRef, useState } from 'react';
import { blobToBase64 } from '../lib/blobToBase64';

export const useVoiceRecorder = () => {
	const [isRecording, setIsRecording] = useState(false);
	const [audioFile, setAudioFile] = useState('');
	const [audioName, setAudioName] = useState('');
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

		mediaRecorder.onstop = async () => {
			const blob = new Blob(chunks.current, { type: 'audio/webm' });
			const base64 = await blobToBase64(blob);
			const filename = `${crypto.randomUUID()}.webm`;
			setAudioName(filename);
			setAudioFile(base64);
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
		setAudioFile('');
		setAudioName('');
	};

	return {
		isRecording,
		audioFile,
		startRecording,
		stopRecording,
		audioName,
		reset
	};
};
