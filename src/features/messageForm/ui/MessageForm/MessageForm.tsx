'use client';

import {
	connectChat,
	createTextMessage,
	subscribeWS
} from '@/shared/api/WS/services/socketClient/socketClient';
import { Form, Textarea } from '@/shared/ui/FormComponent';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MessageFormType } from '../../model/types/types';
import { AttachmentButton } from '../AttachmentButton/AttachmentButton';
import { EmojiPickerComponent } from '../EmojiPickerComponent/EmojiPickerComponent';
import styles from './MessageForm.module.scss';

export function MessageForm() {
	const [messages, setMessages] = useState([]);
	const methods = useForm<MessageFormType>({
		defaultValues: {
			message: ''
		}
	});
	const { setValue, getValues, handleSubmit, reset } = methods;
	// const chatKey = '1';
	const userUid = '2089f9d3-ea44-4d30-876a-ddf177fa352a';
	// const userUid = '54cdbe82-28aa-4abf-a69d-525d0ab4da93';
	console.log('messages', messages);

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(onSubmit)();
		}
		// При Shift+Enter оставляем стандартное поведение (перевод строки)
	};

	const onEmojiSelect = (emoji: string) => {
		const currentMessage = getValues('message');
		setValue('message', currentMessage + emoji, {
			shouldDirty: true,
			shouldTouch: true
		});
	};

	// Подключаемся к чату
	useEffect(() => {
		connectChat();
	}, []);

	// Проверка получения сообщения в чате
	useEffect(() => {
		const unsubscribe = subscribeWS('create_text_message', data => {
			setMessages(prev => [...prev, data.object]);
		});

		return unsubscribe;
	}, []);

	const onSubmit = async (data: MessageFormType) => {
		console.log(data);
		if (!data.message.trim()) {
			return;
		}

		try {
			const response = await createTextMessage(userUid, data.message);
			console.log('response WS', response);
		} catch (err) {
			console.log('Ошибка отправки сообщения', err);
		}
		reset();
	};

	return (
		<Form<MessageFormType>
			methods={methods}
			onSubmit={onSubmit}
			className={styles.messageForm}
		>
			<AttachmentButton />
			<div className={styles.textareaWrapper}>
				<Textarea
					name={'message'}
					classNameTextarea={styles.textarea}
					height={'21px'}
					onKeyDown={handleKeyDown}
				/>
				<EmojiPickerComponent onEmojiSelect={onEmojiSelect} />
			</div>
		</Form>
	);
}
