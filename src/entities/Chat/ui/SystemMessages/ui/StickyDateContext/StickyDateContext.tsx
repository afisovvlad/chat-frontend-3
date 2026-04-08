'use client';

import React, {
	createContext,
	useContext,
	useRef,
	useEffect,
	useCallback
} from 'react';
import StickyDateHeader from '../StickyDateHeader/StickyDateHeader';
import { useStickyDate } from '@/entities/Chat/model/lib/hooks/useStickyDate/useStickyDate';

import cls from './StickyDateContext.module.scss';

interface StickyDateContextValue {
	activeDate: Date | null;
	registerSeparator: (id: string, date: Date, element: HTMLElement) => void;
	unregisterSeparator: (id: string) => void;
	isActive: (id: string) => boolean;
	isHidden: (id: string) => boolean;
}

const StickyDateContext = createContext<StickyDateContextValue | undefined>(
	undefined
);

export const StickyDateProvider: React.FC<{
	children: React.ReactNode;
	containerRef?: React.RefObject<HTMLDivElement>;
	onScrollContainerReady?: (container: HTMLDivElement | null) => void;
}> = ({
	children,
	containerRef: externalContainerRef,
	onScrollContainerReady
}) => {
	const internalContainerRef = useRef<HTMLDivElement>(null);
	const containerRef = externalContainerRef || internalContainerRef;
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const { activeDate, register, unregister, isActive, isHidden } =
		useStickyDate({
			containerRef: scrollContainerRef,
			offsetTop: 10,
			tolerance: 20
		});

	useEffect(() => {
		if (onScrollContainerReady && scrollContainerRef.current) {
			onScrollContainerReady(scrollContainerRef.current);
		}
	}, [onScrollContainerReady]);

	const handleScrollContainerRef = useCallback(
		(node: HTMLDivElement | null) => {
			scrollContainerRef.current = node;
		},
		[]
	);

	const value: StickyDateContextValue = {
		activeDate,
		registerSeparator: register,
		unregisterSeparator: unregister,
		isActive,
		isHidden
	};

	return (
		<StickyDateContext.Provider value={value}>
			<div ref={containerRef} className={cls.stickyDateProvider}>
				<StickyDateHeader date={activeDate} isVisible={activeDate !== null} />

				<div
					ref={handleScrollContainerRef}
					className={cls.scrollContainer}
					data-scroll-container
				>
					{children}
				</div>
			</div>
		</StickyDateContext.Provider>
	);
};

export const useStickyDateContext = () => {
	const context = useContext(StickyDateContext);
	if (!context) {
		throw new Error(
			'useStickyDateContext must be used within StickyDateProvider'
		);
	}
	return context;
};
