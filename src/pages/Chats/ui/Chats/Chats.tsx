'use client';

import { memo } from 'react';
import MessagesPage from '../MessagesPage/MessagePage/MessagesPage';
import { ChatList } from '@/entities/Chat';
import { Container, ContainerType } from '@/shared/ui/Container';
import { useParams } from 'next/navigation';

import cls from './Chats.module.scss';

const ChatsPageComponent = () => {
	const params = useParams();
	const chatUid = params?.uid as string | undefined;

	return (
		<Container type={ContainerType.WRAPPER}>
			<Container type={ContainerType.SIDEBAR}>
				<ChatList selectedChatUid={chatUid ?? null} />
			</Container>

			<Container type={ContainerType.CONTENT}>
				{chatUid ? (
					<MessagesPage chatUid={chatUid} />
				) : (
					<div className={cls.emptyState}>
						{/* Компонент заглушки когда чат не выбран */}
						<p>Выберите чат для начала общения</p>
					</div>
				)}
			</Container>
		</Container>
	);
};

export const ChatsPage = memo(ChatsPageComponent);

ChatsPage.displayName = 'ChatsPage';
