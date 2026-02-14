'use client';

import { ChatList } from '@/entities/Chat';
import { Container, ContainerType } from '@/shared/ui/Container';
import NotMessage from '@/shared/ui/NotMessage/NotMessage';
import { ChatWidget } from '@/widgets/Chat';
import { memo, useEffect } from 'react';

import { useParams } from 'next/navigation';
import cls from './Chats.module.scss';

const ChatsPageComponent = () => {
	const params = useParams();
	const chatUid = params?.uid as string | undefined;

	// Логирование только в режиме разработки
	useEffect(() => {
		if (process.env.NODE_ENV === 'development' && chatUid) {
			console.log('✅ Выбран чат с UID:', chatUid);
		}
	}, [chatUid]);

	return (
		<Container type={ContainerType.WRAPPER}>
			<Container type={ContainerType.SIDEBAR}>
				<ChatList selectedChatUid={chatUid ?? null} />
			</Container>

			<Container type={ContainerType.CONTENT}>
				{chatUid ? (
					<ChatWidget chatUid={chatUid} />
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
