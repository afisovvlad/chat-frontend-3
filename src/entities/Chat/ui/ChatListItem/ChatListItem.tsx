'use client';

import { memo, useMemo, useCallback } from 'react';
import { UserCard, UserCardType } from '@/shared/ui/UserCard';
import { Button, ButtonColor, ButtonType } from '@/shared/ui/Button';
import type { Chat } from '../../model/types/chat.types';
import { mapChatToUserCard } from '../../lib/mapper/chatMapper';
import cls from './ChatListItem.module.scss';

interface ChatListItemProps {
	chat: Chat;
	isActive: boolean;
	onSelect: (uid: string) => void;
}

const ChatListItemComponent = ({
	chat,
	isActive,
	onSelect
}: ChatListItemProps) => {
	const uid = useMemo(() => chat.chat.uid, [chat.chat.uid]);

	const userCardData = useMemo(() => mapChatToUserCard(chat), [chat]);

	const handleClick = useCallback(() => {
		onSelect(uid);
	}, [onSelect, uid]);

	const itemClass = useMemo(
		() => `${cls.chatItem} ${isActive ? cls.chatItemActive : ''}`,
		[isActive]
	);

	return (
		<Button
			className={itemClass}
			onClick={handleClick}
			aria-label={`Чат с ${chat.name}`}
			color={ButtonColor.TRANSPARENT}
			btnType={ButtonType.BUTTON}
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
		</Button>
	);
};

export const ChatListItem = memo(ChatListItemComponent);

ChatListItem.displayName = 'ChatListItem';
