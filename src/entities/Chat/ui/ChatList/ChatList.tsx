'use client';

import { memo, useMemo, useCallback } from 'react';
import { ChatListItem } from '../ChatListItem/ChatListItem';
import { Search } from '@/shared/ui/Search';
import { mockChats } from '../../mock/mockData';
import { EmptyChats } from '@/shared/ui/EmptyChats/EmptyChats';
import cls from './ChatList.module.scss';

export interface ChatListProps {
	searchQuery?: string;
	onSearchChange?: (value: string) => void;
	onSearchClear?: () => void;
	onSelectChat: (uid: string) => void;
	selectedChatUid?: string | null;
}

const ChatListComponent = ({
	searchQuery = '',
	onSearchChange,
	onSearchClear,
	onSelectChat,
	selectedChatUid = null
}: ChatListProps) => {
	const filteredChats = useMemo(() => {
		if (!searchQuery.trim()) {
			return mockChats;
		}

		const term = searchQuery.toLowerCase().trim();
		return mockChats.filter(chat => {
			const name = chat.name.toLowerCase();
			const username = chat.chat.username?.toLowerCase() || '';
			const nickname = chat.chat.nickname?.toLowerCase() || '';
			const firstName = chat.chat.first_name.toLowerCase();
			const lastName = chat.chat.last_name.toLowerCase();
			const patronymic = chat.chat.patronymic?.toLowerCase() || '';
			const messageContent = chat.last_message?.content.toLowerCase() || '';

			return (
				name.includes(term) ||
				username.includes(term) ||
				nickname.includes(term) ||
				firstName.includes(term) ||
				lastName.includes(term) ||
				patronymic.includes(term) ||
				messageContent.includes(term)
			);
		});
	}, [searchQuery]);

	const handleSelectChat = useCallback(
		(uid: string) => {
			onSelectChat(uid);
		},
		[onSelectChat]
	);

	const handleChange = useCallback(
		(value: string) => {
			onSearchChange?.(value);
		},
		[onSearchChange]
	);

	const handleClear = useCallback(() => {
		onSearchClear?.();
	}, [onSearchClear]);

	const containerClass = useMemo(() => cls.chatList, []);

	const emptyState = useMemo(
		() => (
			<div className={cls.empty} role='status' aria-live='polite'>
				<EmptyChats />
			</div>
		),
		[]
	);

	const chatList = useMemo(
		() => (
			<div className={cls.list} role='list'>
				{filteredChats.map(chat => (
					<ChatListItem
						key={chat.id}
						chat={chat}
						isActive={selectedChatUid === chat.chat.uid}
						onSelect={handleSelectChat}
					/>
				))}
			</div>
		),
		[filteredChats, selectedChatUid, handleSelectChat]
	);

	return (
		<div className={containerClass} aria-label='Список чатов'>
			<div className={cls.search}>
				<Search
					value={searchQuery}
					onChange={handleChange}
					onClear={handleClear}
					placeholder='Поиск чатов...'
					showIcon={true}
				/>
			</div>

			{filteredChats.length === 0 ? emptyState : chatList}
		</div>
	);
};
export const ChatList = memo(ChatListComponent);
ChatList.displayName = 'ChatList';
