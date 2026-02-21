'use client';

import { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { UserCardType } from '@/shared/ui/UserCard';

import cls from './Skeleton.module.scss';

interface UserCardSkeletonProps {
	type: UserCardType;
	className?: string;
	count: number;
}

export const UserCardSkeleton = memo<UserCardSkeletonProps>(
	({
		type,
		className,
		count = 1 // По умолчанию — 1 скелетон
	}) => {
		return (
			<>
				{Array.from({ length: count }).map((_, index) => (
					<div
						key={index}
						className={classNames(cls.userCard, {}, [className, cls[type]])}
					>
						{/* Аватар-заглушка */}
						<div className={cls.avatar} />

						<div className={cls.info}>
							<div className={cls.header}>
								<div className={cls.leftHeader}>
									{/* Имя-заглушка */}
									<div className={cls.nameSkeleton} />
								</div>

								{/* Правый блок для чатов */}
								{type === UserCardType.CHAT && (
									<div className={cls.rightHeader}>
										<div className={cls.statusSkeleton} />
										<div className={cls.timeSkeleton} />
									</div>
								)}
							</div>

							{/* Телефон для профиля */}
							{type === UserCardType.PROFILE && (
								<div className={cls.phoneSkeleton} />
							)}

							<div className={cls.footer}>
								{/* Сообщение для чатов */}
								{type === UserCardType.CHAT && (
									<div className={cls.messageSkeleton} />
								)}

								{/* Статус онлайн для контактов и ЧС */}
								{[UserCardType.CONTACT, UserCardType.BLACK_LIST].includes(
									type
								) && <div className={cls.onlineSkeleton} />}

								{/* Никнейм для профиля */}
								{type === UserCardType.PROFILE && (
									<div className={cls.nicknameSkeleton} />
								)}
							</div>
						</div>

						{/* Кнопка удаления для ЧС */}
						{type === UserCardType.BLACK_LIST && (
							<div className={cls.trashBtnSkeleton} />
						)}
					</div>
				))}
			</>
		);
	}
);

UserCardSkeleton.displayName = 'UserCardSkeleton';
