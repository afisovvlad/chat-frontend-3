'use client';

import { useCallback, useState, useRef } from 'react'; // ← useEffect больше не нужен для cleanup
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector/useAppSelector';
import { sendMessage } from '../../../../model/lib/service/sendMessage/sendMessage';
import { AttachmentButton } from '../AttachmentButton/AttachmentButton';
import { MessageForm, MessageFormRef } from '../MessageForm/MessageForm';
import { VoiceRecorder } from '../VoiceRecorder/VoiceRecorder';
import { Button, ButtonColor, ButtonType } from '@/shared/ui/Button';
import { SendIcon } from '@icons/index';
import { chatApi } from '@/entities/Chat/api/chatApi';
import {
	ChatMessage,
	ChatType,
	GetMessagesRequest,
	MessageType,
	VoiceFile
} from '@/entities/Chat/model/types/chat.types/chat.types';
import { selectCurrentUserId } from '@/entities/Profile';
import { logger } from '@/shared/lib/logger/logger';

import cls from './MessageFormComponent.module.scss';

export interface MessageFormComponentProps {
	chatUid: string;
	chatType?: ChatType;
	messagesQueryArgs?: GetMessagesRequest | null;
	chatKey?: string;
}

export function MessageFormComponent({
	chatUid,
	chatType,
	messagesQueryArgs,
	chatKey
}: MessageFormComponentProps) {
	const [files, setFiles] = useState<VoiceFile[]>([]);
	const [isTextFilled, setIsTextFilled] = useState<boolean>(false);
	const [messageText, setMessageText] = useState('');

	const formRef = useRef<MessageFormRef>(null);

	const currentUserId = useAppSelector(selectCurrentUserId);
	const dispatch = useAppDispatch();

	const handleSend = useCallback(
		async (message: string) => {
			if (!currentUserId || !messagesQueryArgs) {
				return;
			}

			try {
				const optimisticMsg: ChatMessage = {
					id: -1,
					uid: `temp_${Date.now()}`,
					from_user: currentUserId,
					content: message,
					files_summary: { types: [], count: files.length },
					has_replied_message: false,
					has_forwarded_message: false,
					new: true,
					created_at: Math.floor(Date.now() / 1000),
					updated_at: Math.floor(Date.now() / 1000),
					type: MessageType.TEXT
				};

				dispatch(
					chatApi.util.updateQueryData(
						'getMessages',
						messagesQueryArgs,
						draft => {
							draft.results.unshift(optimisticMsg);
						}
					)
				);

				await sendMessage(
					chatUid,
					chatType ?? ChatType.CHAT,
					{ content: message, files: files.length ? files : [] },
					currentUserId,
					chatKey
				);

				setFiles([]);
				setMessageText('');
			} catch (error) {
				logger.error('Failed to send message:', error);
			}
		},
		[
			chatUid,
			chatType,
			files,
			dispatch,
			currentUserId,
			messagesQueryArgs,
			chatKey
		]
	);

	const handleSendVoice = useCallback(
		async (voice: VoiceFile) => {
			if (!currentUserId) {
				return;
			}

			try {
				await sendMessage(
					chatUid,
					chatType ?? ChatType.CHAT,
					{ files: [voice] },
					currentUserId,
					chatKey
				);

				dispatch(
					chatApi.util.invalidateTags([{ type: 'Messages', id: 'LIST' }])
				);
			} catch (error) {
				logger.error('Failed to send voice:', error);
			}
		},
		[chatUid, chatType, dispatch, currentUserId, chatKey]
	);

	return (
		<section className={cls.messageFormComponent}>
			<AttachmentButton setFiles={setFiles} disabled={!chatUid} />

			<MessageForm
				ref={formRef}
				onSendContent={handleSend}
				disabled={!chatUid}
				onTextChanged={setIsTextFilled}
				onMessageChange={setMessageText}
				onReset={() => setMessageText('')}
			/>

			{!isTextFilled ? (
				<VoiceRecorder onSendVoice={handleSendVoice} disabled={!chatUid} />
			) : (
				<Button
					btnType={ButtonType.BUTTON}
					color={ButtonColor.TRANSPARENT}
					className={cls.button}
					aria-label='Отправить сообщение'
					disabled={!chatUid || !messageText.trim()}
					onClick={() => {
						const trimmed = messageText.trim();
						if (trimmed) {
							handleSend(trimmed);
							formRef.current?.reset();
						}
					}}
				>
					<SendIcon width={36} height={36} />
				</Button>
			)}
		</section>
	);
}
