'use client';

import { memo } from 'react';
import { ChatList, ChatView } from '@/entities/Chat';
import { Container, ContainerType } from '@/shared/ui/Container';
import { useParams, useRouter } from 'next/navigation';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';

import cls from './Chats.module.scss';

const ChatsPageComponent = () => {
	const params = useParams();
	const router = useRouter();
	const chatUid = params?.uid as string | undefined;
	const isMobile = useMediaQuery();

	// МОБИЛЬНАЯ ЛОГИКА: показываем только один экран
	if (isMobile) {
		return (
			<Container type={ContainerType.WRAPPER}>
				{chatUid ? (
					// Если чат выбран → показываем сообщения (CONTENT)
					<Container type={ContainerType.CONTENT}>
						<ChatView chatUid={chatUid} onBack={() => router.push('/chats')} />
					</Container>
				) : (
					// Если чат не выбран → показываем список чатов (SIDEBAR)
					<Container type={ContainerType.SIDEBAR}>
						<ChatList selectedChatUid={null} />
					</Container>
				)}
			</Container>
		);
	}

	//  ДЕСКТОПНАЯ ЛОГИКА: показываем оба контейнера
	return (
		<Container type={ContainerType.WRAPPER}>
			<Container type={ContainerType.SIDEBAR}>
				<ChatList selectedChatUid={chatUid ?? null} />
			</Container>

			<Container type={ContainerType.CONTENT}>
				{chatUid ? (
					<ChatView chatUid={chatUid} />
				) : (
					<div className={cls.emptyState}>
						<p>Выберите чат для начала общения</p>
					</div>
				)}
			</Container>
		</Container>
	);
};

export const ChatsPage = memo(ChatsPageComponent);
ChatsPage.displayName = 'ChatsPage';
