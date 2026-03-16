'use client';

import { memo, ReactNode } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { UserCardSkeleton } from '@/shared/ui/Skeleton';
import { UserCardType } from '../../UserCard';
import { Text, TextColor, TextSize, TextTag, TextType } from '../../Text';
import cls from './SearchSection.module.scss';

export interface SearchSectionProps {
	title: string;
	children: ReactNode;
	isLoading?: boolean;
	className?: string;
	showHeader?: boolean; // Показывать ли заголовок секции
}

export const SearchSection = memo(
	({
		title,
		children,
		isLoading = false,
		className,
		showHeader = true
	}: SearchSectionProps) => {
		return (
			<section className={classNames(cls.section, {}, [className])}>
				{/* Условно рендерим заголовок */}
				{showHeader && (
					<div className={cls.header}>
						<Text
							type={TextType.TEXT}
							tag={TextTag.SPAN}
							fontSize={TextSize.S}
							color={TextColor.BLACK}
							truncate
							className={cls.title}
						>
							{title}
						</Text>
					</div>
				)}

				{isLoading ? (
					<div className={cls.skeletonWrapper}>
						<UserCardSkeleton count={3} type={UserCardType.CONTACT} />
					</div>
				) : (
					<div className={cls.content}>{children}</div>
				)}
			</section>
		);
	}
);

SearchSection.displayName = 'SearchSection';
