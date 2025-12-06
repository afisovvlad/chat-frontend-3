import cls from './Login.module.scss';

interface LoginProps {
	className?: string;
}

export const Login = ({ className }: LoginProps) => {
	return <div className={cls.Login}>Login</div>;
};
