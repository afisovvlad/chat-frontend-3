'use client';

import { memo } from 'react';
import cls from './ChatListSkeleton.module.scss';

interface ChatListSkeletonProps {
	count?: number;
}

export const ChatListSkeleton = memo<ChatListSkeletonProps>(({ count = 8 }) => {
	return (
		<div className={cls.skeletonList} role='status' aria-live='polite'>
			{Array.from({ length: count }).map((_, index) => (
				<div key={index} className={cls.skeletonItem}>
					<div className={cls.skeletonAvatar} />
					<div className={cls.skeletonContent}>
						<div className={cls.skeletonTitle} />
						<div className={cls.skeletonMessage} />
					</div>
					<div className={cls.skeletonMeta}>
						<div className={cls.skeletonTime} />
					</div>
				</div>
			))}
		</div>
	);
});

ChatListSkeleton.displayName = 'ChatListSkeleton';
