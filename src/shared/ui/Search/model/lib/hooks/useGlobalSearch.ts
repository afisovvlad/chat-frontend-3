import { useState, useCallback } from 'react';
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

	return {
		searchTerm,
		results,
		isLoading,
		error,
		handleSearchChange,
		handleClear
	} as const;
}
