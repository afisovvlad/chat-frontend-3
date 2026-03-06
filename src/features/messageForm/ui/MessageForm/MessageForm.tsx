'use client';

import {
	connectChat,
	subscribeWS
} from '@/shared/api/WS/services/socketClient/socketClient';
import { Form, Textarea } from '@/shared/ui/FormComponent';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MessageFormTypes } from '../../model/types/types';
import { EmojiPickerComponent } from '../EmojiPickerComponent/EmojiPickerComponent';
import styles from './MessageForm.module.scss';

interface MessageFormProps {
	onSendContent: (message: string) => void;
	// onSendFile: (file: FilePayload, caption?: string) => void;
	// files: FilePayload[];
}

export function MessageForm({
	onSendContent
	// onSendFile,
	// files
}: MessageFormProps) {
	const [messages, setMessages] = useState([]);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const methods = useForm<MessageFormTypes>({
		defaultValues: {
			message: ''
			// file: {
			// 	filename: '',
			// 	data: ''
			// }
		}
	});
	const { setValue, getValues, handleSubmit, reset } = methods;

	console.log('messages', messages);

	// Отмена переноса на следующую строку при Enter,  при Shift+Enter оставляем стандартное поведение (перевод строки)
	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(onSubmit)();
		}
	};

	const onEmojiSelect = (emoji: string) => {
		const textarea = textareaRef.current;
		if (!textarea) {
			return;
		}

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;

		const currentMessage = getValues('message');

		const newMessage =
			currentMessage.slice(0, start) + emoji + currentMessage.slice(end);

		setValue('message', newMessage, {
			shouldDirty: true,
			shouldTouch: true
		});

		// Ставим курсор после emoji
		requestAnimationFrame(() => {
			const cursor = start + emoji.length;

			textarea.selectionStart = cursor;
			textarea.selectionEnd = cursor;
			textarea.focus();
		});
	};

	// Подключаемся к чату
	useEffect(() => {
		connectChat();
	}, []);

	// Проверка получения сообщения в чате (убрать отсюда, перенести в сообщения)
	useEffect(() => {
		const unsubscribe = subscribeWS('create_text_message', data => {
			setMessages(prev => [...prev, data.object]);
		});

		return unsubscribe;
	}, []);

	const onSubmit = async (data: MessageFormTypes) => {
		console.log('data', data);
		if (!data.message.trim()) {
			return;
		}
		await onSendContent(data.message);
		reset();
	};
	// const onSubmit = async (data: MessageFormTypes) => {
	// 	console.log('data', data);
	// 	if (!data.content.trim()) {
	// 		return;
	// 	}
	// 	// const files = [data.file];
	// 	try {
	// 		// await createTextMessageForUser(userUid, data.message);
	// 		const response = await createTextMessageForUser(
	// 			userUid,
	// 			data.content
	// 			// files
	// 		);
	// 		console.log('response WS', response);
	// 	} catch (err) {
	// 		console.log('Ошибка отправки сообщения', err);
	// 	}
	// 	reset();
	// 	// сбрасываем высоту Textarea до дефолтной
	// 	if (textareaRef.current) {
	// 		textareaRef.current.style.height = '21px';
	// 	}
	// };

	return (
		<Form<MessageFormTypes>
			methods={methods}
			onSubmit={onSubmit}
			className={styles.messageForm}
		>
			<div className={styles.textareaWrapper}>
				<Textarea
					name={'message'}
					classNameTextarea={styles.textarea}
					height={'21px'}
					onKeyDown={handleKeyDown}
					textareaRef={textareaRef}
					placeholder={'Сообщение...'}
				/>
				<EmojiPickerComponent onEmojiSelect={onEmojiSelect} />
			</div>
			{/* <VoiceRecorder
				onRecorded={(audioFile, audioName) => {
					setValue('file', {
						filename: audioName,
						data: audioFile
					});
				}}
			/> */}
		</Form>
	);
}

// ***old *************
// 'use client';

// import {
// 	connectChat,
// 	createTextMessageForUser,
// 	subscribeWS
// } from '@/shared/api/WS/services/socketClient/socketClient';
// import { Form, Textarea } from '@/shared/ui/FormComponent';
// import { KeyboardEvent, useEffect, useRef, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { FilePayload, MessageFormTypes } from '../../model/types/types';
// import { EmojiPickerComponent } from '../EmojiPickerComponent/EmojiPickerComponent';
// import { VoiceRecorder } from '../VoiceRecorder/VoiceRecorder';
// import styles from './MessageForm.module.scss';

// interface MessageFormProps {
// 	onSendContent: (content: string) => void;
// 	onSendFile: (file: FilePayload, caption?: string) => void;
// 	files: FilePayload[];
// }

// export function MessageForm({
// 	onSendContent,
// 	onSendFile,
// 	files
// }: MessageFormProps) {
// 	const [messages, setMessages] = useState([]);
// 	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
// 	const methods = useForm<MessageFormTypes>({
// 		defaultValues: {
// 			content: '',
// 			file: {
// 				filename: '',
// 				data: ''
// 			}
// 		}
// 	});
// 	const { setValue, getValues, handleSubmit, reset } = methods;
// 	// Тестовые uid - потом подключить реальные
// 	const userUid = '2089f9d3-ea44-4d30-876a-ddf177fa352a'; //5555555555
// 	// const userUid = '54cdbe82-28aa-4abf-a69d-525d0ab4da93';  // 7777777777
// 	console.log('messages', messages);

// 	// Отмена переноса на следующую строку при Enter,  при Shift+Enter оставляем стандартное поведение (перевод строки)
// 	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
// 		if (e.key === 'Enter' && !e.shiftKey) {
// 			e.preventDefault();
// 			handleSubmit(onSubmit)();
// 		}
// 	};

// 	const onEmojiSelect = (emoji: string) => {
// 		const textarea = textareaRef.current;
// 		if (!textarea) {
// 			return;
// 		}

// 		const start = textarea.selectionStart;
// 		const end = textarea.selectionEnd;

// 		const currentMessage = getValues('content');

// 		const newMessage =
// 			currentMessage.slice(0, start) + emoji + currentMessage.slice(end);

// 		setValue('content', newMessage, {
// 			shouldDirty: true,
// 			shouldTouch: true
// 		});

// 		// Ставим курсор после emoji
// 		requestAnimationFrame(() => {
// 			const cursor = start + emoji.length;

// 			textarea.selectionStart = cursor;
// 			textarea.selectionEnd = cursor;
// 			textarea.focus();
// 		});
// 	};

// 	// Подключаемся к чату
// 	useEffect(() => {
// 		connectChat();
// 	}, []);

// 	// Проверка получения сообщения в чате (убрать отсюда, перенести в сообщения)
// 	useEffect(() => {
// 		const unsubscribe = subscribeWS('create_text_message', data => {
// 			setMessages(prev => [...prev, data.object]);
// 		});

// 		return unsubscribe;
// 	}, []);

// 	const onSubmit = async (data: MessageFormTypes) => {
// 		console.log('data', data);
// 		if (!data.content.trim() && !data.file.data) {
// 			return;
// 		}
// 		const files = [data.file];
// 		try {
// 			// await createTextMessageForUser(userUid, data.message);
// 			const response = await createTextMessageForUser(
// 				userUid,
// 				data.content,
// 				files
// 			);
// 			console.log('response WS', response);
// 		} catch (err) {
// 			console.log('Ошибка отправки сообщения', err);
// 		}
// 		reset();
// 		// сбрасываем высоту Textarea до дефолтной
// 		if (textareaRef.current) {
// 			textareaRef.current.style.height = '21px';
// 		}
// 	};

// 	return (
// 		<Form<MessageFormTypes>
// 			methods={methods}
// 			onSubmit={onSubmit}
// 			className={styles.messageForm}
// 		>
// 			<div className={styles.textareaWrapper}>
// 				<Textarea
// 					name={'message'}
// 					classNameTextarea={styles.textarea}
// 					height={'21px'}
// 					onKeyDown={handleKeyDown}
// 					textareaRef={textareaRef}
// 					placeholder={'Сообщение...'}
// 				/>
// 				<EmojiPickerComponent onEmojiSelect={onEmojiSelect} />
// 			</div>
// 			<VoiceRecorder
// 				onRecorded={(audioFile, audioName) => {
// 					setValue('file', {
// 						filename: audioName,
// 						data: audioFile
// 					});
// 				}}
// 			/>
// 		</Form>
// 	);
// }

// ************old-old *****
// 'use client';

// import {
// 	connectChat,
// 	createTextMessageForUser,
// 	subscribeWS
// } from '@/shared/api/WS/services/socketClient/socketClient';
// import { Form, Textarea } from '@/shared/ui/FormComponent';
// import { KeyboardEvent, useEffect, useRef, useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { MessageFormType } from '../../model/types/types';
// import { AttachmentButton } from '../AttachmentButton/AttachmentButton';
// import { EmojiPickerComponent } from '../EmojiPickerComponent/EmojiPickerComponent';
// import { VoiceRecorder } from '../VoiceRecorder/VoiceRecorder';
// import styles from './MessageForm.module.scss';

// export function MessageForm() {
// 	const [messages, setMessages] = useState([]);
// 	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
// 	const methods = useForm<MessageFormType>({
// 		defaultValues: {
// 			message: '',
// 			file: {
// 				filename: '',
// 				data: ''
// 			}
// 		}
// 	});
// 	const { setValue, getValues, handleSubmit, reset } = methods;
// 	// Тестовые uid - потом подключить реальные
// 	const userUid = '2089f9d3-ea44-4d30-876a-ddf177fa352a'; //5555555555
// 	// const userUid = '54cdbe82-28aa-4abf-a69d-525d0ab4da93';  // 7777777777
// 	console.log('messages', messages);

// 	// Отмена переноса на следующую строку при Enter,  при Shift+Enter оставляем стандартное поведение (перевод строки)
// 	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
// 		if (e.key === 'Enter' && !e.shiftKey) {
// 			e.preventDefault();
// 			handleSubmit(onSubmit)();
// 		}
// 	};

// 	const onEmojiSelect = (emoji: string) => {
// 		const textarea = textareaRef.current;
// 		if (!textarea) {
// 			return;
// 		}

// 		const start = textarea.selectionStart;
// 		const end = textarea.selectionEnd;

// 		const currentMessage = getValues('message');

// 		const newMessage =
// 			currentMessage.slice(0, start) + emoji + currentMessage.slice(end);

// 		setValue('message', newMessage, {
// 			shouldDirty: true,
// 			shouldTouch: true
// 		});

// 		// Ставим курсор после emoji
// 		requestAnimationFrame(() => {
// 			const cursor = start + emoji.length;

// 			textarea.selectionStart = cursor;
// 			textarea.selectionEnd = cursor;
// 			textarea.focus();
// 		});
// 	};

// 	// Подключаемся к чату
// 	useEffect(() => {
// 		connectChat();
// 	}, []);

// 	// Проверка получения сообщения в чате (убрать отсюда, перенести в сообщения)
// 	useEffect(() => {
// 		const unsubscribe = subscribeWS('create_text_message', data => {
// 			setMessages(prev => [...prev, data.object]);
// 		});

// 		return unsubscribe;
// 	}, []);

// 	const onSubmit = async (data: MessageFormType) => {
// 		console.log('data', data);
// 		if (!data.message.trim() && !data.file.data) {
// 			return;
// 		}
// 		const files = [data.file];
// 		try {
// 			// await createTextMessageForUser(userUid, data.message);
// 			const response = await createTextMessageForUser(
// 				userUid,
// 				data.message,
// 				files
// 			);
// 			console.log('response WS', response);
// 		} catch (err) {
// 			console.log('Ошибка отправки сообщения', err);
// 		}
// 		reset();
// 		// сбрасываем высоту Textarea до дефолтной
// 		if (textareaRef.current) {
// 			textareaRef.current.style.height = '21px';
// 		}
// 	};

// 	return (
// 		<Form<MessageFormType>
// 			methods={methods}
// 			onSubmit={onSubmit}
// 			className={styles.messageForm}
// 		>
// 			<AttachmentButton />
// 			<div className={styles.textareaWrapper}>
// 				<Textarea
// 					name={'message'}
// 					classNameTextarea={styles.textarea}
// 					height={'21px'}
// 					onKeyDown={handleKeyDown}
// 					textareaRef={textareaRef}
// 					placeholder={'Сообщение...'}
// 				/>
// 				<EmojiPickerComponent onEmojiSelect={onEmojiSelect} />
// 			</div>
// 			<VoiceRecorder
// 				onRecorded={(audioFile, audioName) => {
// 					setValue('file', {
// 						filename: audioName,
// 						data: audioFile
// 					});
// 				}}
// 			/>
// 		</Form>
// 	);
// }
