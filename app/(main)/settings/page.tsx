import { SettingsPage } from '@/pages/SettingsPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Страница поддержки | А-Чат',
	keywords:
		'Страница поддержки, А-Чат, поддержка пользователя, мессенджер А-Чат, обратиться в поддержку, редактирование профиля, черный список, выйти из аккаунта',
	description: 'Страница поддержки пользователя| А-Чат'
};

const Settings = () => {
	return <SettingsPage />;
};

export default Settings;
