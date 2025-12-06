import { Metadata } from 'next';
import { Login } from '@/pages/Login/ui/Login';

export const metadata: Metadata = {
	title: 'Вход/Регистрация',
	description: 'Вход/Регистрация',
	keywords: 'А-Чат, вход, регистрация'
};
interface pageProps {
	className?: string;
}

const LoginPage = ({}: pageProps) => {
	return <Login />;
};

export default LoginPage;
