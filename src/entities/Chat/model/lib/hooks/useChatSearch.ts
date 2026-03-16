import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';

interface UseChatSearchOptions {
	debounceDelay?: number;
}

export const useChatSearch = (options: UseChatSearchOptions = {}) => {
	const { debounceDelay = 300 } = options;
	const [searchQuery, setSearchQuery] = useState('');
	const [debouncedQuery, setDebouncedQuery] = useState('');

	const debouncedSetQuery = useDebounce((query: string) => {
		setDebouncedQuery(query);
	}, debounceDelay);

	useEffect(() => {
		debouncedSetQuery(searchQuery);
	}, [searchQuery, debouncedSetQuery]);

	const handleSearchChange = useCallback((value: string) => {
		setSearchQuery(value);
	}, []);

	const handleSearchClear = useCallback(() => {
		setSearchQuery('');
		setDebouncedQuery('');
	}, []);

	return {
		searchQuery,
		debouncedQuery,
		handleSearchChange,
		handleSearchClear
	} as const;
};
