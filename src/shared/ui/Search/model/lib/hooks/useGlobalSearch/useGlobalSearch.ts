import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';

/**
 * Хук для глобального поиска (через бэкенд)
 */
export function useGlobalSearch<T>(
	onSearch: (searchTerm: string) => Promise<T[]>,
	debounceDelay: number = 500
) {
	const [searchTerm, setSearchTerm] = useState('');
	const [results, setResults] = useState<T[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	// Мемоизируем результаты для предотвращения лишних ререндеров
	const memoizedResults = useMemo(() => results, [results]);

	// Дебаунсированный поиск
	const debouncedSearch = useDebounce(async (term: string) => {
		if (term.length === 0) {
			setResults([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const data = await onSearch(term);
			setResults(data);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Search failed'));
		} finally {
			setIsLoading(false);
		}
	}, debounceDelay);

	// Обработчик изменения поиска
	const handleSearchChange = useCallback(
		(value: string) => {
			setSearchTerm(value);
			debouncedSearch(value.trim());
		},
		[debouncedSearch]
	);

	// Обработчик очистки
	const handleClear = useCallback(() => {
		setSearchTerm('');
		setResults([]);
		setError(null);
	}, []);

	// Мемоизируем возвращаемый объект для предотвращения лишних ререндеров
	return useMemo(
		() => ({
			searchTerm,
			results: memoizedResults,
			isLoading,
			error,
			handleSearchChange,
			handleClear
		}),
		[
			searchTerm,
			memoizedResults,
			isLoading,
			error,
			handleSearchChange,
			handleClear
		]
	);
}
