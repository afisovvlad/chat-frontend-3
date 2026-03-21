'use client';

import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChatHeader, MessagesList } from '@/entities/Chat';
import { MessageFormComponent } from '@/features/messageForm';
import { useChatHeaderData } from '../../model/hooks/useChatHeaderData/useChatHeaderData';
import { selectChatByUid } from '@/entities/Chat/api/chatApi';
import { UserCardSkeleton } from '@/shared/ui/Skeleton';
import { UserCardType } from '@/shared/ui/UserCard';
import { NotMessage } from '@/shared/ui/NotMessage/NotMessage';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import { classNames } from '@/shared/lib/classNames/classNames';
import { RootState } from '@/app/providers/StoreProvider';
import { Chat } from '@/entities/Chat/model/types/chat.types';
import { appConfig } from '@/shared/config/app.config';
import { mockChats } from '@/entities/Chat/mock/mockData';
import { ContactsSchema } from '@/entities/Contacts/model/types/contacts.types';
import { mockContacts } from '@/entities/Contacts/mock/mockContacts';

import cls from './ChatView.module.scss';

interface ChatViewProps {
	chatUid: string;
	onBack?: () => void;
}

export const ChatView = ({ chatUid, onBack }: ChatViewProps) => {
	const isMobile = useMediaQuery();
	const [isActionBarVisible, setIsActionBarVisible] = useState(true);

	// ─────────────────────────────────────────────────────────────
	//  DATA: Получаем чат из кеша ИЛИ создаём из контакта
	// ─────────────────────────────────────────────────────────────
	const chatDataFromCache = useSelector((state: RootState) =>
		selectChatByUid(state, chatUid)
	);

	const chatData = useMemo(() => {
		// 1. Если нашли в моках чатов — возвращаем как есть
		if (appConfig.USE_MOCKS) {
			const mockChat = mockChats.find((c: Chat) => c.chat.uid === chatUid);
			if (mockChat) {
				return mockChat;
			}
		}

		// 2. Если есть в кеше RTK Query — возвращаем
		if (chatDataFromCache) {
			return chatDataFromCache;
		}

		// 3.  НОВОЕ: Если чата нет, но контакт есть — создаём фейковый Chat из ContactsSchema
		const mockContact = mockContacts.find(
			(c: ContactsSchema) => c.system_contact.uid === chatUid
		);

		if (mockContact) {
			return {
				id: -1, // временный ID для новых чатов
				chat: {
					uid: mockContact.system_contact.uid, //  Используем uid из контакта!
					username: '',
					first_name: mockContact.first_name,
					last_name: mockContact.last_name,
					avatar_url: mockContact.system_contact.avatar_url,
					avatar_webp_url: mockContact.system_contact.avatar_webp_url,
					is_online: mockContact.system_contact.is_online,
					was_online_at: mockContact.system_contact.was_online_at,
					is_in_contacts: false, //  Ключевое: не в контактах → показываем ActionBar
					is_blocked: false
				},
				is_group: false,
				is_favorite: false,
				notifications: false,
				new_message_count: 0,
				name: `${mockContact.first_name} ${mockContact.last_name}`,
				chat_type: 'chat' as const,
				chat_key: `chat_${chatUid}`,
				last_activity_at: mockContact.system_contact.was_online_at ?? 0,
				last_seen_message: null,
				last_message: null, //  Нет сообщений → покажем NotMessage
				first_new_message: null
			} as Chat;
		}

		// 4. Если ничего не нашли — null (покажем скелетон)
		return null;
	}, [chatDataFromCache, chatUid]);

	// ─────────────────────────────────────────────────────────────
	// HEADER DATA: Используем хук или дефолтные значения
	// ─────────────────────────────────────────────────────────────
	const { headerData, hasMessages } = useChatHeaderData(chatData);

	//  Fallback данные: из headerData + дополнительные поля из chatData
	const safeHeaderData = useMemo(() => {
		// Базовые поля из хука (с защитой от null)
		const baseData = {
			userName: headerData?.userName ?? 'Неизвестный пользователь',
			userStatus: headerData?.userStatus ?? 'был(а) давно',
			userAvatar: headerData?.userAvatar,
			isOnline: headerData?.isOnline ?? false,
			isInContacts: headerData?.isInContacts ?? false
		};

		//  Дополнительные поля для API добавления контакта — берём из chatData
		const contactData = {
			contactPhone: chatData?.chat?.username?.startsWith('+')
				? chatData.chat.username
				: undefined, // 🔹 Или бери из другого поля, если телефон хранится отдельно
			contactFirstName: chatData?.chat?.first_name,
			contactLastName: chatData?.chat?.last_name
		};

		return { ...baseData, ...contactData };
	}, [headerData, chatData]); //  Добавляем chatData в зависимости

	// ─────────────────────────────────────────────────────────────
	//  HANDLERS
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
		//! TODO: Вызвать мутацию добавления контакта
	}, [chatUid]);

	const handleBlock = useCallback(() => {
		console.log('🚫 Block user:', chatUid);
	}, [chatUid]);

	// ─────────────────────────────────────────────────────────────
	//  RENDER: Loading state (только если данных вообще нет)
	// ─────────────────────────────────────────────────────────────
	// Показываем скелетон ТОЛЬКО если chatData === null (не нашли ни в чатах, ни в контактах)
	if (!chatData) {
		return (
			<section className={cls.chatView}>
				<UserCardSkeleton count={1} type={UserCardType.CONTACT} />
			</section>
		);
	}

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

			{/*  NotMessage или MessagesList */}
			{hasMessages ? (
				<>
					<MessagesList userUid={chatUid} />
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
