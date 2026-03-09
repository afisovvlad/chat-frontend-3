'use client';

import { memo, useMemo, useCallback, useState } from 'react';
import { Search, useHybridSearch } from '@/shared/ui/Search';
import {
	useGetContactsQuery,
	useLazySearchGlobalContactsQuery
} from '../../api/contactsApi';
import { UserCardSkeleton } from '@/shared/ui/Skeleton';
import { UserCardType } from '@/shared/ui/UserCard';
import {
	CheckContactRequest,
	ContactsSchema,
	GetContactsRequest
} from '../../model/types/contacts.types';
import { appConfig } from '@/shared/config/app.config';
import { ContactsListContent } from '../ContactsListContent/ContactsListContent';
import { filterContactsLocal } from '../../model/filters/filterContactsLocal';
import { sortContactsByStatus } from '../../model/utils/sortContactsByStatus';
import { mockContacts } from '../../mock/mockContacts';
import EmptyContacts from '@/shared/ui/EmptyContacts/EmptyContacts';
import {
	Text,
	TextSize,
	TextTag,
	TextType,
	TextColor,
	TitleTag
} from '@/shared/ui/Text';
import {
	Button,
	ButtonTheme,
	ButtonColor,
	ButtonSize
} from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { Trash, Left, CancelSelection } from '@icons/index';
import cls from './ContactsList.module.scss';

// ─────────────────────────────────────────────────────────────
// 🔹 КОНСТАНТЫ
// ─────────────────────────────────────────────────────────────
const CONFIG = {
	LOCAL_CACHE_SIZE: 30,
	GLOBAL_SEARCH_MIN_LENGTH: 3,
	SEARCH_DEBOUNCE_MS: 300,
	GLOBAL_SEARCH_PREFIX: '@'
} as const;

export interface ContactsListProps {
	selectedContactUid?: string | null;
	onSelectContact?: (uid: string) => void;
}

export const ContactsList = memo(
	({ selectedContactUid, onSelectContact }: ContactsListProps) => {
		// ─────────────────────────────────────────────────────────────
		// 🔹 STATE
		// ─────────────────────────────────────────────────────────────
		const [isSelectionMode, setIsSelectionMode] = useState(false);
		const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
			new Set()
		);
		const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

		// ─────────────────────────────────────────────────────────────
		// 🔹 DATA FETCHING
		// ─────────────────────────────────────────────────────────────
		const { data: contactsResponse, isLoading: isCacheLoading } =
			useGetContactsQuery({
				pageSize: CONFIG.LOCAL_CACHE_SIZE,
				ordering: '-created_at'
			} as GetContactsRequest);

		const [searchGlobal] = useLazySearchGlobalContactsQuery();

		// ─────────────────────────────────────────────────────────────
		// 🔹 DATA TRANSFORMATION
		// ─────────────────────────────────────────────────────────────
		const localContacts = useMemo(() => {
			const source = appConfig.USE_MOCKS
				? mockContacts
				: (contactsResponse?.results ?? []);

			if (process.env.NODE_ENV === 'development' && appConfig.USE_MOCKS) {
				console.log('🧪 Using mock contacts (USE_MOCKS=true)');
			}

			return sortContactsByStatus(source);
		}, [contactsResponse]);

		// ─────────────────────────────────────────────────────────────
		// 🔹 HANDLERS: Selection
		// ─────────────────────────────────────────────────────────────
		const handleToggleSelection = useCallback((contactUid: string) => {
			setSelectedContacts(prev => {
				const next = new Set(prev);
				// 🔹 Исправлено: явный if/else вместо тернарного выражения
				if (next.has(contactUid)) {
					next.delete(contactUid);
				} else {
					next.add(contactUid);
				}
				return next;
			});
		}, []);

		const handleClearSelection = useCallback(() => {
			setSelectedContacts(new Set());
			setIsSelectionMode(false);
		}, []);

		const handleEnterSelectionMode = useCallback(() => {
			setIsSelectionMode(true);
			setSelectedContacts(new Set());
		}, []);

		// ─────────────────────────────────────────────────────────────
		// 🔹 HANDLERS: Delete Modal
		// ─────────────────────────────────────────────────────────────
		const handleOpenDeleteModal = useCallback(() => {
			setIsDeleteModalOpen(true);
		}, []);

		const handleCloseDeleteModal = useCallback(() => {
			setIsDeleteModalOpen(false);
		}, []);

		const handleConfirmDelete = useCallback(async () => {
			try {
				console.log('🗑️ Deleting contacts:', Array.from(selectedContacts));

				// TODO: Интеграция с API
				// await deleteContactsMutation.mutateAsync(Array.from(selectedContacts));

				handleClearSelection();
				setIsDeleteModalOpen(false);
			} catch (error) {
				console.error('Failed to delete contacts:', error);
				// TODO: Показать ошибку пользователю
			}
		}, [selectedContacts, handleClearSelection]);

		// ─────────────────────────────────────────────────────────────
		// 🔹 GLOBAL SEARCH
		// ─────────────────────────────────────────────────────────────
		const fetchGlobalContacts = useCallback(
			async (searchTerm: string): Promise<ContactsSchema[]> => {
				if (!searchTerm.startsWith(CONFIG.GLOBAL_SEARCH_PREFIX)) {
					return [];
				}

				const query = searchTerm
					.replace(CONFIG.GLOBAL_SEARCH_PREFIX, '')
					.trim();

				if (query.length < CONFIG.GLOBAL_SEARCH_MIN_LENGTH) {
					return [];
				}

				try {
					const payload: CheckContactRequest[] = [{ phone_or_nickname: query }];
					const result = await searchGlobal(payload).unwrap();
					return sortContactsByStatus(result?.results ?? []);
				} catch (error) {
					console.error('Global search error:', error);
					return [];
				}
			},
			[searchGlobal]
		);

		// ─────────────────────────────────────────────────────────────
		// 🔹 HYBRID SEARCH HOOK
		// ─────────────────────────────────────────────────────────────
		const {
			searchTerm,
			results: displayContacts,
			isGlobal,
			isLoading: isSearching,
			error: searchError,
			handleSearchChange,
			handleClear
		} = useHybridSearch<ContactsSchema>(
			localContacts,
			filterContactsLocal,
			fetchGlobalContacts,
			CONFIG.SEARCH_DEBOUNCE_MS,
			CONFIG.GLOBAL_SEARCH_PREFIX,
			CONFIG.GLOBAL_SEARCH_MIN_LENGTH
		);

		// ─────────────────────────────────────────────────────────────
		// 🔹 DERIVED STATE
		// ─────────────────────────────────────────────────────────────
		const searchLength = useMemo(
			() => searchTerm.trim().replace(/^@/, '').length,
			[searchTerm]
		);
		const hasMinLength = searchLength >= CONFIG.GLOBAL_SEARCH_MIN_LENGTH;
		const selectedCount = selectedContacts.size;

		const statusFlags = useMemo(() => {
			const isInitialLoading = isCacheLoading && !contactsResponse;
			const isGlobalSearching = isSearching && isGlobal && hasMinLength;

			return {
				shouldShowSkeleton:
					isInitialLoading ||
					(isGlobalSearching && displayContacts.length === 0),
				isEmpty:
					!isCacheLoading && !isSearching && displayContacts.length === 0,
				hasError: !!searchError && isGlobal && hasMinLength
			};
		}, [
			isCacheLoading,
			contactsResponse,
			isSearching,
			isGlobal,
			hasMinLength,
			displayContacts.length,
			searchError
		]);

		const searchPlaceholder = useMemo(() => {
			if (isGlobal) {
				return 'Глобальный поиск (@username)...';
			}
			if (appConfig.USE_MOCKS) {
				return 'Поиск по мокам...';
			}
			return 'Поиск контактов...';
		}, [isGlobal]);

		// ─────────────────────────────────────────────────────────────
		// 🔹 RENDER: Loading / Error
		// ─────────────────────────────────────────────────────────────
		if (statusFlags.shouldShowSkeleton) {
			return (
				<div className={cls.contactsList}>
					<div className={cls.search}>
						<Search
							value={searchTerm}
							onChange={handleSearchChange}
							placeholder='Поиск контактов...'
							showIcon
						/>
					</div>
					<div className={cls.list} role='listbox' aria-busy='true'>
						<UserCardSkeleton count={8} type={UserCardType.CONTACT} />
					</div>
				</div>
			);
		}

		if (statusFlags.hasError) {
			return (
				<div className={cls.contactsList}>
					<div className={cls.search}>
						<Search
							value={searchTerm}
							onChange={handleSearchChange}
							onClear={handleClear}
							placeholder='Глобальный поиск (@username)...'
							showIcon
						/>
					</div>
					<div className={cls.empty} role='alert' aria-live='assertive'>
						<EmptyContacts />
					</div>
				</div>
			);
		}

		// ─────────────────────────────────────────────────────────────
		// 🔹 RENDER: Main Content
		// ─────────────────────────────────────────────────────────────
		return (
			<div className={cls.contactsList} aria-label='Список контактов'>
				<Search
					value={searchTerm}
					onChange={handleSearchChange}
					onClear={handleClear}
					placeholder={searchPlaceholder}
					showIcon
				/>

				{isSelectionMode ? (
					<div className={cls.selectionHeader}>
						<div className={cls.btnWrapper}>
							<Button
								theme={ButtonTheme.CLEAR}
								className={cls.backButton}
								onClick={handleOpenDeleteModal}
								aria-label='Подтвердить удаление'
							>
								<Left className={cls.backIcon} aria-hidden='true' />
								<Text
									type={TextType.TEXT}
									tag={TextTag.SPAN}
									fontSize={TextSize.S}
								>
									Удалить контакты
								</Text>
							</Button>

							<Button
								theme={ButtonTheme.CLEAR}
								className={cls.cancelButton}
								onClick={handleClearSelection}
								aria-label='Отменить выбор'
							>
								<CancelSelection aria-hidden='true' />
							</Button>
						</div>
					</div>
				) : (
					<Button
						theme={ButtonTheme.CLEAR}
						className={cls.contactsTrash}
						onClick={handleEnterSelectionMode}
						aria-label='Режим выбора контактов'
					>
						<Text type={TextType.TEXT} tag={TextTag.SPAN} fontSize={TextSize.S}>
							Контакты пользователей А-чата
						</Text>
						<Trash className={cls.icon} aria-hidden='true' />
					</Button>
				)}

				{statusFlags.isEmpty ? (
					<div className={cls.empty} role='status' aria-live='polite'>
						<EmptyContacts />
					</div>
				) : (
					<ContactsListContent
						contacts={displayContacts}
						selectedContactUid={selectedContactUid}
						onSelectContact={onSelectContact}
						isSelectionMode={isSelectionMode}
						selectedContacts={selectedContacts}
						onToggleSelection={handleToggleSelection}
					/>
				)}

				{/* 🔹 MODAL: Подтверждение удаления */}
				{isDeleteModalOpen && (
					<Modal
						isOpen={isDeleteModalOpen}
						onClose={handleCloseDeleteModal}
						closeButton={false}
						size='wide'
						className={cls.deleteModal}
						aria-labelledby='delete-modal-title'
					>
						<div className={cls.modalContent}>
							<div className={cls.modalInfo}>
								<Text
									type={TextType.TITLE}
									tag={TitleTag.H3}
									fontSize={TextSize.L}
									className={cls.modalTitle}
								>
									Удалить контакты
								</Text>
								<Text
									type={TextType.TEXT}
									tag={TextTag.P}
									fontSize={TextSize.S}
									color={TextColor.BLACK}
									className={cls.modalText}
								>
									Вы уверены, что хотите удалить {selectedCount}{' '}
									{getContactWordForm(selectedCount)}?
								</Text>
							</div>

							<div className={cls.modalActions}>
								<Button
									theme={ButtonTheme.BACKGROUND}
									color={ButtonColor.TRANSPARENT}
									size={ButtonSize.M}
									className={cls.modalCancel}
									onClick={handleCloseDeleteModal}
								>
									<Text
										type={TextType.TEXT}
										tag={TextTag.P}
										fontSize={TextSize.S}
										color={TextColor.BLACK}
									>
										Отмена
									</Text>
								</Button>
								<Button
									theme={ButtonTheme.BACKGROUND}
									color={ButtonColor.PRIMARY}
									size={ButtonSize.M}
									className={cls.modalDelete}
									onClick={handleConfirmDelete}
								>
									Удалить
								</Button>
							</div>
						</div>
					</Modal>
				)}
			</div>
		);
	}
);

// ─────────────────────────────────────────────────────────────
// 🔹 HELPER: Склонение слова "контакт"
// ─────────────────────────────────────────────────────────────
const getContactWordForm = (count: number): string => {
	if (count % 10 === 1 && count % 100 !== 11) {
		return 'контакт';
	}
	if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
		return 'контакта';
	}
	return 'контактов';
};

ContactsList.displayName = 'ContactsList';
