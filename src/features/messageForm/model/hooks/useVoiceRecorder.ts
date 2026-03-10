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
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

		const mimeType = MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
			? 'audio/ogg;codecs=opus'
			: 'audio/webm;codecs=opus';

		const mediaRecorder = new MediaRecorder(stream, {
			mimeType,
			audioBitsPerSecond: 24000
		});

		mediaRecorderRef.current = mediaRecorder;
		chunks.current = [];

		mediaRecorder.ondataavailable = e => {
			chunks.current.push(e.data);
		};

		mediaRecorder.onstop = async () => {
			const blob = new Blob(chunks.current, { type: mimeType });

			stream.getTracks().forEach(track => track.stop());

			const ext = mimeType.includes('ogg') ? 'ogg' : 'webm';

			const base64 = await blobToBase64(blob);
			const filename = `voice_${crypto.randomUUID()}.${ext}`;

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

// ************
// 'use client';

// import { useRef, useState } from 'react';
// import { blobToBase64 } from '../lib/blobToBase64';

// export const useVoiceRecorder = () => {
// 	const [isRecording, setIsRecording] = useState(false);
// 	const [audioFile, setAudioFile] = useState('');
// 	const [audioName, setAudioName] = useState('');
// 	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
// 	const chunks = useRef<Blob[]>([]);

// 	const startRecording = async () => {
// 		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

// 		const mimeType = MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
// 			? 'audio/ogg;codecs=opus'
// 			: 'audio/webm;codecs=opus';

// 		const mediaRecorder = new MediaRecorder(stream, { mimeType });

// 		mediaRecorderRef.current = mediaRecorder;
// 		chunks.current = [];

// 		mediaRecorder.ondataavailable = e => {
// 			chunks.current.push(e.data);
// 		};

// 		mediaRecorder.onstop = async () => {
// 			const blob = new Blob(chunks.current, { type: mimeType });

// 			stream.getTracks().forEach(track => track.stop());

// 			const ext = mimeType.includes('ogg') ? 'ogg' : 'webm';

// 			const base64 = await blobToBase64(blob);
// 			const filename = `voice_${crypto.randomUUID()}.${ext}`;

// 			setAudioName(filename);
// 			setAudioFile(base64);
// 		};

// 		mediaRecorder.start();
// 		setIsRecording(true);
// 	};

// 	const stopRecording = () => {
// 		if (mediaRecorderRef.current) {
// 			mediaRecorderRef.current.stop();
// 			setIsRecording(false);
// 		}
// 	};

// 	const reset = () => {
// 		setAudioFile('');
// 		setAudioName('');
// 	};

// 	return {
// 		isRecording,
// 		audioFile,
// 		startRecording,
// 		stopRecording,
// 		audioName,
// 		reset
// 	};
// };
