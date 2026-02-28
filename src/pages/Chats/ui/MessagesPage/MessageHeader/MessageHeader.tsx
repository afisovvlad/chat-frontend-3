'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
	Button,
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button';
import { SearchIcon, Phone } from '@icons/index';
import { Search } from '@/shared/ui/Search';
import { useClickOutside } from '@/shared/lib/hooks/useClickOutSide/useClickOutside';
import { Avatar } from '@/shared/ui/Avatar';
import { Text, TextSize, TextTag, TextType, TitleTag } from '@/shared/ui/Text';

import cls from './MessaHeader.module.scss';

interface MessageHeaderProps {
	userName: string;
	userStatus: string;
	userAvatar?: string;
	isOnline?: boolean;
	isInContacts?: boolean;
	onCall: () => void;
	onAddToContacts?: () => void;
	onBlock?: () => void;
}

export const MessageHeader = ({
	userName,
	userStatus,
	userAvatar,
	isOnline,
	onCall
}: MessageHeaderProps) => {
	const [isSearchVisible, setIsSearchVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const searchRef = useRef<HTMLDivElement>(null);

	useClickOutside(searchRef, () => {
		if (isSearchVisible) {
			setIsSearchVisible(false);
			setSearchQuery('');
		}
	});

	useEffect(() => {
		if (isSearchVisible && searchRef.current) {
			const input = searchRef.current.querySelector('input');
			input?.focus();
		}
	}, [isSearchVisible]);

	const handleSearchToggle = () => {
		if (isSearchVisible) {
			setSearchQuery('');
		}
		setIsSearchVisible(!isSearchVisible);
	};

	// 🔥 handleSearchClear теперь принимает currentValue
	const handleSearchClear = useCallback((currentValue: string) => {
		// 🔥 Решение принимаем на основе переданного значения (оно актуально!)
		if (!currentValue) {
			setIsSearchVisible(false); // Закрываем если пусто
		}
		// Если был текст — Search уже вызвал onChange('') и очистил инпут
	}, []);
	return (
		<header className={cls.messageHeader}>
			{/* 🔥 Левая часть: аватар + (инфо ИЛИ поиск) */}
			<div className={cls.leftSection}>
				<div className={cls.userAvatar}>
					<Avatar src={userAvatar} alt={userName} variant='card' size={40} />
				</div>

				{/* Показываем инфо пользователя, если поиск скрыт */}
				{!isSearchVisible && (
					<div className={cls.userDetails}>
						<Text type={TextType.TITLE} tag={TitleTag.H3} fontSize={TextSize.L}>
							{userName}
						</Text>
						<Text type={TextType.TEXT} tag={TextTag.P} fontSize={TextSize.S}>
							{userStatus}
						</Text>
					</div>
				)}

				{/* Показываем поиск, если активен */}
				{isSearchVisible && (
					<div
						ref={searchRef}
						className={cls.searchContainer}
						id='chat-search-panel'
						role='search'
					>
						<Search
							value={searchQuery}
							onChange={setSearchQuery}
							onClear={handleSearchClear}
							placeholder='Поиск в чате...'
							alwaysShowClear={true}
							showIcon={true}
							autoFocus={true}
						/>
					</div>
				)}
			</div>

			{/* 🔥 Правая часть: кнопки действий (скрыты при поиске) */}
			{!isSearchVisible && (
				<div className={cls.actions}>
					<Button
						btnType={ButtonType.BUTTON}
						color={ButtonColor.TRANSPARENT}
						theme={ButtonTheme.CIRCLE}
						onClick={handleSearchToggle}
						aria-label='Поиск сообщений'
						aria-expanded={isSearchVisible}
						className={cls.btn}
					>
						<SearchIcon className={cls.icon} aria-hidden='true' />
					</Button>

					<Button
						btnType={ButtonType.BUTTON}
						color={ButtonColor.TRANSPARENT}
						theme={ButtonTheme.CIRCLE}
						onClick={onCall}
						aria-label='Начать звонок'
						className={cls.btn}
					>
						<Phone aria-hidden='true' className={cls.icon} />
					</Button>
				</div>
			)}
		</header>
	);
};
