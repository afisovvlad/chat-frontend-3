import { BlackListPage } from '@/pages/BlackListPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Черный список | А-Чат',
	keywords:
		'Черный список пользователей, А-Чат, черный список, мессенджер А-Чат, добавить в черный список, удалить из черного списка',
	description: 'Черный список пользователя| А-Чат'
};

export default function BlackList() {
	return <BlackListPage />;
}
