'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { MessageBubble } from '@/entities/Chat/ui/MessageBubble/MessageBubble';
import { Down } from '@icons/index';
import { useGetMessagesQuery } from '@/entities/Chat/api/chatApi';
import type { ChatMessage } from '@/entities/Chat/model/types/chat.types/chat.types';

import styles from './MessagesList.module.scss';

// ===== ТИПЫ =====

// тип сообщения (локальный для UI)
interface Message {
	id: string;
	text: string;
	time: number;
	status: 'received' | 'sending' | 'unread' | 'read';
}

// пропсы компонента
interface MessagesProps {
	userUid: string;
	className?: string;
}

// 🔹 Вспомогательная функция: конвертирует ChatMessage → локальный Message
const toLocalMessage = (msg: ChatMessage): Message => ({
	id: String(msg.id),
	text: msg.content,
	time: msg.created_at, // уже timestamp из маппера
	status: msg.new ? 'unread' : 'read'
});

//  Вспомогательная функция: конвертирует абсолютный URL в прокси-путь

const toProxyPath = (url: string | null): string | null => {
	if (!url) {
		return null;
	}
	// Если уже проксированный путь — возвращаем как есть
	if (url.startsWith('/api/proxy')) {
		return url;
	}

	try {
		// Парсим URL (поддерживаем и полные URL, и относительные пути)
		const pathname = url.startsWith('http') ? new URL(url).pathname : url;

		// Удаляем префикс /api/v1, т.к. прокси уже добавляет его автоматически
		// Регулярка ^\/api\/v1 означает "начало строки + /api/v1"
		const apiPath = pathname.replace(/^\/api\/v1/, '');

		return `/api/proxy${apiPath}`;
	} catch {
		// Если не удалось распарсить — возвращаем null (запрос не выполнится)
		return null;
	}
};
const MessagesListComponent = ({ userUid, className }: MessagesProps) => {
	// ===== ПОЛУЧЕНИЕ ДАННЫХ =====
	const { data, error, isLoading, refetch } = useGetMessagesQuery(
		{ user_uid: userUid },
		{ skip: !userUid }
	);

	// ===== REFS =====
	const containerRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);
	const isAtBottomRef = useRef(true);
	const isLoadingHistoryRef = useRef(false);
	const abortControllerRef = useRef<AbortController | null>(null);

	// ===== STATE =====
	const [messages, setMessages] = useState<Message[]>([]);
	const [nextUrl, setNextUrl] = useState<string | null>(null);
	const [isFetchingMore, setIsFetchingMore] = useState(false);
	const [isAtBottom, setIsAtBottom] = useState(true);
	const [newCount, setNewCount] = useState(0);

	// ===== ОБРАБОТКА ДАННЫХ С БЭКА (первичная загрузка) =====
	useEffect(() => {
		if (!data) {
			return;
		}

		//  Конвертируем ChatMessage[] → Message[]
		const mapped = data.results.map(toLocalMessage);

		setNextUrl(data.next);

		setMessages(prev => {
			if (!prev.length) {
				return mapped;
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
	}, [data]);

	// ===== СКРОЛЛ =====
	const handleScroll = () => {
		const el = containerRef.current;
		if (!el) {
			return;
		}

		const threshold = 50;
		const isBottom =
			el.scrollHeight - el.scrollTop - el.clientHeight < threshold;

		isAtBottomRef.current = isBottom;
		setIsAtBottom(isBottom);

		if (isBottom) {
			setNewCount(0);
		}
		if (el.scrollTop < 50 && !isFetchingMore && !isLoadingHistoryRef.current) {
			loadMore();
		}
	};

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

	// ===== ПОДГРУЗКА СООБЩЕНИЙ (исправленная версия) =====
	const loadMore = async () => {
		if (!nextUrl || isFetchingMore) {
			return;
		}

		isLoadingHistoryRef.current = true;

		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		abortControllerRef.current = new AbortController();
		setIsFetchingMore(true);

		const el = containerRef.current;

		//  Сохраняем позицию скролла НЕПОСРЕДСТВЕННО перед обновлением стейта
		// (после того как данные уже получены)
		const saveScrollPosition = () => {
			if (!el) {
				return null;
			}
			return {
				scrollHeight: el.scrollHeight,
				scrollTop: el.scrollTop
			};
		};

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
			const older: Message[] = responseData.results.map(toLocalMessage);

			setNextUrl(responseData.next);

			//  КЛЮЧЕВОЙ МОМЕНТ: сохраняем позицию ПЕРЕД setMessages
			const scrollPos = saveScrollPosition();

			setMessages(prev => {
				const prevIds = new Set(prev.map(p => p.id));
				const uniqueOlder = older.filter(m => !prevIds.has(m.id));

				//  Корректируем скролл ТОЛЬКО если были добавлены новые старые сообщения
				if (uniqueOlder.length > 0 && el && scrollPos) {
					requestAnimationFrame(() => {
						const newScrollHeight = el.scrollHeight;
						const heightDiff = newScrollHeight - scrollPos.scrollHeight;
						// Компенсируем добавленную высоту
						el.scrollTop = scrollPos.scrollTop + heightDiff;
					});
				}

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
	};

	// ===== ОЧИСТКА ПРИ РАЗМОНТИРОВАНИИ =====
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	// ===== РУЧНОЙ СКРОЛЛ ВНИЗ =====
	const scrollToBottom = () => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
		setNewCount(0);
	};

	// ===== UI СОСТОЯНИЯ =====
	if (isLoading && messages.length === 0) {
		return <div className={styles.emptyState}>Загрузка сообщений...</div>;
	}

	if (error) {
		return (
			<div className={styles.emptyState}>
				<p>Ошибка загрузки сообщений</p>
				<button onClick={() => refetch()}>Попробовать снова</button>
			</div>
		);
	}

	// ===== ОСНОВНОЙ РЕНДЕР =====
	return (
		<div className={`${styles.wrapper} ${className}`}>
			<div
				ref={containerRef}
				onScroll={handleScroll}
				className={styles.messages}
			>
				{messages.map(m => (
					<MessageBubble
						key={m.id}
						id={m.id}
						text={m.text}
						time={m.time}
						status={m.status}
						onClick={() => {}}
					/>
				))}
				<div ref={bottomRef} />
			</div>

			{!isAtBottom && (
				<button
					className={styles.scrollButton}
					onClick={scrollToBottom}
					aria-label='Прокрутить к новым сообщениям'
				>
					<Down />
					{newCount > 0 && <span>({newCount})</span>}
				</button>
			)}
		</div>
	);
};

export const MessagesList = memo(MessagesListComponent);
