import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Messages.module.scss';

export interface MessagesProps {
	className?: string;
}

export function Messages({ className }: MessagesProps) {
	return (
		<div className={classNames(cls.messages, {}, [className])}>Сообщения</div>
	);
}
