import { useState, useCallback } from 'react';

export const useContactSelection = () => {
	const [isSelectionMode, setIsSelectionMode] = useState(false);
	const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
		new Set()
	);

	const toggle = useCallback((uid: string) => {
		setSelectedContacts(prev => {
			const next = new Set(prev);
			if (next.has(uid)) {
				next.delete(uid);
			} else {
				next.add(uid);
			}
			return next;
		});
	}, []);

	const reset = useCallback(() => {
		setSelectedContacts(new Set());
	}, []);

	const clear = useCallback(() => {
		reset();
		setIsSelectionMode(false);
	}, [reset]);

	const enter = useCallback(() => {
		setIsSelectionMode(true);
		reset();
	}, [reset]);

	return {
		isSelectionMode,
		selected: selectedContacts,
		count: selectedContacts.size,
		handlers: { toggle, reset, clear, enter }
	};
};
