import { LoginPage } from '@/pages/LoginPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Вход/Регистрация',
	description: 'Вход/Регистрация',
	keywords: 'А-Чат, вход, регистрация'
};

export default function Login() {
	return <LoginPage />;
}
