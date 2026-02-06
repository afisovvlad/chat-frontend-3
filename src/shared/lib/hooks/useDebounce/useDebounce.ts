import { useCallback, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<Args extends any[]>(
	callback: (...args: Args) => void,
	delay: number
) {
	const timer = useRef<NodeJS.Timeout | null>(null);

	return useCallback(
		(...args: Args) => {
			if (timer.current) {
				clearTimeout(timer.current);
			}

			timer.current = setTimeout(() => {
				callback(...args);
			}, delay);
		},
		[callback, delay]
	);
}

// пример использования
// const debouncedFetchData = useDebounce(fetchData, 500);
