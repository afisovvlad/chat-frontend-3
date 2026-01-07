import type { Metadata } from 'next';
import { EditProfile } from '@/pages/EditProfile';

export const metadata: Metadata = {
	title: 'Редактирование профиля | А-Чат',
	keywords:
		'Редактирование профиля, А-Чат, профиль пользователя, мессенджер А-Чат, редактировать профиль',
	description: 'Редактирование профиля пользователя| А-Чат'
};

export default function EditProfilePage() {
	return <EditProfile />;
}
