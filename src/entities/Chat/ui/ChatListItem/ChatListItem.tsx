'use client';

import { memo, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { UserCard, UserCardType } from '@/shared/ui/UserCard';
import type { Chat } from '../../model/types/chat.types';
import { mapChatToUserCard } from '../../model/mapper/chatMapper';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';

import cls from './ChatListItem.module.scss';

export interface ChatListItemProps {
	chat: Chat;
	isActive: boolean;
}

const propsAreEqual = (
	prev: ChatListItemProps,
	next: ChatListItemProps
): boolean => {
	return (
		prev.chat.id === next.chat.id &&
		prev.isActive === next.isActive &&
		prev.chat.last_activity_at === next.chat.last_activity_at &&
		prev.chat.new_message_count === next.chat.new_message_count &&
		prev.chat.last_message?.updated_at === next.chat.last_message?.updated_at
	);
};

export const ChatListItem = memo(({ chat, isActive }: ChatListItemProps) => {
	const uid = chat.chat.uid;
	const userCardData = useMemo(() => mapChatToUserCard(chat), [chat]);
	const isMobile = useMediaQuery();

	const href = `/chats/${uid}`;

	const itemClass = useMemo(
		() => `${cls.chatItem} ${isActive ? cls.chatItemActive : ''}`,
		[isActive]
	);

	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement>) => {
			// На мобильных можно добавить дополнительную логику
			if (isMobile) {
				// Например, отключить prefetch при клике
				// или добавить аналитику
				console.log('Mobile click on chat:', uid);
			}
		},
		[isMobile, uid]
	);

	return (
		<Link
			href={href}
			className={itemClass}
			aria-label={`Чат с ${chat.name}`}
			scroll={false}
			replace={false}
			prefetch={!isMobile}
			onClick={handleClick}
			data-chat-uid={uid}
			data-is-mobile={isMobile}
		>
			<div className={cls.itemContent}>
				<div className={cls.userCard}>
					<UserCard
						userData={userCardData}
						type={UserCardType.CHAT}
						sendingMessage={false}
					/>
				</div>
			</div>
		</Link>
	);
}, propsAreEqual);

ChatListItem.displayName = 'ChatListItem';
