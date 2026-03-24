'use client';

import React, {
	useMemo,
	useRef,
	useCallback,
	useEffect,
	useState
} from 'react';
import { ChatMessage } from '../../model/types/chat.types/chat.types';
import { shouldShowDateSeparator } from '@/entities/Chat/model/lib/service/dateFormating/dateFormater';
import { MessageBubble } from '../MessageBubble/MessageBubble';
import DateSeparator from '../SystemMessages/ui/DateSeparator/DateSeparator';
import { BubbleStatus } from '@/entities/Chat/model/lib/service/mapMessageStatus/mapMessageStatus';
import StickyDateHeader from '../SystemMessages/ui/StickyDateHeader/StickyDateHeader';

import cls from './MessagesList.module.scss';

interface MessagesListProps {
	messages?: ChatMessage[];
	className?: string;
	onMessageClick?: (id: string) => void;
	currentUserId?: string;
}

// Упрощённый тип элемента списка: только сообщения + сепараторы
type MessageListItem =
	| { type: 'message'; data: ChatMessage }
	| { type: 'separator'; data: number; id: string };

export const MessagesList: React.FC<MessagesListProps> = ({
	messages = [],
	className = '',
	onMessageClick,
	currentUserId
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const messageRefs = useRef<Map<string, HTMLElement>>(new Map());
	const separatorRefs = useRef<Map<string, HTMLElement>>(new Map());

	const [activeDate, setActiveDate] = useState<Date | null>(null);

	const setMessageRef = useCallback((id: string, el: HTMLElement | null) => {
		if (el) {
			messageRefs.current.set(id, el);
		} else {
			messageRefs.current.delete(id);
		}
	}, []);

	const setSeparatorRef = useCallback((id: string, el: HTMLElement | null) => {
		if (el) {
			separatorRefs.current.set(id, el);
		} else {
			separatorRefs.current.delete(id);
		}
	}, []);

	// Observer для sticky header (без изменений)
	useEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return;
		}

		const observer = new IntersectionObserver(
			entries => {
				const visible = entries
					.filter(entry => entry.isIntersecting)
					.sort((a, b) => {
						const aTop =
							a.boundingClientRect.top - container.getBoundingClientRect().top;
						const bTop =
							b.boundingClientRect.top - container.getBoundingClientRect().top;
						return Math.abs(aTop - 20) - Math.abs(bTop - 20);
					})[0];

				if (visible?.target) {
					const dateStr = (visible.target as HTMLElement).dataset.date;
					if (dateStr) {
						setActiveDate(new Date(dateStr));
					}
				}
			},
			{
				root: container,
				threshold: 0,
				rootMargin: '-20px 0px -80% 0px'
			}
		);

		separatorRefs.current.forEach(el => {
			if (el) {
				observer.observe(el);
			}
		});

		return () => observer.disconnect();
	}, [messages]);

	//  Формируем список с сепараторами дат
	const messagesWithSeparators = useMemo((): MessageListItem[] => {
		if (!messages?.length) {
			return [];
		}

		const result: MessageListItem[] = [];

		messages.forEach((message, index) => {
			const prevMessage = index > 0 ? messages[index - 1] : undefined;

			if (
				shouldShowDateSeparator(message.created_at, prevMessage?.created_at)
			) {
				result.push({
					type: 'separator',
					data: message.created_at, // ✅ number
					id: `separator-${message.created_at}`
				});
			}

			result.push({ type: 'message', data: message });
		});

		return result;
	}, [messages]);

	// Определяем статус пузыря (received/sent/read)
	const getBubbleStatus = useCallback(
		(message: ChatMessage): BubbleStatus => {
			if (!currentUserId) {
				return 'received';
			}

			const isOutgoing = message.from_user === currentUserId;

			return isOutgoing ? 'sending' : 'received';
		},

		[currentUserId]
	);

	return (
		<div ref={containerRef} className={`${cls.messageList} ${className}`}>
			<StickyDateHeader date={activeDate} />

			{messagesWithSeparators.map(item => {
				if (item.type === 'separator') {
					return (
						<DateSeparator
							key={item.id}
							date={new Date(item.data)}
							observerId={item.id}
							ref={el => setSeparatorRef(item.id, el)}
						/>
					);
				}

				const message = item.data as ChatMessage;
				const bubbleStatus = getBubbleStatus(message);

				return (
					<div
						key={message.id}
						ref={el => setMessageRef(message.id.toString(), el)}
						data-date={new Date(message.created_at).toISOString()}
					>
						<MessageBubble
							id={message.id.toString()}
							time={message.created_at}
							text={message.content}
							status={bubbleStatus}
							onClick={onMessageClick || (() => {})}
							isGroupChat={false}
							senderName=''
							senderAvatar=''
						/>
					</div>
				);
			})}
		</div>
	);
};

export default MessagesList;
