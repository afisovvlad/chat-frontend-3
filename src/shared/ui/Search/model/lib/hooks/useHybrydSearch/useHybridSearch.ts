import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';

export function useHybridSearch<T>(
	localData: T[],
	localFilterFn: (items: T[], searchTerm: string) => T[],
	globalSearchFn: (searchTerm: string, signal?: AbortSignal) => Promise<T[]>,
	debounceDelay: number = 300,
	globalPrefix: string = '@',
	globalMinLength: number = 3
) {
	const [searchTerm, setSearchTerm] = useState('');
	const [globalResults, setGlobalResults] = useState<T[]>([]);
	// ❌ УДАЛЕНО: const [localResults, setLocalResults] = useState<T[]>([]);

	const [isGlobal, setIsGlobal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	// ❌ УДАЛЕНО: const hasInitializedRef = useRef(false);

	const abortControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	// 🔥 НОВОЕ: localResults вычисляется через useMemo — всегда в синке с localData!
	const localResults = useMemo(() => {
		if (!searchTerm.trim()) {
			return localData;
		}
		return localFilterFn(localData, searchTerm);
	}, [localData, searchTerm, localFilterFn]);

	//  Дебаунсированный локальный поиск
	const debouncedLocalSearch = useDebounce((term: string) => {
		// localResults теперь вычисляется автоматически через useMemo,
		// поэтому здесь не нужно вручную вызывать setLocalResults
		// Оставляем пустым для совместимости с debounce-логикой
	}, debounceDelay);

	// 🔥 Дебаунсированный глобальный поиск (ПОЛНАЯ ВЕРСИЯ)
	const debouncedGlobalSearch = useDebounce(async (term: string) => {
		// Отменяем предыдущий запрос
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		const controller = new AbortController();
		abortControllerRef.current = controller;

		// Проверка минимальной длины запроса
		if (term.length === 0 || term.length < globalMinLength) {
			setGlobalResults([]);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const data = await globalSearchFn(term, controller.signal);
			setGlobalResults(data);
		} catch (err) {
			// Игнорируем ошибку отмены запроса
			if (err instanceof DOMException && err.name === 'AbortError') {
				return;
			}
			setError(err instanceof Error ? err : new Error('Search failed'));
		} finally {
			if (!controller.signal.aborted) {
				setIsLoading(false);
			}
		}
	}, debounceDelay);

	// Определяем, является ли поиск глобальным
	const isGlobalSearch = useCallback(
		(term: string): boolean => term.trim().startsWith(globalPrefix),
		[globalPrefix]
	);

	// Обработчик изменения поискового запроса
	const handleSearchChange = useCallback(
		(value: string) => {
			setSearchTerm(value);
			const trimmed = value.trim();

			if (trimmed.length === 0) {
				setGlobalResults([]);
				setIsGlobal(false);
				setError(null);
				return;
			}

			const global = isGlobalSearch(trimmed);
			setIsGlobal(global);

			if (global) {
				const searchQuery = trimmed.slice(globalPrefix.length).trim();

				// Ранняя проверка: не запускаем запрос, если длина меньше минимума
				if (!searchQuery || searchQuery.length < globalMinLength) {
					setGlobalResults([]);
					setIsLoading(false);
					return;
				}

				// 🔥 Теперь debouncedGlobalSearch определён — ошибки не будет
				debouncedGlobalSearch(searchQuery);
			} else {
				debouncedLocalSearch(trimmed);
			}
		},
		[
			isGlobalSearch,
			globalPrefix,
			globalMinLength,
			debouncedLocalSearch,
			debouncedGlobalSearch
		]
	);

	// Обработчик очистки
	const handleClear = useCallback(() => {
		setSearchTerm('');
		setGlobalResults([]);
		setIsGlobal(false);
		setError(null);
		// ❌ УДАЛЕНО: hasInitializedRef.current = false;

		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
	}, []);

	// Объединённые результаты
	const combinedResults = useMemo(() => {
		if (isGlobal) {
			return globalResults;
		}
		return localResults; // 👈 Теперь это вычисляемое значение
	}, [isGlobal, globalResults, localResults]);

	// Возвращаемый объект
	return useMemo(
		() => ({
			searchTerm,
			globalResults,
			localResults,
			results: combinedResults,
			isGlobal,
			isLoading,
			error,
			handleSearchChange,
			handleClear,
			setGlobalResults
			// ❌ УДАЛЕНО из return: setLocalResults (больше не нужен)
		}),
		[
			searchTerm,
			globalResults,
			localResults,
			combinedResults,
			isGlobal,
			isLoading,
			error,
			handleSearchChange,
			handleClear
		]
	);
}

export type UseHybridSearchReturn<T> = ReturnType<typeof useHybridSearch<T>>;
