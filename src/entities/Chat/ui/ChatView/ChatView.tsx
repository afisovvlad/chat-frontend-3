'use client';

import { useCallback, useRef, useState } from 'react';
import { ChatHeader, MessagesList } from '@/entities/Chat';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import { classNames } from '@/shared/lib/classNames/classNames';
import { UserCardSkeleton } from '@/shared/ui/Skeleton';
import { UserCardType } from '@/shared/ui/UserCard';
import { NotMessage } from '@/shared/ui/NotMessage/NotMessage';
import { MessageFormComponent } from '../ChatBottom';
import { useChatViewData } from '../../model/lib/hooks/useChatViewData/useChatViewData';
import { useChatSearch } from '../../model/lib/hooks/useChatSearch/useChatSearch';
import { useChatHeaderProps } from '../../model/lib/hooks/useChatHeaderProps/useChatHeaderProps';

import cls from './ChatView.module.scss';
import { useMessageNavigation } from '../../model/lib/hooks/useMessageNavigation/useMessageNavigation';

interface ChatViewProps {
	chatUid: string;
	onBack?: () => void;
	userDataFromSearch?: {
		userName: string;
		avatar?: string;
		isOnline?: boolean;
	};
}

export const ChatView = ({
	chatUid,
	userDataFromSearch,
	onBack
}: ChatViewProps) => {
	// ─────────────────────────────────────────────────────────────

	const isMobile = useMediaQuery();
	const [isActionBarVisible, setIsActionBarVisible] = useState(true);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	// ─────────────────────────────────────────────────────────────

	const {
		messages,
		headerData,
		hasMessages,
		isLoading,
		hasError,
		isForbidden
	} = useChatViewData({ chatUid, userDataFromSearch });

	// ─────────────────────────────────────────────────────────────

	const {
		searchQuery,
		isSearchVisible,
		onSearchQueryChange,
		onSearchToggle,
		activeResultId,
		searchResultsCount,
		activeResultIndex,
		navigateToNext,
		navigateToPrev,
		getActiveOccurrencesForMessage
	} = useChatSearch(messages);

	const { navigateToMessage } = useMessageNavigation({
		scrollContainerRef,
		activeClass: cls.messageBubble_active
	});

	// ─────────────────────────────────────────────────────────────

	const handleScrollContainerReady = useCallback(
		(container: HTMLDivElement | null) => {
			scrollContainerRef.current = container;
		},
		[]
	);

	const handleBack = useCallback(() => {
		if (onBack) {
			onBack();
		} else {
			window.history.back();
		}
	}, [onBack]);

	const handleCall = useCallback(() => {}, []);
	const handleAddToContacts = useCallback(() => {}, []);
	const handleBlock = useCallback(() => {}, []);

	// ─────────────────────────────────────────────────────────────

	const headerProps = useChatHeaderProps({
		userData: headerData,
		isMobile,
		handlers: {
			onCall: handleCall,
			onAddToContacts: handleAddToContacts,
			onBlock: handleBlock,
			onBack: handleBack,
			handleBack
		},
		setters: { onActionBarVisibilityChange: setIsActionBarVisible },
		search: {
			query: searchQuery,
			onQueryChange: onSearchQueryChange,
			isVisible: isSearchVisible,
			onToggle: onSearchToggle,
			resultsCount: searchResultsCount,
			activeIndex: activeResultIndex,
			activeId: activeResultId,
			navigateNext: navigateToNext,
			navigatePrev: navigateToPrev
		},
		onNavigateToMessage: navigateToMessage
	});

	// ─────────────────────────────────────────────────────────────

	if (isLoading && !isForbidden) {
		return (
			<section className={cls.chatView}>
				<UserCardSkeleton count={1} type={UserCardType.CONTACT} />
			</section>
		);
	}
	if (hasError) {
		return (
			<section className={cls.chatView}>
				<div className={cls.notMessageWrapper}>
					<NotMessage />
				</div>
			</section>
		);
	}

	const messagesClass = classNames(cls.messagesContent, {
		[cls.messagesContent_noRadius]: isMobile && isActionBarVisible
	});

	// ─────────────────────────────────────────────────────────────
	return (
		<section className={cls.chatView}>
			<ChatHeader {...headerProps} />

			{hasMessages ? (
				<>
					<MessagesList
						userUid={chatUid}
						className={messagesClass}
						activeResultId={activeResultId}
						searchQuery={searchQuery}
						onScrollContainerReady={handleScrollContainerReady}
						getActiveOccurrencesForMessage={getActiveOccurrencesForMessage}
					/>
					<MessageFormComponent />
				</>
			) : (
				<>
					<div className={cls.notMessageWrapper}>
						<NotMessage />
					</div>
					<MessageFormComponent />
				</>
			)}
		</section>
	);
};

ChatView.displayName = 'ChatView';
