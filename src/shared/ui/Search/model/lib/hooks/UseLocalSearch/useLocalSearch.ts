import { useState, useCallback, useMemo, useEffect } from 'react';
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

	// ✅ Мемоизируем результаты для предотвращения лишних ререндеров
	const memoizedFilteredData = useMemo(() => filteredData, [filteredData]);

	// Дебаунсированный колбэк для фильтрации
	const debouncedFilter = useDebounce((term: string) => {
		if (term.length === 0) {
			setFilteredData(data);
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

	// ✅ Мемоизируем возвращаемый объект для предотвращения лишних ререндеров
	return useMemo(
		() => ({
			searchTerm,
			filteredData: memoizedFilteredData,
			handleSearchChange,
			handleClear
		}),
		[searchTerm, memoizedFilteredData, handleSearchChange, handleClear]
	);
}
