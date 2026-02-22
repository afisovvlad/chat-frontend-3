'use client';

import { memo, useState, useCallback, useMemo, useEffect } from 'react';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';
import { ChatListItem } from '../ChatListItem/ChatListItem';
import { Search } from '@/shared/ui/Search';
import { useGetChatsQuery } from '../../api/chatApi';
import { UserCardSkeleton } from '@/shared/ui/Skeleton';
import EmptyChats from '@/shared/ui/EmptyChats/EmptyChats';
import { UserCardType } from '@/shared/ui/UserCard';
import { Chat, GetChatsRequest } from '../../model/types/chat.types';
import cls from './ChatList.module.scss';

//  КОНФИГУРАЦИЯ

const GLOBAL_SEARCH_PREFIX = '@';
const DEBOUNCE_DELAY = 300;
const LOCAL_CACHE_SIZE = 100; // Сколько чатов кешируем для локального поиска
const GLOBAL_SEARCH_MIN_LENGTH = 3; // Мин. длина запроса для вызова API

//  Для тестов: раскомментируй и используй mockChats вместо cachedChats
import { mockChats } from '../../mock/mockData';

// ============================================================================
//  КОМПОНЕНТ
// ============================================================================

export interface ChatListProps {
	selectedChatUid?: string | null;
}

export const ChatList = memo(({ selectedChatUid }: ChatListProps) => {
	// ──────────────────────────────────────────────────────────────────────
	// 1. Состояние поиска
	// ──────────────────────────────────────────────────────────────────────
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');

	const debouncedSetQuery = useDebounce((value: string) => {
		setDebouncedQuery(value);
	}, DEBOUNCE_DELAY);

	useEffect(() => {
		debouncedSetQuery(searchQuery);
	}, [searchQuery, debouncedSetQuery]);

	// ──────────────────────────────────────────────────────────────────────
	// 2. Определение режима поиска
	// ──────────────────────────────────────────────────────────────────────
	const trimmedQuery = debouncedQuery.trim();
	const isGlobalMode = trimmedQuery.startsWith(GLOBAL_SEARCH_PREFIX);

	const searchValue = isGlobalMode
		? trimmedQuery.slice(GLOBAL_SEARCH_PREFIX.length).trim()
		: trimmedQuery;

	const shouldFetchGlobal =
		isGlobalMode && searchValue.length >= GLOBAL_SEARCH_MIN_LENGTH;

	// ──────────────────────────────────────────────────────────────────────
	// 3. API-запросы (RTK Query)
	// ──────────────────────────────────────────────────────────────────────

	// 🔹 Запрос #1: Глобальный поиск (только когда нужен)
	const {
		data: globalResponse,
		isLoading: isGlobalLoading,
		isFetching: isGlobalFetching,
		error: globalError
	} = useGetChatsQuery(
		{
			search: shouldFetchGlobal ? searchValue : undefined,
			pageSize: 50,
			ordering: '-last_activity_at' // Сортировка по последней активности
		} as GetChatsRequest,
		{
			skip: !shouldFetchGlobal // Не делаем запрос, если не нужно
		}
	);

	// 🔹 Запрос #2: Кеш для локального поиска (всегда загружает последние чаты)
	const { data: cacheResponse, isLoading: isCacheLoading } = useGetChatsQuery(
		{
			pageSize: LOCAL_CACHE_SIZE,
			ordering: '-last_activity_at'
		} as GetChatsRequest,
		{
			// В продакшене всегда грузим кеш; для тестов с моками можно пропустить
			skip: false // process.env.NODE_ENV === 'development' && USE_MOCKS
		}
	);

	// ──────────────────────────────────────────────────────────────────────
	// 4. Источники данных
	// ──────────────────────────────────────────────────────────────────────

	//  Mock data (только для разработки/тестов)
	const localChats = useMemo(() => mockChats, []);

	// Production: используем кеш от API
	// const localChats = useMemo(
	// 	() => cacheResponse?.results ?? [],
	// 	[cacheResponse]
	// );

	// ──────────────────────────────────────────────────────────────────────
	// 5. Локальная фильтрация (только в локальном режиме)
	// ──────────────────────────────────────────────────────────────────────
	const filteredLocalChats = useMemo(() => {
		// В глобальном режиме не фильтруем локально
		if (isGlobalMode) {
			return [];
		}

		// Пустой запрос = показываем все чаты из кеша
		if (!searchValue) {
			return localChats;
		}

		const query = searchValue.toLowerCase();

		return localChats.filter((chat: Chat) => {
			// Собираем все поля для поиска (с защитой от null/undefined)
			const fields: Array<string | undefined> = [
				chat.name,
				chat.chat?.username,
				chat.chat?.nickname,
				chat.chat?.first_name,
				chat.chat?.last_name,
				chat.chat?.patronymic,
				chat.last_message?.content
			];

			// Проверяем: хотя бы одно поле содержит подстроку (case-insensitive)
			return fields.some(
				field =>
					typeof field === 'string' && field.toLowerCase().includes(query)
			);
		});
	}, [isGlobalMode, searchValue, localChats]);

	// ──────────────────────────────────────────────────────────────────────
	// 6. Выбор результатов для отображения
	// ──────────────────────────────────────────────────────────────────────
	const displayChats = useMemo(() => {
		if (isGlobalMode) {
			// Глобальный режим: результаты от API (или пустой массив, если грузится)
			return globalResponse?.results ?? [];
		}
		// Локальный режим: отфильтрованные чаты из кеша
		return filteredLocalChats;
	}, [isGlobalMode, globalResponse, filteredLocalChats]);

	// ──────────────────────────────────────────────────────────────────────
	// 7. Флаги состояния для UX
	// ──────────────────────────────────────────────────────────────────────
	const isLoading = isCacheLoading && !searchQuery;
	const isSearching = isGlobalFetching && isGlobalMode && shouldFetchGlobal;
	const isEmpty = !isLoading && !isSearching && displayChats.length === 0;
	const hasError = !!globalError && isGlobalMode && shouldFetchGlobal;

	// ──────────────────────────────────────────────────────────────────────
	// 8. Обработчики событий
	// ──────────────────────────────────────────────────────────────────────
	const handleSearchChange = useCallback((value: string) => {
		setSearchQuery(value);
	}, []);

	const handleSearchClear = useCallback(() => {
		setSearchQuery('');
		setDebouncedQuery('');
	}, []);

	// ──────────────────────────────────────────────────────────────────────
	// 9. Рендер: Скелетон (загрузка)
	// ──────────────────────────────────────────────────────────────────────
	if (isLoading || (isSearching && !globalResponse)) {
		return (
			<div className={cls.chatList}>
				<div className={cls.search}>
					<Search
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder='Поиск чатов...'
						showIcon={true}
					/>
				</div>
				<div className={cls.list} role='listbox' aria-busy='true'>
					<UserCardSkeleton count={8} type={UserCardType.CHAT} />
				</div>
			</div>
		);
	}

	// ──────────────────────────────────────────────────────────────────────
	// 10. Рендер: Ошибка глобального поиска
	// ──────────────────────────────────────────────────────────────────────
	if (hasError) {
		return (
			<div className={cls.chatList}>
				<div className={cls.search}>
					<Search
						value={searchQuery}
						onChange={handleSearchChange}
						onClear={handleSearchClear}
						placeholder='Глобальный поиск (@имя)...'
						showIcon={true}
					/>
				</div>
				<div className={cls.empty} role='alert' aria-live='assertive'>
					<EmptyChats />
				</div>
			</div>
		);
	}

	// ──────────────────────────────────────────────────────────────────────
	// 11. Рендер: Основной контент
	// ──────────────────────────────────────────────────────────────────────
	return (
		<div className={cls.chatList} aria-label='Список чатов'>
			<div className={cls.search}>
				<Search
					value={searchQuery}
					onChange={handleSearchChange}
					onClear={handleSearchClear}
					placeholder={
						isGlobalMode ? 'Глобальный поиск (@username)...' : 'Поиск чатов...'
					}
					showIcon={true}
				/>
			</div>

			{isEmpty ? (
				<div className={cls.empty} role='status' aria-live='polite'>
					<EmptyChats />
				</div>
			) : (
				<div className={cls.list} role='listbox' aria-multiselectable='false'>
					{displayChats.map((chat: Chat) => (
						<ChatListItem
							key={chat.id}
							chat={chat}
							isActive={selectedChatUid === chat.chat.uid}
						/>
					))}
				</div>
			)}
		</div>
	);
});

ChatList.displayName = 'ChatList';
