import { classNames } from '@/shared/lib/classNames/classNames';
import { Avatar } from '@/shared/ui/Avatar/';
import { Text, TextColor } from '@/shared/ui/Text';
import { IUserCard } from '../model/types/IUserCard';
import cls from './UserCard.module.scss';

export enum UserCardType {
	CHAT = 'chat',
	CONTACT = 'contact',
	BLACK_LIST = 'blackList',
	PROFILE = 'profile'
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

	const AVATAR_SIZE: Record<UserCardType, number> = {
		[UserCardType.CHAT]: 60,
		[UserCardType.CONTACT]: 40,
		[UserCardType.BLACK_LIST]: 40,
		[UserCardType.PROFILE]: 82
	};

	const size = AVATAR_SIZE[type];

	return (
		<div className={classNames(cls.ChatListItem, {}, [className])}>
			<Avatar
				className={classNames(cls.avatar, {}, [])}
				alt={UserData.user?.username}
				src={UserData.user?.avatar_url || ''}
				size={size}
			></Avatar>

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
