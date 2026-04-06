'use client';

import { memo, useEffect, useRef, useCallback } from 'react';
import { MessageBubble } from '@/entities/Chat/ui/MessageBubble/MessageBubble';
import { Down } from '@icons/index';
import { classNames } from '@/shared/lib/classNames/classNames';
import { SmartDateSeparator } from '../SystemMessages/ui/SmartDateSeparator/SmartDateSeparator';
import { StickyDateProvider } from '../SystemMessages/ui/StickyDateContext/StickyDateContext';
import SystemMessage from '../SystemMessages/ui/SystemMessages/SystemMessages';
import {
	useMessagesData,
	type TextMessage
} from '../../model/lib/hooks/useMessagesData/useMessagesData';
import { useInfiniteScroll } from '../../model/lib/hooks/useInfiniteScroll/useInfiniteScroll';
import { toProxyPath } from '../../model/lib/service/toProxyPath/toProxyPath';
import {
	SCROLL_BOTTOM_THRESHOLD,
	MESSAGES_QUERY_DEFAULTS
} from '@/shared/model';
import { isSystemMessageType } from '../../model/mapper/mapChatType/chatMapper';
import { ChatMessage } from '../../model/types/chat.types/chat.types';

import cls from './MessagesList.module.scss';

interface MessagesProps {
	userUid: string;
	className?: string;
	activeResultId?: string;
	searchQuery?: string;
	onContainerReady?: (container: HTMLDivElement | null) => void;
	onScrollContainerReady?: (container: HTMLDivElement | null) => void;
	getActiveOccurrencesForMessage?: (messageId: string) => number[] | undefined;
}

const MessagesListComponent = ({
	userUid,
	className,
	activeResultId,
	searchQuery,
	onContainerReady,
	getActiveOccurrencesForMessage,
	onScrollContainerReady
}: MessagesProps) => {
	const {
		messages,
		messagesWithSeparators,
		nextUrl,
		isLoading,
		isError,
		refetch,
		isEmpty
	} = useMessagesData({
		userUid,
		pageSize: MESSAGES_QUERY_DEFAULTS.page_size,
		ordering: MESSAGES_QUERY_DEFAULTS.ordering
	});

	const containerRef = useRef<HTMLDivElement>(null);
	const isFetchingMoreRef = useRef(false);

	const loadMore = useCallback(async () => {
		if (!nextUrl || isFetchingMoreRef.current) {
			return;
		}
		isFetchingMoreRef.current = true;
		const controller = new AbortController();

		try {
			const fetchUrl = toProxyPath(nextUrl);
			if (!fetchUrl) {
				throw new Error('Invalid nextUrl');
			}

			const res = await fetch(fetchUrl, {
				signal: controller.signal,
				redirect: 'follow',
				credentials: 'include'
			});

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}

			const { results, next }: { results: ChatMessage[]; next: string | null } =
				await res.json();

			const older: TextMessage[] = results
				.filter((msg): msg is ChatMessage => !isSystemMessageType(msg))
				.map(msg => ({
					id: String(msg.id),
					text: msg.content,
					time: msg.created_at,
					status: msg.new ? 'unread' : 'read'
				}));

			if (older.length > 0) {
				const el = containerRef.current?.closest(
					'[data-scroll-container]'
				) as HTMLDivElement | null;
				if (el) {
					const prevScrollHeight = el.scrollHeight;
					const prevScrollTop = el.scrollTop;

					requestAnimationFrame(() => {
						const heightDiff = el.scrollHeight - prevScrollHeight;
						el.scrollTop = prevScrollTop + heightDiff;
					});
				}
			}
		} catch (err) {
			if (err instanceof DOMException && err.name === 'AbortError') {
				return;
			}
		} finally {
			isFetchingMoreRef.current = false;
		}
	}, [nextUrl]);

	const {
		scrollRef,
		anchorRef,
		isAtBottom,
		newCount,
		scrollToBottom,
		incrementNewCount
	} = useInfiniteScroll({
		loadMore,
		threshold: SCROLL_BOTTOM_THRESHOLD,
		loadThreshold: SCROLL_BOTTOM_THRESHOLD
	});

	useEffect(() => {
		if (!isAtBottom && messages.length > 0) {
			const lastMessage = messages[messages.length - 1];
			if (lastMessage?.status === 'unread') {
				incrementNewCount();
			}
		}
	}, [messages, isAtBottom, incrementNewCount]);

	useEffect(() => {
		const timer = setTimeout(() => {
			const scrollContainer = scrollRef.current?.closest(
				'[data-scroll-container]'
			) as HTMLDivElement | null;
			onScrollContainerReady?.(scrollContainer);
			onContainerReady?.(scrollContainer);
		}, 100);
		return () => clearTimeout(timer);
	}, [onContainerReady, onScrollContainerReady, scrollRef]);

	useEffect(() => {
		if (messages.length > 0 && isAtBottom) {
			requestAnimationFrame(() => {
				scrollToBottom();
			});
		}
	}, [messages.length, isAtBottom, scrollToBottom]);

	if (isLoading && isEmpty) {
		return (
			<div className={cls.emptyState} role='status' aria-live='polite'>
				Загрузка сообщений...
			</div>
		);
	}

	if (isError) {
		return (
			<div className={cls.emptyState} role='alert'>
				<p>Ошибка загрузки сообщений</p>
				<button onClick={refetch}>Попробовать снова</button>
			</div>
		);
	}

	return (
		<StickyDateProvider
			containerRef={containerRef as React.RefObject<HTMLDivElement>}
			onScrollContainerReady={onScrollContainerReady}
		>
			<div className={`${cls.wrapper} ${className}`}>
				<div className={cls.messages} ref={scrollRef}>
					{messagesWithSeparators.map(item => {
						if (item.type === 'separator') {
							return (
								<SmartDateSeparator
									key={item.id}
									id={item.id}
									date={item.date}
								/>
							);
						}

						if (item.type === 'system') {
							return <SystemMessage key={item.data.id} message={item.data} />;
						}

						const isActiveResult = activeResultId === item.data.id;
						const hasSearchQuery =
							!!searchQuery && searchQuery.trim().length > 0;

						const bubbleClassName = classNames('', {
							[cls.messageBubble_active]: isActiveResult,
							[cls.messageBubble_hasQuery]: hasSearchQuery && !isActiveResult
						});

						return (
							<MessageBubble
								key={item.data.id}
								id={item.data.id}
								text={item.data.text}
								time={item.data.time}
								status={item.data.status}
								onClick={() => {}}
								className={bubbleClassName}
								data-message-id={item.data.id}
								searchQuery={searchQuery}
								getActiveOccurrencesForMessage={getActiveOccurrencesForMessage}
							/>
						);
					})}

					<div ref={anchorRef} className={cls.scrollAnchor} />
				</div>

				{!isAtBottom && (
					<button
						className={cls.scrollButton}
						onClick={scrollToBottom}
						aria-label={`Прокрутить к новым сообщениям${newCount > 0 ? `, ${newCount} новых` : ''}`}
					>
						<Down />
						{newCount > 0 && <span aria-hidden='true'>({newCount})</span>}
					</button>
				)}
			</div>
		</StickyDateProvider>
	);
};

export const MessagesList = memo(MessagesListComponent);
