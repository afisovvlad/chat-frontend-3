import { classNames } from '@/shared/lib/classNames/classNames';
import { Avatar } from '@/shared/ui/Avatar/';
import {
	FontWeight,
	Text,
	TextClamp,
	TextColor,
	TextSize,
	TextTag
} from '@/shared/ui/Text';
import { SentRead, SentTime, Trash, VolumeOff, VolumeOn } from '@icons/index';
import { Button, ButtonColor, ButtonSize, ButtonTheme } from '../../Button';
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
	sendingMessage?: boolean;
}

export const UserCard = ({
	className,
	UserData,
	type,
	sendingMessage
}: ChatListItemProps) => {
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

	const formatUnreadCount = (count: number | undefined): string => {
		if (count) {
			if (count < 1000) {
				return count.toString();
			}

			const thousands = count / 1000;
			return thousands % 1 === 0
				? `${Math.floor(thousands)}К`
				: `${thousands.toFixed(1).replace('.', ',')}К`;
		}
		return '';
	};

	const renderNotifications = () => {
		if (type === UserCardType.CHAT) {
			if (!UserData.notifications) {
				return (
					<div className={cls.notification}>
						<VolumeOff className={cls.volumeIcon} />
					</div>
				);
			} else if (UserData.chat_type !== 'chat') {
				return (
					<div className={cls.notification}>
						<VolumeOn className={cls.volumeIcon} />
					</div>
				);
			}
		}
	};

	return (
		<div className={classNames(cls.UserCard, {}, [className, cls[type]])}>
			<Avatar
				className={cls.avatar}
				alt={UserData.user?.username}
				src={UserData.user?.avatar_url}
				size={size}
			/>

			<div className={cls.info}>
				<div className={cls.header}>
					<div className={cls.leftHeader}>
						<Text
							color={TextColor.BLACK}
							fontSize={TextSize.L}
							fontWeight={FontWeight.MEDIUM}
							tag={TextTag.DIV}
							className={cls.name}
						>
							{UserData.user?.first_name} {UserData.user?.last_name}
						</Text>
						{renderNotifications()}
					</div>

					{/* rightHeader только для чатов */}
					{type === UserCardType.CHAT && (
						<div className={cls.rightHeader}>
							<div className={cls.status}>
								{sendingMessage ? <SentTime /> : <SentRead />}
							</div>

							<Text
								color={TextColor.GRAY}
								fontSize={TextSize.S}
								fontWeight={FontWeight.REGULAR}
								className={cls.time}
							>
								21:49
							</Text>
						</div>
					)}
				</div>

				{/* только для профиля */}
				{type === UserCardType.PROFILE && (
					<Text
						className={cls.phone}
						fontSize={TextSize.M}
						fontWeight={FontWeight.REGULAR}
						color={TextColor.BLACK}
					>
						{UserData.user?.phone}
					</Text>
				)}

				<div className={cls.footer}>
					{/* для чатов */}
					{type === UserCardType.CHAT && (
						<>
							<Text
								className={cls.lastMes}
								color={TextColor.GRAY}
								fontSize={TextSize.S}
								fontWeight={FontWeight.REGULAR}
								maxLines={TextClamp.LINES_2}
							>
								{UserData.last_message?.content}
							</Text>

							{UserData.last_message?.new && (
								<Text
									className={cls.newMesCount}
									fontSize={TextSize.M}
									color={TextColor.WHITE}
									fontWeight={FontWeight.REGULAR}
								>
									{formatUnreadCount(UserData.new_message_count)}
								</Text>
							)}
						</>
					)}
					{/* для контактов и черного списка */}
					{[UserCardType.CONTACT, UserCardType.BLACK_LIST].includes(type) && (
						<Text
							className={cls.isOnline}
							color={TextColor.ACCENT}
							fontSize={TextSize.S}
							fontWeight={FontWeight.REGULAR}
						>
							{UserData.user?.is_online ? 'в сети' : 'не в сети'}
						</Text>
					)}

					{/* для профиля */}
					{type === UserCardType.PROFILE && (
						<Text
							className={cls.nickname}
							fontSize={TextSize.M}
							fontWeight={FontWeight.REGULAR}
							color={TextColor.BLACK}
						>
							{UserData.user?.nickname}
						</Text>
					)}
				</div>
			</div>

			{/* кнопка удаления для чс */}
			{type === UserCardType.BLACK_LIST && (
				<Button
					theme={ButtonTheme.CIRCLE}
					color={ButtonColor.TRANSPARENT}
					size={ButtonSize.S}
					className={cls.trashBtn}
				>
					<Trash className={cls.trashIcon} />
				</Button>
			)}
		</div>
	);
};
