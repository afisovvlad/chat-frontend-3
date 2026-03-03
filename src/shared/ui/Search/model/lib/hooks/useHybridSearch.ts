import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';

/**
 * Хук для гибридного поиска (локальный + глобальный через бэкенд)
 *
 * @param localData - Локальные данные для фильтрации
 * @param localFilterFn - Функция локальной фильтрации
 * @param globalSearchFn - Функция глобального поиска через бэкенд
 * @param debounceDelay - Задержка дебаунса (мс)
 * @param globalPrefix - Префикс для глобального поиска (по умолчанию '@')
 *
 * @returns Объект с состоянием и обработчиками
 *
 * @example
 * const { searchTerm, results, isGlobal, isLoading, error, handleSearchChange, handleClear } = useHybridSearch(
 *   contacts,                              // Локальные данные
 *   filterContacts,                        // Локальный фильтр
 *   async (term) => {                      // Глобальный поиск
 *     const response = await api.searchContacts(term);
 *     return response.data;
 *   },
 *   300,
 *   '@'
 * );
 */
export function useHybridSearch<T>(
	localData: T[],
	localFilterFn: (items: T[], searchTerm: string) => T[],
	globalSearchFn: (searchTerm: string) => Promise<T[]>,
	debounceDelay: number = 300,
	globalPrefix: string = '@'
) {
	const [searchTerm, setSearchTerm] = useState('');
	const [results, setResults] = useState<T[]>([]);
	const [isGlobal, setIsGlobal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	// ✅ Мемоизируем результаты для предотвращения лишних ререндеров
	const memoizedResults = useMemo(() => results, [results]);

	// Дебаунсированный локальный поиск
	const debouncedLocalSearch = useDebounce((term: string) => {
		if (term.length === 0) {
			setResults(localData);
			return;
		}
		const filtered = localFilterFn(localData, term);
		setResults(filtered);
	}, debounceDelay);

	// Дебаунсированный глобальный поиск
	const debouncedGlobalSearch = useDebounce(async (term: string) => {
		if (term.length === 0) {
			setResults([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const data = await globalSearchFn(term);
			setResults(data);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Search failed'));
		} finally {
			setIsLoading(false);
		}
	}, debounceDelay);

	// Определяем тип поиска (локальный или глобальный)
	const isGlobalSearch = useCallback(
		(term: string): boolean => {
			return term.trim().startsWith(globalPrefix);
		},
		[globalPrefix]
	);

	// Обработчик изменения поиска
	const handleSearchChange = useCallback(
		(value: string) => {
			setSearchTerm(value);

			const trimmed = value.trim();

			if (trimmed.length === 0) {
				setResults([]);
				setIsGlobal(false);
				return;
			}

			// Определяем тип поиска
			const global = isGlobalSearch(trimmed);
			setIsGlobal(global);

			if (global) {
				// Глобальный поиск (через бэкенд)
				// Убираем префикс @
				const searchQuery = trimmed.slice(globalPrefix.length).trim();
				debouncedGlobalSearch(searchQuery);
			} else {
				// Локальный поиск (по уже загруженным данным)
				debouncedLocalSearch(trimmed);
			}
		},
		[isGlobalSearch, globalPrefix, debouncedLocalSearch, debouncedGlobalSearch]
	);

	// Обработчик очистки
	const handleClear = useCallback(() => {
		setSearchTerm('');
		setResults([]);
		setIsGlobal(false);
		setError(null);
	}, []);

	// ✅ Мемоизируем возвращаемый объект для предотвращения лишних ререндеров
	return useMemo(
		() => ({
			searchTerm,
			results: memoizedResults,
			isGlobal,
			isLoading,
			error,
			handleSearchChange,
			handleClear
		}),
		[
			searchTerm,
			memoizedResults,
			isGlobal,
			isLoading,
			error,
			handleSearchChange,
			handleClear
		]
	);
}
