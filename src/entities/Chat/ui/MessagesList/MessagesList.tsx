'use client';

import { memo, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { MessageBubble } from '@/entities/Chat/ui/MessageBubble/MessageBubble';
import { Down } from '@icons/index';
import { useGetMessagesQuery } from '@/entities/Chat/api/chatApi';
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

// Найдите функцию toLocalTextMessage и обновите:

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

const toProxyPath = (url: string | null): string | null => {
	if (!url) {
		return null;
	}
	if (url.startsWith('/api/proxy')) {
		return url;
	}
	try {
		const pathname = url.startsWith('http') ? new URL(url).pathname : url;
		const apiPath = pathname.replace(/^\/api\/v1/, '');
		return `/api/proxy${apiPath}`;
	} catch {
		return null;
	}
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

	//  Получаем isAtBottom ИЗ КОНТЕКСТА (управляется StickyDateProvider)
	const { isAtBottom } = useStickyDate();

	// ===== REFS =====
	const bottomRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const isAtBottomRef = useRef(true);
	const isLoadingHistoryRef = useRef(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	// ===== STATE =====
	const [messages, setMessages] = useState<TextMessage[]>([]);
	const [nextUrl, setNextUrl] = useState<string | null>(null);
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const [newCount, setNewCount] = useState(0);

	// Синхронизируем реф с контекстным значением для логики добавления сообщений
	useEffect(() => {
		isAtBottomRef.current = isAtBottom;
	}, [isAtBottom]);

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

	// ===== ОБРАБОТКА ДАННЫХ =====

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

			const prevIds = new Set(prev.map(p => p.id));
			const incoming = mapped.filter(m => !prevIds.has(m.id));

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
		if (!nextUrl || isFetchingMore) {
			return;
		}

		isLoadingHistoryRef.current = true;
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		abortControllerRef.current = new AbortController();
		setIsFetchingMore(true);

		try {
			const fetchUrl = toProxyPath(nextUrl);
			if (!fetchUrl) {
				throw new Error('Invalid nextUrl');
			}

			const res = await fetch(fetchUrl, {
				signal: abortControllerRef.current.signal,
				redirect: 'follow',
				credentials: 'include'
			});

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}

			const responseData: { results: ChatMessage[]; next: string | null } =
				await res.json();

			const older: TextMessage[] = responseData.results
				.filter(msg => msg.type !== MessageType.SYSTEM)
				.map(msg => toLocalTextMessage(msg, currentUserId));

			setNextUrl(responseData.next);

			setMessages(prev => {
				const prevIds = new Set(prev.map(p => p.id));
				const uniqueOlder = older.filter(m => !prevIds.has(m.id));
				return [...uniqueOlder, ...prev];
			});
		} catch (err) {
			if (err instanceof DOMException && err.name === 'AbortError') {
				return;
			}
			console.error('Failed to load older messages:', err);
		} finally {
			setIsFetchingMore(false);
			isLoadingHistoryRef.current = false;
			abortControllerRef.current = null;
		}
	}, [nextUrl, isFetchingMore, currentUserId]);

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
				!isFetchingMore
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
	//  Важно: div.messages НЕ имеет onScroll и overflow-y: auto
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
							key={item.data.uid || item.data.id}
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
