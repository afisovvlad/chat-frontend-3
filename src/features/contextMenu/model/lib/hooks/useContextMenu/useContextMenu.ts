'use client';
import { KebabMenuItem } from '@/shared/ui/KebabMenu/model/types/type';
import { useCallback, useEffect, useState } from 'react';

interface ContextMenuState {
	isVisible: boolean;
	position: { x: number; y: number } | null;
	items: KebabMenuItem[];
}

export const useContextMenu = () => {
	const [state, setState] = useState<ContextMenuState>({
		isVisible: false,
		position: null,
		items: []
	});

	const showMenu = useCallback(
		(items: KebabMenuItem[], x: number, y: number) => {
			setState({ isVisible: true, position: { x, y }, items });
		},
		[]
	);

	const hideMenu = useCallback(() => {
		setState({ isVisible: false, position: null, items: [] });
	}, []);

	const handleContextMenu = useCallback(
		(e: React.MouseEvent, items: KebabMenuItem[]) => {
			e.preventDefault();
			e.stopPropagation();

			showMenu(items, e.clientX, e.clientY);
		},
		[showMenu]
	);

	// Закрытие по клику вне
	useEffect(() => {
		const handleClick = () => {
			if (state.isVisible) {
				hideMenu();
			}
		};
		document.addEventListener('click', handleClick);
		return () => document.removeEventListener('click', handleClick);
	}, [hideMenu, state.isVisible]);

	return { ...state, handleContextMenu, hideMenu };
};
