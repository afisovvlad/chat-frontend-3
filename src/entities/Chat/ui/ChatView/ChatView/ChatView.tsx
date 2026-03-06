'use client';

import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Messages } from '@/entities/Messages';
import { MessageFormComponent } from '@/features/messageForm';
import { ChatHeader } from '../ChatHeader/ChatHeader';
import { useChatHeaderData } from '@/entities/Chat/model/lib/hooks/useChatHeaderData/useChatHeaderData';
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

import cls from './ChatView.module.scss';

interface ChatViewProps {
	chatUid: string;
	onBack?: () => void;
}

export const ChatView = ({ chatUid, onBack }: ChatViewProps) => {
	const isMobile = useMediaQuery();
	const [isActionBarVisible, setIsActionBarVisible] = useState(true);

	// RTK Query селектор уже мемоизирован — не нужно оборачивать в useMemo
	const chatDataFromCache = useSelector((state: RootState) =>
		selectChatByUid(state, chatUid)
	);

	//  Упрощённая логика выбора данных (моки или кеш)
	const chatData = useMemo(() => {
		if (!appConfig.USE_MOCKS) {
			return chatDataFromCache;
		}
		return mockChats.find((chat: Chat) => chat.chat.uid === chatUid) ?? null;
	}, [chatDataFromCache, chatUid]);

	//  Вся логика хедера вынесена в хук
	const { headerData, hasMessages } = useChatHeaderData(chatData);

	//  Обработчики
	const handleBack = useCallback(() => {
		if (onBack) {
			onBack();
		} else {
			window.history.back();
		}
	}, [onBack]);

	const handleCall = useCallback(() => {
		//  Здесь будет логика звонка (WebRTC, модальное окно и т.д.)
		console.log('📞 Call initiated for chat:', chatUid);
	}, [chatUid]);

	const handleAddToContacts = useCallback(() => {
		console.log('👤 Add to contacts:', chatUid);
	}, [chatUid]);

	const handleBlock = useCallback(() => {
		console.log('🚫 Block user:', chatUid);
	}, [chatUid]);

	//  Ранний возврат — проверяем chatData, а не headerData
	if (!chatData) {
		return (
			<section className={cls.chatView}>
				<UserCardSkeleton count={1} type={UserCardType.CONTACT} />
			</section>
		);
	}

	//  Простой класс без useMemo — шаблонная строка дешевле
	const messagesClass = classNames(cls.messagesContent, {
		[cls.messagesContent_noRadius]: isMobile && isActionBarVisible
	});

	return (
		<section className={cls.chatView}>
			<ChatHeader
				{...headerData}
				onCall={handleCall}
				onAddToContacts={handleAddToContacts}
				onBlock={handleBlock}
				onBack={isMobile ? handleBack : undefined}
				onActionBarVisibilityChange={setIsActionBarVisible}
			/>

			{hasMessages ? (
				<>
					<Messages className={messagesClass} />
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
