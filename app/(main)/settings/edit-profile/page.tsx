import type { Metadata } from 'next';
import { EditProfilePage } from '@/pages/EditProfilePage';

export const metadata: Metadata = {
	title: 'Редактирование профиля | А-Чат',
	keywords:
		'Редактирование профиля, А-Чат, профиль пользователя, мессенджер А-Чат, редактировать профиль',
	description: 'Редактирование профиля пользователя| А-Чат'
};

export default function EditProfile() {
	return <EditProfilePage />;
}
