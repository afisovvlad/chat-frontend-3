import { useMemo, useEffect, useState } from 'react';
import {
	ChatMessage,
	SystemMessageData
} from '../../../types/chat.types/chat.types';
import {
	isSystemMessageType,
	mapChatMessageToSystemMessageData
} from '../../../mapper/mapChatType/chatMapper';
import { shouldShowDateSeparator } from '../../service/dateFormating/dateFormater';
import { useGetMessagesQuery } from '@/entities/Chat/api/chatApi';
import { MESSAGES_QUERY_DEFAULTS } from '@/shared/model';
import { MessageOrdering } from '../../../../../../shared/model/constants/chat.constants';

export interface TextMessage {
	id: string;
	text: string;
	time: number;
	status: 'received' | 'sending' | 'unread' | 'read';
}

export type MessageListItem =
	| { type: 'text'; data: TextMessage }
	| { type: 'system'; data: SystemMessageData }
	| { type: 'separator'; date: Date; id: string };

export interface UseMessagesDataOptions {
	userUid: string;
	pageSize?: number;
	ordering?: string;
	skip?: boolean;
}

export interface UseMessagesDataReturn {
	messages: TextMessage[];
	messagesWithSeparators: MessageListItem[];
	nextUrl: string | null;
	isLoading: boolean;
	isError: boolean;
	error: unknown;
	refetch: () => void;
	hasMore: boolean;
	isEmpty: boolean;
}

const toLocalTextMessage = (msg: ChatMessage): TextMessage => ({
	id: String(msg.id),
	text: msg.content,
	time: msg.created_at,
	status: msg.new ? 'unread' : 'read'
});

export const useMessagesData = ({
	userUid,
	pageSize = MESSAGES_QUERY_DEFAULTS.page_size,
	ordering = MESSAGES_QUERY_DEFAULTS.ordering,
	skip = false
}: UseMessagesDataOptions): UseMessagesDataReturn => {
	const {
		data: response,
		isLoading,
		isError,
		error,
		refetch
	} = useGetMessagesQuery(
		{
			user_uid: userUid,
			page_size: pageSize,
			ordering: ordering as MessageOrdering
		},
		{ skip: skip || !userUid }
	);

	const [messages, setMessages] = useState<TextMessage[]>([]);
	const nextUrl = useMemo(() => response?.next ?? null, [response?.next]);

	useEffect(() => {
		if (!response?.results) {
			return;
		}

		const textMessages = response.results
			.filter((msg): msg is ChatMessage => !isSystemMessageType(msg))
			.map(toLocalTextMessage);

		// Это валидный кейс: мы аккумулируем пагинированные данные с бэка,
		// фильтруя дубликаты и сохраняя порядок. Это нельзя сделать через useMemo.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMessages(prev => {
			if (!prev.length) {
				return textMessages;
			}
			const prevIds = new Set(prev.map(p => p.id));
			const newMessages = textMessages.filter(m => !prevIds.has(m.id));

			if (newMessages.length) {
				return [...prev, ...newMessages];
			}
			return prev;
		});
	}, [response]);

	const messagesWithSeparators = useMemo((): MessageListItem[] => {
		if (!response?.results?.length) {
			return [];
		}

		const result: MessageListItem[] = [];

		response.results.forEach((message: ChatMessage, index: number) => {
			const prevMessage = index > 0 ? response.results[index - 1] : undefined;

			if (isSystemMessageType(message)) {
				result.push({
					type: 'system',
					data: mapChatMessageToSystemMessageData(message)
				});
				return;
			}

			const createdAt = message.created_at;
			const prevCreatedAt =
				prevMessage && !isSystemMessageType(prevMessage)
					? prevMessage.created_at
					: undefined;

			if (shouldShowDateSeparator(createdAt, prevCreatedAt)) {
				result.push({
					type: 'separator',
					date: new Date(createdAt),
					id: `separator-${createdAt}-${index}`
				});
			}

			result.push({
				type: 'text',
				data: toLocalTextMessage(message)
			});
		});

		return result;
	}, [response]);

	const hasMore = useMemo(() => !!nextUrl, [nextUrl]);
	const isEmpty = useMemo(
		() => messages.length === 0 && !isLoading,
		[messages.length, isLoading]
	);

	return {
		messages,
		messagesWithSeparators,
		nextUrl,
		isLoading,
		isError,
		error,
		refetch,
		hasMore,
		isEmpty
	};
};
