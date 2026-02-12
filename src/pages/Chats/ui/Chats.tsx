'use client';

import { useState, useCallback, memo } from 'react';
import { Container, ContainerType } from '@/shared/ui/Container';
import { ChatWidget } from '@/widgets/Chat';
import { ChatList } from '@/entities/Chat';
import { NotMessage } from '@/shared/ui/NotMessage/NotMessage';

import cls from './Chats.module.scss';

const ChatsPageComponent = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedChatUid, setSelectedChatUid] = useState<string | null>(null);

	const handleSearchChange = useCallback((query: string) => {
		setSearchQuery(query);
	}, []);

	const handleChatSelect = useCallback((chatUid: string) => {
		// Логирование только в режиме разработки
		if (process.env.NODE_ENV === 'development') {
			console.log('✅ Выбран чат с UID:', chatUid);
		}
		setSelectedChatUid(chatUid);
	}, []);

	return (
		<Container type={ContainerType.WRAPPER}>
			<Container type={ContainerType.SIDEBAR}>
				<ChatList
					onSelectChat={handleChatSelect}
					selectedChatUid={selectedChatUid}
					searchQuery={searchQuery}
					onSearchChange={handleSearchChange}
				/>
			</Container>

			<Container type={ContainerType.CONTENT}>
				{selectedChatUid ? (
					<ChatWidget chatUid={selectedChatUid} />
				) : (
					<div className={cls.emptyState}>
						<NotMessage />
					</div>
				)}
			</Container>
		</Container>
	);
};

export const ChatsPage = memo(ChatsPageComponent);

ChatsPage.displayName = 'ChatsPage';
