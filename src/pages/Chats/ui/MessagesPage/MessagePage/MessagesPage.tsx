'use client';

import { MessageFormComponent } from '@/features/messageForm';
import { Messages } from '@/entities/Messages';
import { MessageHeader } from '../MessageHeader/MessageHeader';
import { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectChatByUid } from '@/entities/Chat/api/chatApi';
import { UserCardSkeleton } from '@/shared/ui/Skeleton';
import { Chat } from '@/entities/Chat/model/types/chat.types';
import { RootState } from '@/app/providers/StoreProvider';
import { UserCardType } from '@/shared/ui/UserCard';
import { appConfig } from '@/shared/config/app.config';
// ! моковые данные, удалить после подключения бэка
import { mockChats } from '@/entities/Chat/mock/mockData';
import cls from './MessagesPage.module.scss';

interface MessagesPageProps {
	chatUid: string;
}

const MessagesPage = ({ chatUid }: MessagesPageProps) => {
	const [, setIsCallActive] = useState(false);

	// 1. Данные из кэста RTK Query (только если USE_MOCKS = false)
	const chatDataFromCache = useSelector((state: RootState) =>
		selectChatByUid(state, chatUid)
	);

	// ✅ Единый источник данных: моки или API через конфиг
	const chatData = useMemo(() => {
		if (appConfig.USE_MOCKS) {
			return mockChats.find((chat: Chat) => chat.chat.uid === chatUid);
		}
		return chatDataFromCache;
	}, [chatDataFromCache, chatUid]);

	//! Отладка (удалишь после настройки)
	useEffect(() => {
		if (process.env.NODE_ENV === 'development') {
			console.log('📦 MessagesPage - Data source:', {
				mode: appConfig.USE_MOCKS ? 'MOCKS' : 'API', // ✅ Используем конфиг
				chatUid,
				hasData: !!chatData,
				fromCache: !!chatDataFromCache,
				fromMocks: appConfig.USE_MOCKS
					? !!mockChats.find((c: Chat) => c.chat.uid === chatUid)
					: false
			});
		}
	}, [chatUid, chatData, chatDataFromCache]);

	const handleCall = () => {
		setIsCallActive(true);
		// Логика звонка
	};

	// 3. Вычисляем данные для шапки
	const headerData = useMemo(() => {
		if (!chatData?.chat) {
			return null;
		}

		const {
			first_name,
			last_name,
			avatar_webp_url,
			avatar_url,
			is_online,
			was_online_at
		} = chatData.chat;

		const userName = `${first_name} ${last_name}`.trim();

		const userStatus = is_online
			? 'В сети'
			: was_online_at
				? `был(а) ${new Date(was_online_at * 1000).toLocaleTimeString('ru-RU', {
						hour: '2-digit',
						minute: '2-digit'
					})}`
				: 'Не в сети';

		const userAvatar = avatar_webp_url || avatar_url || undefined;

		return { userName, userStatus, userAvatar, isOnline: is_online };
	}, [chatData]);

	// 4. Показываем скелетон только если данных действительно нет
	if (!headerData) {
		return (
			<section className={cls.messagesPage}>
				<UserCardSkeleton count={1} type={UserCardType.CONTACT} />
			</section>
		);
	}

	return (
		<section className={cls.messagesPage}>
			<MessageHeader
				userName={headerData.userName}
				userStatus={headerData.userStatus}
				userAvatar={headerData.userAvatar}
				isOnline={headerData.isOnline}
				onCall={handleCall}
			/>
			<Messages />
			<MessageFormComponent />
		</section>
	);
};

export default MessagesPage;
