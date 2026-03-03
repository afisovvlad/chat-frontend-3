'use client';

import { MessageFormComponent } from '@/features/messageForm';
import { Messages } from '@/entities/Messages';
import { MessageHeader } from '../MessageHeader/MessageHeader';
import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectChatByUid } from '@/entities/Chat/api/chatApi';
import { UserCardSkeleton } from '@/shared/ui/Skeleton';
import { Chat } from '@/entities/Chat/model/types/chat.types';
import { RootState } from '@/app/providers/StoreProvider';
import { UserCardType } from '@/shared/ui/UserCard';
import { appConfig } from '@/shared/config/app.config';
import NotMessage from '@/shared/ui/NotMessage/NotMessage';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './MessagesPage.module.scss';

import { mockChats } from '@/entities/Chat/mock/mockData';
interface MessagesPageProps {
	chatUid: string;
	onBack?: () => void;
}

const MessagesPage = ({ chatUid, onBack }: MessagesPageProps) => {
	const [, setIsCallActive] = useState(false);
	const [isActionBarVisible, setIsActionBarVisible] = useState(true);

	const isMobile = useMediaQuery();

	const chatDataFromCache = useSelector((state: RootState) =>
		selectChatByUid(state, chatUid)
	);

	const chatData = useMemo(() => {
		if (appConfig.USE_MOCKS) {
			const found = mockChats.find((chat: Chat) => chat.chat.uid === chatUid);
			return found;
		}
		return chatDataFromCache;
	}, [chatDataFromCache, chatUid]);

	const handleCall = () => setIsCallActive(true);

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			// Fallback для десктопа (если вдруг вызовут)
			window.history.back();
		}
	};

	const messagesClass = useMemo(
		() =>
			classNames(cls.messagesContent, {}, [
				isMobile && isActionBarVisible
					? cls.messagesContent_noRadius
					: undefined
			]),
		[isMobile, isActionBarVisible]
	);

	const { headerData, hasMessages } = useMemo(() => {
		if (!chatData) {
			return { headerData: null, hasMessages: false };
		}

		const { last_message, new_message_count, chat: userInfo } = chatData;
		const {
			first_name,
			last_name,
			avatar_webp_url,
			avatar_url,
			is_online,
			was_online_at,
			is_in_contacts
		} = userInfo;

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

		const hasMsg = (() => {
			if ((new_message_count ?? 0) > 0) {
				return true;
			}
			if (!last_message) {
				return false;
			}
			if (last_message.id && last_message.id > 0) {
				return true;
			}
			if (last_message.uid?.trim()) {
				return true;
			}
			if (last_message.content?.trim()) {
				return true;
			}
			if (last_message.files_summary?.count > 0) {
				return true;
			}
			return false;
		})();

		return {
			headerData: {
				userName,
				userStatus,
				userAvatar,
				isOnline: is_online,
				isInContacts: is_in_contacts
			},
			hasMessages: hasMsg
		};
	}, [chatData]);

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
				isInContacts={headerData.isInContacts}
				onCall={handleCall}
				onAddToContacts={() => console.log('Добавить в контакты:', chatUid)}
				onBlock={() => console.log('Заблокировать:', chatUid)}
				onBack={isMobile ? handleBack : undefined} //  Передаём onBack только для мобильных
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

export default MessagesPage;
