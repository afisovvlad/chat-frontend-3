'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
	Button,
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button';
import { SearchIcon, Phone, Back, Success, MobilePhone } from '@icons/index';
import { Search } from '@/shared/ui/Search';
import { useClickOutside } from '@/shared/lib/hooks/useClickOutSide/useClickOutside';
import { Avatar } from '@/shared/ui/Avatar';
import {
	Text,
	TextSize,
	TextTag,
	TextType,
	TitleTag,
	TextColor
} from '@/shared/ui/Text';
import { ChatActionBar } from '../ChatActionBar/ChatActionBar';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import { Modal } from '@/shared/ui/Modal';
import cls from './MessaHeader.module.scss';

// Импортируем хук мутации (раскомментируй, когда API будет готов)

// import {
// 	useAddContactByPhoneMutation,
// 	AddContactByPhoneRequest
// } from '@/entities/Contacts/model';

interface MessageHeaderProps {
	userName: string;
	userStatus: string;
	userAvatar?: string;
	isOnline?: boolean;
	isInContacts?: boolean;
	onCall: () => void;
	onAddToContacts?: () => void;
	onBlock?: () => void;
	onBack?: () => void;
	onActionBarVisibilityChange?: (isVisible: boolean) => void;
	// Данные для API-запроса (передаём из MessagesPage)
	contactPhone?: string;
	contactFirstName?: string;
	contactLastName?: string;
}

export const MessageHeader = ({
	userName,
	userStatus,
	userAvatar,
	isInContacts = false,
	// isOnline,
	onCall,
	onAddToContacts,
	onBlock,
	onBack,
	onActionBarVisibilityChange,
	//  Деструктурируем данные контакта
	contactPhone,
	contactFirstName,
	contactLastName
}: MessageHeaderProps) => {
	const [isSearchVisible, setIsSearchVisible] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	const isMobile = useMediaQuery();

	const [manuallyClosedActionBar, setManuallyClosedActionBar] = useState(false);
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

	const searchRef = useRef<HTMLDivElement>(null);

	const isActionBarVisible = !isInContacts && !manuallyClosedActionBar;

	// =================================================================
	// RTK Query мутация — РАСКОММЕНТИРУЙ, КОГДА API БУДЕТ ГОТОВ
	// =================================================================
	// const [addContact, { isLoading: isAddingContact, error: addContactError }] =
	// 	useAddContactByPhoneMutation();

	// MOCK: эмуляция загрузки для демонстрации
	const isAddingContact = false;
	const addContactError = null;
	// =================================================================

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

	//  Автозакрытие модалки успеха
	useEffect(() => {
		if (isSuccessModalOpen) {
			const timer = setTimeout(() => {
				setIsSuccessModalOpen(false);
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [isSuccessModalOpen]);

	useEffect(() => {
		onActionBarVisibilityChange?.(isActionBarVisible);
	}, [isActionBarVisible, onActionBarVisibilityChange]);

	const handleSearchToggle = () => {
		if (isSearchVisible) {
			setSearchQuery('');
		}
		setIsSearchVisible(!isSearchVisible);
	};

	const handleSearchClear = useCallback((currentValue: string) => {
		if (!currentValue) {
			setIsSearchVisible(false);
		}
	}, []);

	// =================================================================
	//  ОБРАБОТЧИК ДОБАВЛЕНИЯ В КОНТАКТЫ — С REAL API (закомментировано)
	// =================================================================
	const handleAddToContacts = useCallback(async () => {
		//  Вариант 1: MOCK (сейчас активен) — просто показываем модалку
		onAddToContacts?.();
		setManuallyClosedActionBar(true);
		setIsSuccessModalOpen(true);

		// =================================================================
		//  Вариант 2: REAL API — РАСКОММЕНТИРУЙ, КОГДА БЭКЕНД ГОТОВ
		// ================================================================
		/*
		if (!contactPhone || !contactFirstName || !contactLastName) {
			console.error('❌ Недостаточно данных для добавления контакта');
			return;
		}

		const payload: AddContactByPhoneRequest = {
			phone: contactPhone,
			first_name: contactFirstName,
			last_name: contactLastName,
		};

		try {
			await addContact(payload).unwrap();
			setManuallyClosedActionBar(true);
			setIsSuccessModalOpen(true);

			onAddToContacts?.();
			
		} catch (err: unknown) {
		
			if (err && typeof err === 'object' && 'status' in err) {
				const rtkErr = err as { status: number; data?: unknown };
				
				switch (rtkErr.status) {
					case 401:
						console.error('🔐 Не авторизован — требуется вход');

						break;
					case 400: {
						const validationErrors = rtkErr.data as Record<string, string[]>;
						const firstError = Object.values(validationErrors || {})?.[0]?.[0];
						console.error('❌ Ошибка валидации:', firstError);
	
						break;
					}
					case 409: {
						console.log('ℹ️Контакт уже в списке');
						setIsSuccessModalOpen(true); // Всё равно показываем успех
						break;
					}
					default:
						console.error('❌ Неизвестная ошибка:', rtkErr);
				}
			} else {
				console.error('❓ Неожиданная ошибка:', err);
			}
		}
		*/
		// =================================================================
	}, [
		onAddToContacts,
		// Раскомментировать зависимости, когда включишь API:
		// addContact,
		contactPhone,
		contactFirstName,
		contactLastName
	]);
	// =================================================================

	const handleBlock = useCallback(() => {
		onBlock?.();
		setManuallyClosedActionBar(true);
	}, [onBlock]);

	const handleActionBarClose = useCallback(() => {
		setManuallyClosedActionBar(true);
	}, []);

	return (
		<>
			<header className={cls.messageHeader}>
				<div className={cls.leftSection}>
					{isMobile && onBack && (
						<Button
							theme={ButtonTheme.CIRCLE}
							color={ButtonColor.TRANSPARENT}
							btnType={ButtonType.BUTTON}
							onClick={onBack}
							className={cls.backButton}
							aria-label='Назад к списку чатов'
						>
							<Back />
						</Button>
					)}
					<div className={cls.userInfo}>
						<div className={cls.userAvatar}>
							<Avatar
								src={userAvatar}
								alt={userName}
								variant='card'
								size={40}
							/>
						</div>

						{!isSearchVisible && (
							<div className={cls.userDetails}>
								<Text
									type={TextType.TITLE}
									tag={TitleTag.H3}
									fontSize={TextSize.L}
									className={cls.userNameText}
								>
									{userName}
								</Text>
								<Text
									type={TextType.TEXT}
									tag={TextTag.P}
									fontSize={TextSize.S}
									className={cls.userStatusText}
								>
									{userStatus}
								</Text>
							</div>
						)}
					</div>

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

				{!isSearchVisible && (
					<div className={cls.actions}>
						{!isMobile && (
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
						)}

						<Button
							btnType={ButtonType.BUTTON}
							color={ButtonColor.TRANSPARENT}
							theme={ButtonTheme.CIRCLE}
							onClick={onCall}
							aria-label='Начать звонок'
							className={cls.btn}
						>
							{isMobile ? (
								<MobilePhone aria-hidden='true' className={cls.icon} />
							) : (
								<Phone aria-hidden='true' className={cls.icon} />
							)}
						</Button>
					</div>
				)}
			</header>

			{isActionBarVisible && (
				<div className={cls.actionBarContainer}>
					<ChatActionBar
						onAddToContacts={handleAddToContacts}
						onBlock={handleBlock}
						onClose={handleActionBarClose}
						isLoading={isAddingContact}
					/>
				</div>
			)}

			<Modal
				isOpen={isSuccessModalOpen}
				onClose={() => setIsSuccessModalOpen(false)}
				closeButton={false}
				size='compact'
				className={cls.successModal}
			>
				<div className={cls.successModalContent}>
					<Success className={cls.successIcon} aria-hidden='true' />
					<div className={cls.modalInfo}>
						<Text
							type={TextType.TITLE}
							tag={TitleTag.H3}
							fontSize={TextSize.L}
							className={cls.userNameText}
						>
							{userName}
						</Text>
						<Text
							type={TextType.TEXT}
							tag={TextTag.P}
							fontSize={TextSize.S}
							color={TextColor.BLACK}
							className={cls.successText}
						>
							теперь в списке ваших контактов
						</Text>
					</div>
				</div>
			</Modal>
		</>
	);
};
