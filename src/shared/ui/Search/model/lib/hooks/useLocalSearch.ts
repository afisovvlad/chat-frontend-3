import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';

/**
 * Хук для локального поиска (фильтрация уже загруженного массива)
 */
export function useLocalSearch<T>(
	data: T[],
	filterFn: (items: T[], searchTerm: string) => T[],
	debounceDelay: number = 300
) {
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredData, setFilteredData] = useState<T[]>([]);

	// Дебаунсированный колбэк для фильтрации
	const debouncedFilter = useDebounce((term: string) => {
		if (term.length === 0) {
			setFilteredData([]);
			return;
		}
		const results = filterFn(data, term);
		setFilteredData(results);
	}, debounceDelay);

	// При изменении поискового запроса - запускаем фильтрацию
	useEffect(() => {
		debouncedFilter(searchTerm.trim());
	}, [searchTerm, debouncedFilter]);

	// Обработчик изменения поиска
	const handleSearchChange = useCallback((value: string) => {
		setSearchTerm(value);
	}, []);

	// Обработчик очистки
	const handleClear = useCallback(() => {
		setSearchTerm('');
		setFilteredData([]);
	}, []);

	return {
		searchTerm,
		filteredData,
		handleSearchChange,
		handleClear
	} as const;
}
