'use client';

import { memo, useEffect, useRef, useState } from 'react';

import { useGetMessagesQuery } from '@/shared/api/services/messagesApi/messagesApi';

import { MessageBubble } from '@/entities/Chat/ui/MessageBubble/MessageBubble';
import { Down } from '@icons/index';

import styles from './MessagesList.module.scss';

// тип сообщения
interface Message {
	id: string;
	text: string;
	time: number;
	status: 'received' | 'sending' | 'unread' | 'read';
}

// пропсы компонента messages
interface MessagesProps {
	userUid: string;
}

const MessagesListComponent = ({ userUid }: MessagesProps) => {
	// хук для получения сообщений через api
	const { data, error, isLoading, refetch } = useGetMessagesQuery(
		// Cannot find name 'useGetMessagesQuery'.
		{ userUid },
		{
			// обновление каждые 4 секунды, если есть userUid
			pollingInterval: userUid ? 4000 : 0,
			// пропуск запроса если нет userUid
			skip: !userUid
		}
	);

	// реф для контейнера с сообщениями
	const containerRef = useRef<HTMLDivElement>(null);
	// реф для "нижней точки" скролла
	const bottomRef = useRef<HTMLDivElement>(null);

	// реф для отслеживания позиции скролла
	const [isAtBottom, setIsAtBottom] = useState(true);
	const isAtBottomRef = useRef(true);

	// состояние сообщений
	const [messages, setMessages] = useState<Message[]>([]);
	// количество новых сообщений, когда пользователь не внизу
	const [newCount, setNewCount] = useState(0);

	// обработка данных с backend и маппинг к локальному типу message
	useEffect(() => {
		if (!data) {
			return;
		}

		const mapped: Message[] = data.results.map(m => ({
			id: m.uid,
			text: m.content,
			time: new Date(m.created_at).getTime(),
			status: m.from_me ? 'read' : 'received'
		}));

		setMessages(prev => {
			// если пришли новые сообщения и пользователь не внизу, увеличиваем счетчик новых
			if (mapped.length > prev.length && !isAtBottomRef.current) {
				setNewCount(c => c + (mapped.length - prev.length));
			}

			return mapped;
		});
	}, [data]);

	// обработчик скролла
	const handleScroll = () => {
		const el = containerRef.current;
		if (!el) {
			return;
		}

		const threshold = 50; // расстояние до низа, считаем что внизу если меньше

		const isBottom =
			el.scrollHeight - el.scrollTop - el.clientHeight < threshold;

		isAtBottomRef.current = isBottom;
		setIsAtBottom(isBottom);

		// если внизу, сбрасываем счетчик новых сообщений
		if (isBottom) {
			setNewCount(0);
		}
	};

	// скроллим вниз при обновлении сообщений если пользователь внизу
	useEffect(() => {
		if (isAtBottomRef.current) {
			bottomRef.current?.scrollIntoView({
				behavior: 'smooth'
			});
		}
	}, [messages]);

	// скролл вниз по кнопке
	const scrollToBottom = () => {
		bottomRef.current?.scrollIntoView({
			behavior: 'smooth'
		});
		setNewCount(0);
	};

	// состояние загрузки
	if (isLoading) {
		return <div className={styles.emptyState}>Загрузка сообщений...</div>;
	}

	// состояние ошибки
	if (error) {
		return (
			<div className={styles.emptyState}>
				<p>Ошибка загрузки сообщений</p>
				<button style={{ textDecoration: 'underline' }} onClick={refetch}>
					Попробовать снова
				</button>
			</div>
		);
	}

	// основной рендер сообщений
	return (
		<div className={styles.wrapper}>
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

			{/* кнопка для скролла вниз, если пользователь не внизу */}
			{!isAtBottom && (
				<button className={styles.scrollButton} onClick={scrollToBottom}>
					{Down} {/* !! не отображается */}
					{newCount > 0 && `(${newCount})`}
				</button>
			)}
		</div>
	);
};

export const MessagesList = memo(MessagesListComponent);
