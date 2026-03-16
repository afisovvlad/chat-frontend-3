import { RefObject, useEffect } from 'react';

export function useClickOutside<T extends HTMLElement>(
	ref: RefObject<T | null>,
	handler: () => void
) {
	useEffect(() => {
		function listener(event: PointerEvent) {
			if (!ref?.current || ref?.current.contains(event.target as Node)) {
				return;
			}

			handler();
		}

		document.addEventListener('pointerdown', listener);

		return () => {
			document.removeEventListener('pointerdown', listener);
		};
	}, [ref, handler]);
}
