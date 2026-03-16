import { ChatsPage } from '@/pages/Chats';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Чат | А-Чат',
	keywords: 'Чат, А-Чат, мессенджер А-Чат, переписка',
	description: 'Ваш чат | А-Чат'
};

const ChatDetailPage = () => {
	return <ChatsPage />;
};

export default ChatDetailPage;
