import { classNames } from '@/shared/lib/classNames/classNames';
import { Text, TextColor } from '@/shared/ui/Text';
import Image from 'next/image';
import { IUserCard } from '../model/types/IUserCard';
import cls from './UserCard.module.scss';

export enum UserCardType {
	CHAT = 'chat',
	CONTACT = 'contact',
	BLACK_LIST = 'blackList'
}

interface ChatListItemProps {
	className?: string;
	UserData?: IUserCard;
	type: UserCardType;
}

export const UserCard = ({ className, UserData, type }: ChatListItemProps) => {
	if (!UserData) {
		return null;
	}

	return (
		<div className={classNames(cls.ChatListItem, {}, [className])}>
			<Image
				className={classNames(cls.avatar, {}, [cls[type]])}
				alt={UserData.user?.username || ''}
				src={UserData.user?.avatar_url || ''}
			></Image>

			<div className={cls.info}>
				<div className={cls.header}>
					<Text color={TextColor.BLACK} className={cls.name}>
						{UserData.user?.first_name} {UserData.user?.last_name}
					</Text>

					<div className={cls.notification}></div>

					<div className={cls.status}></div>

					<Text color={TextColor.GRAY} className={cls.time}>
						21:49
					</Text>
				</div>

				<div className={cls.footer}>
					<Text className={cls.lastMes}>{UserData.last_message?.content}</Text>
					<div className={cls.newMesCount}>{UserData.new_message_count}</div>
				</div>
			</div>
		</div>
	);
};
