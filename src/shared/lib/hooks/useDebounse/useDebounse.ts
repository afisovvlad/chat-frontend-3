import { useEffect, useState } from 'react';

interface UseDebounceProps<T> {
	value: T;
	delay: number;
}

export const useDebounce = (value, delay = 200) => {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => setDebounced(value), delay); // Добавляем значение в debounced с задержкой в 300 ms
		return () => clearTimeout(handler);
	}, [value, delay]);

	return debounced;
};
