'use client';

import { memo, useMemo } from 'react';
import Link from 'next/link';
import { UserCard, UserCardType } from '@/shared/ui/UserCard';
import type { Chat } from '../../model/types/chat.types';
import { mapChatToUserCard } from '../../model/mapper/chatMapper';

import cls from './ChatListItem.module.scss';

export interface ChatListItemProps {
	chat: Chat;
	isActive: boolean;
}

export const ChatListItem = memo(({ chat, isActive }: ChatListItemProps) => {
	const uid = useMemo(() => chat.chat.uid, [chat.chat.uid]);
	const userCardData = useMemo(() => mapChatToUserCard(chat), [chat]);

	const href = useMemo(() => `/chats/${uid}`, [uid]);

	const itemClass = useMemo(
		() => `${cls.chatItem} ${isActive ? cls.chatItemActive : ''}`,
		[isActive]
	);

	return (
		<Link
			href={href}
			className={itemClass}
			aria-label={`Чат с ${chat.name}`}
			prefetch={false}
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
});

ChatListItem.displayName = 'ChatListItem';
