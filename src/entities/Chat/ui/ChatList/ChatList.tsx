'use client';

import { memo, useMemo, useCallback } from 'react';
import { filterChatsLocal, Search, useHybridSearch } from '@/shared/ui/Search';
import { useGetChatsQuery, useLazyGetChatsQuery } from '../../api/chatApi';
import { UserCardSkeleton } from '@/shared/ui/Skeleton';
import { EmptyChats } from '@/shared/ui/EmptyChats/EmptyChats';
import { UserCardType } from '@/shared/ui/UserCard';
import { Chat, GetChatsRequest } from '../../model/types/chat.types';
import { sortChatsByLastMessage } from '../../model/lib/utils/sortChatsByLastMessage';
import { mockChats } from '../../mock/mockData';
import { appConfig } from '@/shared/config/app.config';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import { ChatListContent } from '../ChatListContent/ChatListContent';

import cls from './ChatList.module.scss';
import {
	Button,
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button';
import { CreateNew } from '@icons/index';

const LOCAL_CACHE_SIZE = 30;
const GLOBAL_SEARCH_MIN_LENGTH = 3;
const SEARCH_DEBOUNCE_MS = 300;
const GLOBAL_SEARCH_PREFIX = '@';

export interface ChatListProps {
	selectedChatUid?: string | null;
}

export const ChatList = memo(({ selectedChatUid }: ChatListProps) => {
	// ─────────────────────────────────────────────────────────────
	// 1. DATA FETCHING (RTK Query)
	// ─────────────────────────────────────────────────────────────
	const {
		data: cacheResponse,
		isLoading: isCacheLoading
		// isError: isCacheError,
		// error: cacheError,
		// refetch
	} = useGetChatsQuery({
		pageSize: LOCAL_CACHE_SIZE,
		ordering: '-last_activity_at'
	} as GetChatsRequest);

	const mobile = useMediaQuery();

	const [triggerGlobalSearch] = useLazyGetChatsQuery();

	// ─────────────────────────────────────────────────────────────
	// 2. DATA SOURCES & TRANSFORMATIONS
	// ─────────────────────────────────────────────────────────────
	const localChats = useMemo(() => {
		const source = appConfig.USE_MOCKS
			? mockChats
			: (cacheResponse?.results ?? []);

		// Dev-only logging (не попадёт в продакшен-бандл при правильной настройке)
		if (process.env.NODE_ENV === 'development' && appConfig.USE_MOCKS) {
			console.log('🧪 Using mock data (USE_MOCKS=true)');
		}

		return sortChatsByLastMessage(source);
	}, [cacheResponse]);

	// ─────────────────────────────────────────────────────────────
	// 3. GLOBAL SEARCH HANDLER
	// ─────────────────────────────────────────────────────────────

	const fetchGlobalChats = useCallback(
		async (searchTerm: string): Promise<Chat[]> => {
			try {
				const result = await triggerGlobalSearch({
					search: searchTerm,
					pageSize: 50,
					ordering: '-last_activity_at'
				} as GetChatsRequest).unwrap();

				return sortChatsByLastMessage(result?.results ?? []);
			} catch (error: unknown) {
				throw error;
			}
		},
		[triggerGlobalSearch]
	);

	// ─────────────────────────────────────────────────────────────
	// 4. HYBRID SEARCH HOOK
	// ─────────────────────────────────────────────────────────────
	const {
		searchTerm,
		results: displayChats,
		isGlobal,
		isLoading: isSearching,
		error: searchError,
		handleSearchChange,
		handleClear
	} = useHybridSearch<Chat>(
		localChats,
		filterChatsLocal,
		fetchGlobalChats,
		SEARCH_DEBOUNCE_MS,
		GLOBAL_SEARCH_PREFIX,
		GLOBAL_SEARCH_MIN_LENGTH
	);

	// ─────────────────────────────────────────────────────────────
	// 5. DERIVED STATE (мемоизированные флаги)
	// ─────────────────────────────────────────────────────────────
	const searchLength = useMemo(
		() => searchTerm.trim().replace(/^@/, '').length,
		[searchTerm]
	);

	const hasMinLength = searchLength >= GLOBAL_SEARCH_MIN_LENGTH;

	const statusFlags = useMemo(() => {
		const isInitialLoading = isCacheLoading && !cacheResponse;

		const isGlobalSearching = isSearching && isGlobal && hasMinLength;

		const shouldShowSkeleton =
			isInitialLoading || (isGlobalSearching && displayChats.length === 0);

		const isEmpty =
			!isCacheLoading && displayChats.length === 0 && !isGlobalSearching;

		const hasError = !!searchError && (isGlobal || !searchTerm);

		return {
			isLoading: isInitialLoading,
			shouldShowSkeleton,
			isEmpty,
			hasError
		};
	}, [
		isCacheLoading,
		cacheResponse, // 🔹 Добавили проверку на наличие ответа
		searchTerm,
		isSearching,
		isGlobal,
		hasMinLength,
		displayChats.length,
		searchError
	]);

	// ─────────────────────────────────────────────────────────────
	// 6. UI DERIVED VALUES
	// ─────────────────────────────────────────────────────────────
	const searchPlaceholder = useMemo(() => {
		if (isGlobal) {
			return 'Глобальный поиск (@username)...';
		}
		if (appConfig.USE_MOCKS) {
			return 'Поиск по мокам...';
		}
		return 'Поиск чатов...';
	}, [isGlobal]);

	// ─────────────────────────────────────────────────────────────
	// 7. RENDER: LOADING & ERROR STATES
	// ─────────────────────────────────────────────────────────────
	if (statusFlags.shouldShowSkeleton) {
		return (
			<div className={cls.chatList}>
				<div className={cls.search}>
					<Search
						value={searchTerm}
						onChange={handleSearchChange}
						placeholder='Поиск чатов...'
						showIcon
					/>
				</div>
				<div className={cls.list} role='listbox' aria-busy='true'>
					<UserCardSkeleton count={8} type={UserCardType.CHAT} />
				</div>
			</div>
		);
	}

	if (statusFlags.hasError) {
		return (
			<div className={cls.chatList}>
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
					<EmptyChats />
				</div>
			</div>
		);
	}

	// ─────────────────────────────────────────────────────────────
	// 8. RENDER: MAIN CONTENT
	// ─────────────────────────────────────────────────────────────
	return (
		<div className={cls.chatList} aria-label='Список чатов'>
			<div className={cls.search}>
				<Search
					value={searchTerm}
					onChange={handleSearchChange}
					onClear={handleClear}
					placeholder={searchPlaceholder}
					className={cls.searchInput}
					showIcon
				/>
				{mobile && (
					<Button
						theme={ButtonTheme.BACKGROUND}
						color={ButtonColor.TRANSPARENT}
						btnType={ButtonType.BUTTON}
						className={cls.addMenuBtn}
						onClick={() => console.log('Добавить меню с нужными функциями')}
					>
						<CreateNew className={cls.addMenuBtnIcon} />
					</Button>
				)}
			</div>

			{statusFlags.isEmpty ? (
				<div className={cls.empty} role='status' aria-live='polite'>
					<EmptyChats />
				</div>
			) : (
				<ChatListContent
					chats={displayChats}
					selectedChatUid={selectedChatUid}
				/>
			)}
		</div>
	);
});

ChatList.displayName = 'ChatList';
