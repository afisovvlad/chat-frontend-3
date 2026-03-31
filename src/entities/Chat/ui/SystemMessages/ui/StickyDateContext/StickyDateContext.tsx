'use client';

import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useRef,
	useEffect
} from 'react';
import StickyDateHeader from '../StickyDateHeader/StickyDateHeader';
import cls from './StickyDateContext.module.scss';

interface SeparatorInfo {
	id: string;
	date: Date;
	element: HTMLElement;
}

interface StickyDateContextValue {
	registerSeparator: (id: string, date: Date, element: HTMLElement) => void;
	unregisterSeparator: (id: string) => void;
	activeDate: Date | null;
	isActive: (id: string) => boolean;
	isHidden: (id: string) => boolean;
	isAtBottom: boolean;
}

const StickyDateContext = createContext<StickyDateContextValue | undefined>(
	undefined
);

const STICKY_OFFSET_TOP = 10;
const STICKY_TOLERANCE = 20;
const SCROLL_THRESHOLD_BOTTOM = 50;

export const StickyDateProvider: React.FC<{
	children: React.ReactNode;
	containerRef?: React.RefObject<HTMLDivElement>;
}> = ({ children, containerRef: externalContainerRef }) => {
	const [activeDate, setActiveDate] = useState<Date | null>(null);
	const [activeSeparatorId, setActiveSeparatorId] = useState<string | null>(
		null
	);
	const [isAtBottom, setIsAtBottom] = useState(true);

	const separatorsRef = useRef<Map<string, SeparatorInfo>>(new Map());
	const internalContainerRef = useRef<HTMLDivElement>(null);
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const [hiddenSeparatorIds, setHiddenSeparatorIds] = useState<Set<string>>(
		new Set()
	);

	// Рефы для отслеживания предыдущих значений (чтобы не спамить рендерами)
	const prevIsAtBottomRef = useRef(true);

	const containerRef = externalContainerRef || internalContainerRef;

	const registerSeparator = useCallback(
		(id: string, date: Date, element: HTMLElement) => {
			separatorsRef.current.set(id, { id, date, element });
		},
		[]
	);

	const unregisterSeparator = useCallback((id: string) => {
		separatorsRef.current.delete(id);
		setHiddenSeparatorIds(prev => {
			const next = new Set(prev);
			next.delete(id);
			return next;
		});
	}, []);

	const isActive = useCallback(
		(id: string) => id === activeSeparatorId,
		[activeSeparatorId]
	);
	const isHidden = useCallback(
		(id: string) => hiddenSeparatorIds.has(id),
		[hiddenSeparatorIds]
	);

	useEffect(() => {
		const scrollContainer = scrollContainerRef.current;
		if (!scrollContainer) {
			console.warn('[StickyDate] scrollContainer not found');
			return;
		}

		const findActiveSeparator = () => {
			if (separatorsRef.current.size === 0) {
				return null;
			}
			const containerRect = scrollContainer.getBoundingClientRect();
			const threshold = containerRect.top + STICKY_OFFSET_TOP;
			let bestMatch: SeparatorInfo | null = null;
			let maxTopBelowThreshold = -Infinity;
			const newHiddenSet = new Set<string>();

			for (const sep of separatorsRef.current.values()) {
				if (!sep.element.isConnected) {
					continue;
				}
				const rect = sep.element.getBoundingClientRect();
				if (
					rect.top <= threshold + STICKY_TOLERANCE &&
					rect.top > maxTopBelowThreshold
				) {
					maxTopBelowThreshold = rect.top;
					bestMatch = sep;
				}
				if (rect.bottom < threshold) {
					newHiddenSet.add(sep.id);
				}
			}

			setHiddenSeparatorIds(prev => {
				if (prev.size !== newHiddenSet.size) {
					return newHiddenSet;
				}
				for (const id of newHiddenSet) {
					if (!prev.has(id)) {
						return newHiddenSet;
					}
				}
				for (const id of prev) {
					if (!newHiddenSet.has(id)) {
						return newHiddenSet;
					}
				}
				return prev;
			});

			if (!bestMatch) {
				const first = Array.from(separatorsRef.current.values())
					.filter(s => s.element.isConnected)
					.sort(
						(a, b) =>
							a.element.getBoundingClientRect().top -
							b.element.getBoundingClientRect().top
					)[0];
				return first || null;
			}
			return bestMatch;
		};

		const handleScroll = () => {
			requestAnimationFrame(() => {
				const active = findActiveSeparator();
				if (active?.date) {
					setActiveDate(prev =>
						prev?.getTime() === active.date.getTime() ? prev : active.date
					);
				}
				if (active?.id) {
					setActiveSeparatorId(prev => (prev === active.id ? prev : active.id));
				}
			});

			const { scrollHeight, scrollTop, clientHeight } = scrollContainer;
			const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
			const isBottom = distanceFromBottom < SCROLL_THRESHOLD_BOTTOM;

			if (isBottom !== prevIsAtBottomRef.current) {
				prevIsAtBottomRef.current = isBottom;
				setIsAtBottom(isBottom);
			}
		};

		const initTimer = setTimeout(handleScroll, 100);

		scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			clearTimeout(initTimer);
			scrollContainer.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const value: StickyDateContextValue = {
		registerSeparator,
		unregisterSeparator,
		activeDate,
		isActive,
		isHidden,
		isAtBottom
	};

	return (
		<StickyDateContext.Provider value={value}>
			<div ref={containerRef} className={cls.stickyDateProvider}>
				<StickyDateHeader date={activeDate} isVisible={activeDate !== null} />
				<div ref={scrollContainerRef} className={cls.scrollContainer}>
					{children}
				</div>
			</div>
		</StickyDateContext.Provider>
	);
};

export const useStickyDate = () => {
	const context = useContext(StickyDateContext);
	if (!context) {
		throw new Error('useStickyDate must be used within StickyDateProvider');
	}
	return context;
};
