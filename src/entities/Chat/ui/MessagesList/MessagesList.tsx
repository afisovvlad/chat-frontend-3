'use client';

import React, { useMemo, useCallback } from 'react';
import {
	Message,
	MessageType,
	SystemMessageData,
	TextMessage
} from '../../model/types/chat.types/chat.types';
import { shouldShowDateSeparator } from '@/entities/Chat/model/lib/service/dateFormating/dateFormater';
import { MessageBubble } from '../MessageBubble/MessageBubble';
import { SmartDateSeparator } from '../SystemMessages/ui/SmartDateSeparator/SmartDateSeparator';
import {
	BubbleStatus,
	toBubbleStatus
} from '@/entities/Chat/model/lib/service/mapMessageStatus/mapMessageStatus';
import { StickyDateProvider } from '../SystemMessages/ui/StickyDateContext/StickyDateContext';
import SystemMessage from '../SystemMessages/ui/SystemMessages/SystemMessages';

import cls from './MessagesList.module.scss';

interface MessagesListProps {
	messages?: Message[];
	className?: string;
	onMessageClick?: (id: string) => void;
	currentUserId?: string;
}

type MessageListItem =
	| { type: 'message'; data: Message }
	| { type: 'separator'; data: Date; id: string };

export const MessagesList: React.FC<MessagesListProps> = ({
	messages = [],
	className = '',
	onMessageClick,
	currentUserId
}) => {
	const messagesWithSeparators = useMemo((): MessageListItem[] => {
		if (!messages?.length) {
			return [];
		}
		const result: MessageListItem[] = [];

		messages.forEach((message, index) => {
			const prev = index > 0 ? messages[index - 1] : undefined;
			if (shouldShowDateSeparator(message.createdAt, prev?.createdAt)) {
				result.push({
					type: 'separator',
					data: message.createdAt,
					id: `separator-${message.createdAt.getTime()}-${index}`
				});
			}
			result.push({ type: 'message', data: message });
		});
		return result;
	}, [messages]);

	const getBubbleStatus = useCallback(
		(message: TextMessage): BubbleStatus => {
			if (!currentUserId) {
				return 'received';
			}
			const isOutgoing = message.senderId === currentUserId;
			return toBubbleStatus(message.status, isOutgoing);
		},
		[currentUserId]
	);

	return (
		<StickyDateProvider>
			<div className={`${cls.messageList} ${className}`}>
				{messagesWithSeparators.map(item => {
					if (item.type === 'separator') {
						return (
							<SmartDateSeparator key={item.id} id={item.id} date={item.data} />
						);
					}

					const message = item.data;
					if (message.type === MessageType.SYSTEM) {
						return (
							<SystemMessage
								key={message.id}
								message={message as SystemMessageData}
							/>
						);
					}

					const textMessage = message as TextMessage;
					return (
						<MessageBubble
							key={textMessage.id}
							id={textMessage.id}
							time={textMessage.createdAt.getTime()}
							text={textMessage.content}
							status={getBubbleStatus(textMessage)}
							onClick={onMessageClick || (() => {})}
						/>
					);
				})}
			</div>
		</StickyDateProvider>
	);
};

export default MessagesList;
