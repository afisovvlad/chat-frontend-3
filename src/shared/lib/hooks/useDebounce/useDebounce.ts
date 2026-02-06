import { useCallback, useEffect, useRef } from 'react';

export function useDebounce<Args extends unknown[]>(
	callback: (...args: Args) => void,
	delay: number
) {
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const savedCallback = useRef(callback);

	// Синхронизируем callback
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// ✅ Cleanup при unmount
	useEffect(() => {
		return () => {
			if (timer.current) {
				clearTimeout(timer.current);
			}
		};
	}, []);

	return useCallback(
		(...args: Args) => {
			if (timer.current) {
				clearTimeout(timer.current);
			}
			timer.current = setTimeout(() => savedCallback.current(...args), delay);
		},
		[delay]
	);
}
