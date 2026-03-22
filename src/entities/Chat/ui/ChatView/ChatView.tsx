'use client';

import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChatHeader, MessagesList } from '@/entities/Chat';
import { MessageFormComponent } from '@/features/messageForm';
import { useChatHeaderData } from '@/entities/Chat/model/lib/hooks/useChatHeaderData/useChatHeaderData';
import {
	selectChatByUid,
	useGetMessagesQuery
} from '@/entities/Chat/api/chatApi';
import { UserCardSkeleton } from '@/shared/ui/Skeleton';
import { UserCardType } from '@/shared/ui/UserCard';
import { NotMessage } from '@/shared/ui/NotMessage/NotMessage';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import { classNames } from '@/shared/lib/classNames/classNames';
import { RootState } from '@/app/providers/StoreProvider';
import {
	Chat,
	ChatMessage
} from '@/entities/Chat/model/types/chat.types/chat.types';

import cls from './ChatView.module.scss';

interface ChatViewProps {
	chatUid: string;
	onBack?: () => void;
}

// Константы для пагинации сообщений (соответствуют настройкам бэка)
const MESSAGES_PAGE_SIZE = 50;
const MESSAGES_ORDERING = '-created_at';

export const ChatView = ({ chatUid, onBack }: ChatViewProps) => {
	const isMobile = useMediaQuery();
	const [isActionBarVisible, setIsActionBarVisible] = useState(true);

	// ─────────────────────────────────────────────────────────────
	// DATA: Получаем чат из кеша RTK Query
	// ─────────────────────────────────────────────────────────────
	const chatDataFromCache = useSelector((state: RootState) =>
		selectChatByUid(state, chatUid)
	);

	// ─────────────────────────────────────────────────────────────
	// DATA: Запрашиваем сообщения через RTK Query
	// ─────────────────────────────────────────────────────────────
	const { data: messagesResponse, isLoading: isMessagesLoading } =
		useGetMessagesQuery(
			{
				user_uid: chatUid,
				page_size: MESSAGES_PAGE_SIZE,
				ordering: MESSAGES_ORDERING
			},
			{
				skip: !chatUid
			}
		);

	// Сообщения из ответа API (уже преобразованные через transformResponse)
	const messages = useMemo<ChatMessage[]>(() => {
		return messagesResponse?.results ?? [];
	}, [messagesResponse]);

	// ─────────────────────────────────────────────────────────────
	// DATA: Чат данные (только из кеша RTK Query)
	// ─────────────────────────────────────────────────────────────
	const chatData = useMemo<Chat | null>(() => {
		// Если есть в кеше RTK Query — возвращаем
		if (chatDataFromCache) {
			return chatDataFromCache;
		}
		// Если ничего не нашли — null (покажем скелетон)
		return null;
	}, [chatDataFromCache]);

	// ─────────────────────────────────────────────────────────────
	// HEADER DATA: Используем хук или дефолтные значения
	// ─────────────────────────────────────────────────────────────
	const { headerData, hasMessages } = useChatHeaderData(chatData);

	// Fallback данные: из headerData + дополнительные поля из chatData
	const safeHeaderData = useMemo(() => {
		// Базовые поля из хука (с защитой от null)
		const baseData = {
			userName: headerData?.userName ?? 'Неизвестный пользователь',
			userStatus: headerData?.userStatus ?? 'был(а) давно',
			userAvatar: headerData?.userAvatar,
			isOnline: headerData?.isOnline ?? false,
			isInContacts: headerData?.isInContacts ?? false
		};

		// Дополнительные поля для API добавления контакта — берём из chatData
		const contactData = {
			contactPhone: chatData?.chat?.username?.startsWith('+')
				? chatData.chat.username
				: undefined,
			contactFirstName: chatData?.chat?.first_name,
			contactLastName: chatData?.chat?.last_name
		};

		return { ...baseData, ...contactData };
	}, [headerData, chatData]);

	// ─────────────────────────────────────────────────────────────
	// HANDLERS
	// ─────────────────────────────────────────────────────────────
	const handleBack = useCallback(() => {
		if (onBack) {
			onBack();
		} else {
			window.history.back();
		}
	}, [onBack]);

	const handleCall = useCallback(() => {
		console.log('📞 Call initiated for chat:', chatUid);
	}, [chatUid]);

	const handleAddToContacts = useCallback(() => {
		console.log('👤 Add to contacts:', chatUid);
		// TODO: Вызвать мутацию добавления контакта
	}, [chatUid]);

	const handleBlock = useCallback(() => {
		console.log('🚫 Block user:', chatUid);
	}, [chatUid]);

	// ─────────────────────────────────────────────────────────────
	// RENDER: Loading state (только если данных вообще нет)
	// ─────────────────────────────────────────────────────────────
	// Показываем скелетон ТОЛЬКО если chatData === null
	if (!chatData) {
		return (
			<section className={cls.chatView}>
				<UserCardSkeleton count={1} type={UserCardType.CONTACT} />
			</section>
		);
	}

	// ─────────────────────────────────────────────────────────────
	// RENDER: Main Content
	// ─────────────────────────────────────────────────────────────
	const messagesClass = classNames(cls.messagesContent, {
		[cls.messagesContent_noRadius]: isMobile && isActionBarVisible
	});

	return (
		<section className={cls.chatView}>
			<ChatHeader
				{...safeHeaderData}
				onCall={handleCall}
				onAddToContacts={handleAddToContacts}
				onBlock={handleBlock}
				onBack={isMobile ? handleBack : undefined}
				onActionBarVisibilityChange={setIsActionBarVisible}
			/>

			{/* NotMessage или MessagesList */}
			{hasMessages ? (
				<>
					<MessagesList
						className={messagesClass}
						messages={messages}
						currentUserId='user-me'
					/>
					<MessageFormComponent />
				</>
			) : (
				<>
					<div className={cls.notMessageWrapper}>
						<NotMessage />
					</div>
					<MessageFormComponent />
				</>
			)}
		</section>
	);
};

ChatView.displayName = 'ChatView';
