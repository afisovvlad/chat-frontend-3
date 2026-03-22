'use client';

import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChatHeader, MessagesList } from '@/entities/Chat';
import { MessageFormComponent } from '@/features/messageForm';
import { useChatHeaderData } from '@/entities/Chat/model/lib/hooks/useChatHeaderData/useChatHeaderData';
import {
	selectChatByUid,
	useGetChatByIdQuery,
	useGetMessagesQuery
} from '@/entities/Chat/api/chatApi';
import { UserCardSkeleton } from '@/shared/ui/Skeleton';
import { UserCardType } from '@/shared/ui/UserCard';
import { NotMessage } from '@/shared/ui/NotMessage/NotMessage';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import { classNames } from '@/shared/lib/classNames/classNames';
import { RootState } from '@/app/providers/StoreProvider';
import { Chat, ChatMessage } from '../../model/types/chat.types/chat.types';

import cls from './ChatView.module.scss';

interface ChatViewProps {
	chatUid: string;
	onBack?: () => void;
}

const MESSAGES_PAGE_SIZE = 50;
const MESSAGES_ORDERING = '-created_at';

export const ChatView = ({ chatUid, onBack }: ChatViewProps) => {
	const isMobile = useMediaQuery();
	const [isActionBarVisible, setIsActionBarVisible] = useState(true);

	const chatDataFromCache = useSelector((state: RootState) =>
		selectChatByUid(state, chatUid)
	);

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

	const {
		data: chatDataDirect,
		isLoading: isChatLoading,
		isError: isChatError,
		refetch: refetchChat
	} = useGetChatByIdQuery(chatUid, {
		skip: !!chatDataFromCache,
		refetchOnMountOrArgChange: true
	});

	const messages = useMemo<ChatMessage[]>(() => {
		return messagesResponse?.results ?? [];
	}, [messagesResponse]);

	const chatData = useMemo<Chat | null>(() => {
		return chatDataFromCache ?? chatDataDirect ?? null;
	}, [chatDataFromCache, chatDataDirect]);

	const { headerData, hasMessages } = useChatHeaderData(chatData);

	const safeHeaderData = useMemo(() => {
		const baseData = {
			userName: headerData?.userName ?? 'Неизвестный пользователь',
			userStatus: headerData?.userStatus ?? 'был(а) давно',
			userAvatar: headerData?.userAvatar,
			isOnline: headerData?.isOnline ?? false,
			isInContacts: headerData?.isInContacts ?? false
		};

		const contactData = {
			contactPhone: chatData?.chat?.username?.startsWith('+')
				? chatData.chat.username
				: undefined,
			contactFirstName: chatData?.chat?.first_name,
			contactLastName: chatData?.chat?.last_name
		};

		return { ...baseData, ...contactData };
	}, [headerData, chatData]);

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

	if (isChatLoading && !chatData) {
		return (
			<section className={cls.chatView}>
				<UserCardSkeleton count={1} type={UserCardType.CONTACT} />
			</section>
		);
	}

	if (isChatError && !chatData) {
		return (
			<section className={cls.chatView}>
				<div className={cls.errorState}>
					<NotMessage />
					<button onClick={refetchChat}>Повторить</button>
				</div>
			</section>
		);
	}

	if (!chatData) {
		return (
			<section className={cls.chatView}>
				<div className={cls.emptyState}>
					<NotMessage />
				</div>
			</section>
		);
	}

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
