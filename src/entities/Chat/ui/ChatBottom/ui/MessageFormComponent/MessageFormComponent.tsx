'use client';

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendMessage } from '../../model/lib/sendMessage';
import { VoiceFile } from '../../model/types/types';
import { AttachmentButton } from '../AttachmentButton/AttachmentButton';
import { MessageForm } from '../MessageForm/MessageForm';
import { VoiceRecorder } from '../VoiceRecorder/VoiceRecorder';
import { Button, ButtonColor, ButtonType } from '@/shared/ui/Button';
import { SendIcon } from '@icons/index';

import cls from './MessageFormComponent.module.scss';
import { chatApi } from '@/entities/Chat/api/chatApi';

export interface MessageFormComponentProps {
	chatUid: string;
}

export function MessageFormComponent({ chatUid }: MessageFormComponentProps) {
	const dispatch = useDispatch();
	const [files, setFiles] = useState<VoiceFile[]>([]);
	const [isTextFilled, setIsTextFilled] = useState(false); // 🔹 Состояние: есть ли текст

	const handleSend = useCallback(
		async (message: string) => {
			try {
				await sendMessage(chatUid, {
					content: message,
					files: files.length ? files : []
				});

				dispatch(
					chatApi.util.invalidateTags([
						{ type: 'Messages', id: 'LIST' },
						{ type: 'Chats', id: 'LIST' }
					])
				);

				setFiles([]);
			} catch (error) {
				if (process.env.NODE_ENV === 'development') {
					console.error('Failed to send message:', error);
				}
			}
		},
		[chatUid, files, dispatch]
	);

	const handleSendVoice = useCallback(
		async (voice: VoiceFile) => {
			try {
				await sendMessage(chatUid, { files: [voice] });

				dispatch(
					chatApi.util.invalidateTags([
						{ type: 'Messages', id: 'LIST' },
						{ type: 'Chats', id: 'LIST' }
					])
				);
			} catch (error) {
				if (process.env.NODE_ENV === 'development') {
					console.error('Failed to send voice:', error);
				}
			}
		},
		[chatUid, dispatch]
	);

	return (
		<section className={cls.messageFormComponent}>
			<AttachmentButton setFiles={setFiles} disabled={!chatUid} />

			<MessageForm
				onSendContent={handleSend}
				disabled={!chatUid}
				onTextChanged={setIsTextFilled} // 🔹 Передаём коллбэк
			/>

			{/* 🔹 Условный рендер: микрофон ИЛИ кнопка отправки */}
			{!isTextFilled ? (
				<VoiceRecorder onSendVoice={handleSendVoice} disabled={!chatUid} />
			) : (
				<Button
					btnType={ButtonType.SUBMIT}
					color={ButtonColor.TRANSPARENT}
					className={cls.button}
					aria-label='Отправить сообщение'
					disabled={!chatUid}
					onClick={() => {
						// Триггерим отправку: находим форму и вызываем submit
						const form = document.querySelector<HTMLFormElement>(
							`form.${cls.messageForm}`
						);
						form?.requestSubmit();
					}}
				>
					<SendIcon width={36} height={36} />
				</Button>
			)}
		</section>
	);
}
