import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './MessagesList.module.scss';

export interface MessagesProps {
	className?: string;
}

export const MessagesList = ({ className }: MessagesProps) => {
	return (
		<div className={classNames(cls.messages, {}, [className])}>Сообщения</div>
	);
};
