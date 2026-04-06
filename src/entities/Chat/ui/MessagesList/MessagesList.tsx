'use client';

import { memo, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { MessageBubble } from '@/entities/Chat/ui/MessageBubble/MessageBubble';
import { Down } from '@icons/index';
import {
	useGetMessagesQuery,
	useLazyGetMessagesQuery
} from '@/entities/Chat/api/chatApi';
import { shouldShowDateSeparator } from '@/entities/Chat/model/lib/service/dateFormating/dateFormater';
import SmartDateSeparator from '../SystemMessages/ui/SmartDateSeparator/SmartDateSeparator';
import {
	StickyDateProvider,
	useStickyDate
} from '../SystemMessages/ui/StickyDateContext/StickyDateContext';
import SystemMessage from '../SystemMessages/ui/SystemMessages/SystemMessages';
import {
	SystemMessageData,
	ChatMessage,
	MessageType,
	GetMessagesRequest
} from '../../model/types/chat.types/chat.types';
import { mapChatMessageToSystemMessageData } from '../../model/mapper/mapChatType/chatMapper';

import cls from './MessagesList.module.scss';

// ===== ТИПЫ =====
interface TextMessage {
	id: string;
	text: string;
	time: number;
	uid: string;
	status: 'received' | 'sending' | 'unread' | 'read';
}

type MessageListItem =
	| { type: 'text'; data: TextMessage }
	| { type: 'system'; data: SystemMessageData }
	| { type: 'separator'; date: Date; id: string };

interface MessagesProps {
	queryArgs: GetMessagesRequest | null;
	currentUserId?: string;
	className?: string;
}

const toLocalTextMessage = (
	msg: ChatMessage,
	currentUserId?: string
): TextMessage => {
	const isSentByMe = currentUserId ? msg.from_user === currentUserId : false;

	return {
		id: String(msg.id),
		uid: msg.uid,
		text: msg.content,
		time: msg.created_at,
		status: isSentByMe ? (msg.new ? 'unread' : 'read') : 'received'
	};
};

//  ВНУТРЕННИЙ компонент — получает данные из контекста
const MessagesListContent = ({
	queryArgs,
	currentUserId,
	className
}: MessagesProps) => {
	const { data, error, isLoading, refetch } = useGetMessagesQuery(queryArgs!, {
		skip: !queryArgs
	});

	const { isAtBottom } = useStickyDate();

	// ===== REFS =====
	const bottomRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const isAtBottomRef = useRef(true);
	const isLoadingHistoryRef = useRef(false);
	const abortControllerRef = useRef<AbortController | null>(null);
	const isFetchingMoreRef = useRef(false);

	// ===== STATE =====

	const [messages, setMessages] = useState<TextMessage[]>([]);
	const [nextUrl, setNextUrl] = useState<string | null>(null);
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const [newCount, setNewCount] = useState(0);

	const [triggerGetMessages] = useLazyGetMessagesQuery();

	// Синхронизируем реф с контекстным значением для логики добавления сообщений
	useEffect(() => {
		isAtBottomRef.current = isAtBottom;
	}, [isAtBottom]);

	useEffect(() => {
		isFetchingMoreRef.current = isFetchingMore;
	}, [isFetchingMore]);

	// ===== ПОЛУЧЕНИЕ ДОСТУПА К СКРОЛЛ-КОНТЕЙНЕРУ =====

	useEffect(() => {
		const providerEl = scrollContainerRef.current?.closest(
			`.${cls.wrapper}`
		)?.parentElement;
		if (providerEl) {
			const innerScroll = providerEl.querySelector(
				'.scrollContainer'
			) as HTMLDivElement;
			if (innerScroll) {
				scrollContainerRef.current = innerScroll;
			}
		}
	}, []);

	useEffect(() => {
		if (!data) {
			return;
		}

		const textMessages = data.results.filter(
			(msg): msg is ChatMessage => msg.type !== MessageType.SYSTEM
		);

		const mapped = textMessages.map(msg =>
			toLocalTextMessage(msg, currentUserId)
		);

		setNextUrl(data.next);
		setMessages(prev => {
			if (!prev.length) {
				return [...mapped].reverse();
			}

			const prevIds = new Set(prev.map(p => p.uid));
			const incoming = mapped.filter(m => !prevIds.has(m.uid));

			if (incoming.length) {
				if (!isLoadingHistoryRef.current && !isAtBottomRef.current) {
					setNewCount(c => c + incoming.length);
				}
				return [...prev, ...incoming];
			}
			return prev;
		});

		setTimeout(() => {
			bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
		}, 50);
	}, [currentUserId, data]);

	// Сбрасываем локальный стейт при смене чата
	useEffect(() => {
		return () => {
			setMessages([]);
			setNextUrl(null);
			setNewCount(0);
			isLoadingHistoryRef.current = false;
		};
	}, [queryArgs?.user_uid]);

	// ===== АВТОСКРОЛЛ ВНИЗ =====
	useEffect(() => {
		if (
			!isLoadingHistoryRef.current &&
			isAtBottomRef.current &&
			messages.length > 0
		) {
			bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages, isAtBottom]);

	// ===== ПОДГРУЗКА ИСТОРИИ =====

	const loadMore = useCallback(async () => {
		if (!nextUrl || isFetchingMoreRef.current || !queryArgs?.user_uid) {
			return;
		}

		const url = new URL(nextUrl, window.location.origin);
		const page = url.searchParams.get('page');

		// 🔹 Обновляем и стейт, и ref
		isLoadingHistoryRef.current = true;
		isFetchingMoreRef.current = true;
		setIsFetchingMore(true);

		try {
			const result = await triggerGetMessages({
				user_uid: queryArgs.user_uid,
				page_size: queryArgs.page_size,
				ordering: queryArgs.ordering,
				search: queryArgs.search,
				page: page ? parseInt(page, 10) : undefined
			}).unwrap();

			const older = result.results
				.filter((msg): msg is ChatMessage => msg.type !== MessageType.SYSTEM)
				.map(msg => toLocalTextMessage(msg, currentUserId));

			setNextUrl(result.next);
			setMessages(prev => {
				const prevUids = new Set(prev.map(p => p.uid));
				const uniqueOlder = older.filter(m => !prevUids.has(m.uid));
				return [...uniqueOlder, ...prev];
			});
		} catch (err) {
			console.error('Failed to load older messages:', err);
		} finally {
			isFetchingMoreRef.current = false;
			setIsFetchingMore(false);
		}
	}, [nextUrl, currentUserId, queryArgs, triggerGetMessages]);

	// ===== ТРИГГЕР ПОДГРУЗКИ ПРИ СКРОЛЛЕ ВВЕРХ =====
	useEffect(() => {
		const container = scrollContainerRef.current;
		if (!container) {
			return;
		}

		const handleScrollTop = () => {
			if (
				container.scrollTop < 50 &&
				!isLoadingHistoryRef.current &&
				!isFetchingMoreRef.current
			) {
				loadMore();
			}
		};

		container.addEventListener('scroll', handleScrollTop, { passive: true });
		return () => container.removeEventListener('scroll', handleScrollTop);
	}, [loadMore]);
	// ===== CLEANUP =====

	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	// ===== СКРОЛЛ ВНИЗ ВРУЧНУЮ =====
	const scrollToBottom = () => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
		setNewCount(0);
	};

	// ===== ФОРМИРОВАНИЕ СПИСКА =====

	const messagesWithSeparators = useMemo((): MessageListItem[] => {
		if (!data?.results?.length) {
			return [];
		}
		const result: MessageListItem[] = [];

		// Фильтруем текстовые и системные сообщения
		const textMessages = data.results.filter(
			(m): m is ChatMessage => m.type !== MessageType.SYSTEM && 'from_user' in m
		);

		const systemMessages = data.results.filter(
			(m): m is ChatMessage => m.type === MessageType.SYSTEM
		);

		const reversedTextMessages = [...textMessages].reverse();

		systemMessages.forEach(msg => {
			result.push({
				type: 'system',
				data: mapChatMessageToSystemMessageData(msg)
			});
		});

		reversedTextMessages.forEach((message, index) => {
			const prevMessage =
				index > 0 ? reversedTextMessages[index - 1] : undefined;
			const prevCreatedAt = prevMessage?.created_at;
			const createdAt = message.created_at;

			if (shouldShowDateSeparator(createdAt, prevCreatedAt)) {
				result.push({
					type: 'separator',
					date: new Date(createdAt),
					id: `separator-${createdAt}-${index}`
				});
			}

			result.push({
				type: 'text',
				data: toLocalTextMessage(message, currentUserId)
			});
		});

		return result;
	}, [data, currentUserId]);

	// ===== UI СОСТОЯНИЯ =====
	if (isLoading && messages.length === 0) {
		return <div className={cls.emptyState}>Загрузка сообщений...</div>;
	}

	if (error) {
		return (
			<div className={cls.emptyState}>
				<p>Ошибка загрузки сообщений</p>
				<button onClick={() => refetch()}>Попробовать снова</button>
			</div>
		);
	}

	// ===== РЕНДЕР =====

	return (
		<div className={`${cls.wrapper} ${className}`}>
			<div ref={scrollContainerRef} className={cls.messages}>
				{messagesWithSeparators.map(item => {
					if (item.type === 'separator') {
						return (
							<SmartDateSeparator key={item.id} id={item.id} date={item.date} />
						);
					}
					if (item.type === 'system') {
						return <SystemMessage key={item.data.id} message={item.data} />;
					}
					return (
						<MessageBubble
							key={item.data.uid}
							id={item.data.id}
							text={item.data.text}
							time={item.data.time}
							status={item.data.status}
							onClick={() => {}}
						/>
					);
				})}
				<div ref={bottomRef} />
			</div>

			{!isAtBottom && (
				<button
					className={cls.scrollButton}
					onClick={scrollToBottom}
					aria-label='Прокрутить к новым сообщениям'
				>
					<Down className={cls.icon} />
					{newCount > 0 && <span className={cls.badge}>({newCount})</span>}
				</button>
			)}
		</div>
	);
};

const MessagesListComponent = (props: MessagesProps) => {
	return (
		<StickyDateProvider>
			<MessagesListContent {...props} />
		</StickyDateProvider>
	);
};

export const MessagesList = memo(MessagesListComponent);
