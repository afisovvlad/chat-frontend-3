import { ChatsPage } from '@/pages/Chats';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Чаты | А-Чат',
	keywords: 'Чаты, А-Чат, мессенджер А-Чат, список чатов, сообщения, переписка',
	description: 'Список ваших чатов | А-Чат'
};

const Chats = () => {
	return <ChatsPage />;
};

export default Chats;
