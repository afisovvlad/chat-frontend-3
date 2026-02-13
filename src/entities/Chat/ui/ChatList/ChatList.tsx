'use client';

import { memo, useMemo } from 'react';
import { ChatListItem } from '../ChatListItem/ChatListItem';
import { Search } from '@/shared/ui/Search';
import { useGetChatsQuery } from '../../api/chatApi';
import { useChatSearch } from '../../model/lib/hooks/useChatSearch';
import { ChatListSkeleton } from '../ChatListSkeleton/ChatListSkeleton';
import { mockChats } from '../../mock/mockData';
import EmptyChats from '@/shared/ui/EmptyChats/EmptyChats';
import cls from './ChatList.module.scss';

interface ChatListProps {
	selectedChatUid?: string | null;
}

export const ChatList = memo(({ selectedChatUid }: ChatListProps) => {
	const { searchQuery, debouncedQuery, handleSearchChange, handleSearchClear } =
		useChatSearch({
			debounceDelay: 300
		});

	const {
		data: chatsResponse,
		isLoading,
		isFetching
	} = useGetChatsQuery({
		search: debouncedQuery || undefined,
		pageSize: 50
	});

	// Фильтрация моковых данных по поисковому запросу
	const filteredChats = useMemo(() => {
		if (!debouncedQuery.trim()) {
			return mockChats;
		}

		const term = debouncedQuery.toLowerCase().trim();
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
	}, [debouncedQuery]);

	//!! данные с сервера (раскомментировать когда готово)
	// const chats = chatsResponse?.results ?? [];

	// данный с моковой фильтрацией
	const chats = filteredChats;

	const isEmpty = !isLoading && chats.length === 0;

	const showSkeleton = isLoading || (isFetching && debouncedQuery !== '');

	if (showSkeleton) {
		return (
			<div className={cls.chatList}>
				<div className={cls.search}>
					<Search
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder='Поиск чатов...'
						showIcon={true}
					/>
				</div>
				<div className={cls.list} role='listbox'>
					<ChatListSkeleton count={8} />
				</div>
			</div>
		);
	}

	return (
		<div className={cls.chatList} aria-label='Список чатов'>
			<div className={cls.search}>
				<Search
					value={searchQuery}
					onChange={handleSearchChange}
					onClear={handleSearchClear}
					placeholder='Поиск чатов...'
					showIcon={true}
				/>
			</div>

			{isEmpty ? (
				<div className={cls.empty} role='status' aria-live='polite'>
					<EmptyChats />
				</div>
			) : (
				<div className={cls.list} role='listbox' aria-multiselectable='false'>
					{chats.map(chat => (
						<ChatListItem
							key={chat.id}
							chat={chat}
							isActive={selectedChatUid === chat.chat.uid}
						/>
					))}
				</div>
			)}
		</div>
	);
});

ChatList.displayName = 'ChatList';
