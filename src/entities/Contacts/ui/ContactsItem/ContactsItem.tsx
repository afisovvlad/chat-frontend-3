'use client';

import { memo, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { UserCard, UserCardType } from '@/shared/ui/UserCard';

import { ContactsSchema } from '../../model/types/contacts.types';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import cls from './ContactsItem.module.scss';
import { mapContactToUserCard } from '../../model/mapper/contactsMapper';

export interface ContactsListItemProps {
	contact: ContactsSchema;
	isActive: boolean;
	onClick?: () => void;
	isSelectionMode?: boolean;
	isSelected?: boolean;
}

const propsAreEqual = (
	prev: ContactsListItemProps,
	next: ContactsListItemProps
): boolean => {
	return (
		prev.contact.uid === next.contact.uid &&
		prev.isActive === next.isActive &&
		prev.isSelectionMode === next.isSelectionMode &&
		prev.isSelected === next.isSelected &&
		prev.contact.system_contact.is_online ===
			next.contact.system_contact.is_online &&
		prev.contact.system_contact.was_online_at ===
			next.contact.system_contact.was_online_at
	);
};

export const ContactsListItem = memo(
	({
		contact,
		isActive,
		onClick,
		isSelectionMode = false,
		isSelected = false
	}: ContactsListItemProps) => {
		const chatUid = contact.system_contact.uid;

		const userCardData = useMemo(
			() => mapContactToUserCard(contact),
			[contact]
		);

		const isMobile = useMediaQuery();
		const href = `/chats/${chatUid}`;

		// 🔹 Динамические классы
		const itemClass = useMemo(() => {
			const classes = [cls.contactItem];
			if (isActive) {
				classes.push(cls.contactItemActive);
			}
			if (isSelectionMode && isSelected) {
				classes.push(cls.contactItemSelected);
			}
			return classes.join(' ');
		}, [isActive, isSelectionMode, isSelected]);

		const handleClick = useCallback(
			(e: React.MouseEvent<HTMLAnchorElement>) => {
				e.preventDefault(); // 🔹 Блокируем переход — управляем через onClick
				onClick?.();

				if (isMobile) {
					// 🔹 Исправленный console.log без синтаксических ошибок
					if (isSelectionMode) {
						console.log('Mobile selection toggle:', chatUid);
					} else {
						console.log('Mobile click on contact → chat:', chatUid);
					}
				}
			},
			[isMobile, chatUid, onClick, isSelectionMode]
		);

		return (
			<Link
				href={href}
				className={itemClass}
				aria-label={
					isSelectionMode
						? `${isSelected ? 'Снять выделение с' : 'Выбрать'} ${contact.first_name} ${contact.last_name}`
						: `Начать чат с ${contact.first_name} ${contact.last_name}`
				}
				scroll={false}
				replace={false}
				prefetch={!isMobile}
				onClick={handleClick}
				data-chat-uid={chatUid}
				data-is-mobile={isMobile}
				data-selected={isSelected}
			>
				<div className={cls.itemContent}>
					<div className={cls.userCard}>
						<UserCard userData={userCardData} type={UserCardType.CONTACT} />
					</div>

					{/* 🔹 ЧЕКБОКС: только в режиме выбора */}
					{isSelectionMode && (
						<div className={cls.checkbox}>
							{isSelected ? (
								<div className={cls.checkboxChecked}>
									<svg
										width='12'
										height='10'
										viewBox='0 0 12 10'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
										aria-hidden='true'
									>
										<path
											d='M1 5L4.5 8.5L11 1'
											stroke='white'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
										/>
									</svg>
								</div>
							) : (
								<div className={cls.checkboxEmpty} />
							)}
						</div>
					)}
				</div>
			</Link>
		);
	},
	propsAreEqual
);

ContactsListItem.displayName = 'ContactsListItem';
