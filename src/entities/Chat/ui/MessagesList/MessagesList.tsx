'use client';

import React, {
	useMemo,
	useRef,
	useCallback,
	useEffect,
	useState
} from 'react';
import {
	Message,
	MessageType,
	SystemMessageData,
	TextMessage
} from '../../model/types/chat.types/chat.types';
import { shouldShowDateSeparator } from '@/entities/Chat/model/lib/service/dateFormating/dateFormater';
import { MessageBubble } from '../MessageBubble/MessageBubble';
import DateSeparator from '../SystemMessages/ui/DateSeparator/DateSeparator';
import SystemMessage from '../SystemMessages/ui/SystemMessages/SystemMessages';
import {
	BubbleStatus,
	toBubbleStatus
} from '@/entities/Chat/model/lib/service/mapMessageStatus/mapMessageStatus';
import StickyDateHeader from '../SystemMessages/ui/StickyDateHeader/StickyDateHeader';

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

		return () => {
			observer.disconnect();
		};
	}, [messages]);

	const messagesWithSeparators = useMemo((): MessageListItem[] => {
		if (!messages?.length) {
			return [];
		}

		const result: MessageListItem[] = [];

		messages.forEach((message, index) => {
			const prevMessage = index > 0 ? messages[index - 1] : undefined;

			if (shouldShowDateSeparator(message.createdAt, prevMessage?.createdAt)) {
				result.push({
					type: 'separator',
					data: message.createdAt,
					id: `separator-${message.createdAt.getTime()}`
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
		<div ref={containerRef} className={`${cls.messageList} ${className}`}>
			<StickyDateHeader date={activeDate} />

			{messagesWithSeparators.map(item => {
				if (item.type === 'separator') {
					return (
						<DateSeparator
							key={item.id}
							date={item.data}
							observerId={item.id}
							ref={el => setSeparatorRef(item.id, el)}
						/>
					);
				}

				const message = item.data;

				if (message.type === MessageType.SYSTEM) {
					return (
						<div key={message.id} ref={el => setMessageRef(message.id, el)}>
							<SystemMessage message={message as SystemMessageData} />
						</div>
					);
				}

				const textMessage = message as TextMessage;
				const bubbleStatus = getBubbleStatus(textMessage);

				return (
					<div
						key={textMessage.id}
						ref={el => setMessageRef(textMessage.id, el)}
					>
						<MessageBubble
							id={textMessage.id}
							time={textMessage.createdAt.getTime()}
							text={textMessage.content}
							status={bubbleStatus}
							onClick={onMessageClick || (() => {})}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default MessagesList;
