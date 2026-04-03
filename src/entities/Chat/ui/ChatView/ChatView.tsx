'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChatHeader, MessagesList } from '@/entities/Chat';

import { useChatHeaderData } from '@/entities/Chat/model/lib/hooks/useChatHeaderData/useChatHeaderData';
import {
	selectChatByUid,
	useGetMessagesQuery
} from '@/entities/Chat/api/chatApi';
import { UserCardSkeleton } from '@/shared/ui/Skeleton';
import { UserCardType } from '@/shared/ui/UserCard';
import { NotMessage } from '@/shared/ui/NotMessage/NotMessage';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import { classNames } from '@/shared/lib/classNames/classNames';
import { RootState } from '@/app/providers/StoreProvider';
import {
	Chat,
	ChatMessage,
	Message,
	MessageStatus,
	MessageType
} from '../../model/types/chat.types/chat.types';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { MessageFormComponent } from '../ChatBottom';
import { useMessageSearch } from '../../model/lib/hooks/useMessageSearch/useMessageSearch';

import cls from './ChatView.module.scss';

interface ChatViewProps {
	chatUid: string;
	onBack?: () => void;
	userDataFromSearch?: {
		userName: string;
		avatar?: string;
		isOnline?: boolean;
	};
}

const MESSAGES_PAGE_SIZE = 50;
const MESSAGES_ORDERING = '-created_at';

export const ChatView = ({
	chatUid,
	userDataFromSearch,
	onBack
}: ChatViewProps) => {
	const isMobile = useMediaQuery();
	const [isActionBarVisible, setIsActionBarVisible] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [isSearchVisible, setIsSearchVisible] = useState(false);

	const scrollContainerRef = useRef<HTMLDivElement | null>(null);
	const messagesContainerRef = useRef<HTMLDivElement | null>(null);

	// ─────────────────────────────────────────────────────────────

	const handleContainerReady = useCallback(
		(container: HTMLDivElement | null) => {
			const scrollContainer = container?.querySelector(
				'.messages'
			) as HTMLDivElement;
			messagesContainerRef.current = scrollContainer || container;
		},
		[]
	);

	const handleScrollContainerReady = useCallback(
		(container: HTMLDivElement | null) => {
			scrollContainerRef.current = container;
		},
		[]
	);

	const handleNavigateToMessage = useCallback((messageId: string) => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				const messageElement = document.querySelector(
					`[data-message-id="${messageId}"]`
				);

				const container = scrollContainerRef.current;

				if (messageElement && container) {
					messageElement.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
						inline: 'nearest'
					});

					messageElement.classList.add(cls.messageBubble_active);
					setTimeout(() => {
						messageElement.classList.remove(cls.messageBubble_active);
					}, 2500);

					if (messageElement instanceof HTMLElement) {
						messageElement.setAttribute('tabindex', '-1');
						messageElement.focus({ preventScroll: true });
					}
				} else {
					console.warn('[ChatView] Scroll failed:', {
						hasElement: !!messageElement,
						hasContainer: !!container,
						messageId
					});
				}
			});
		});
	}, []);

	const chatDataFromCache = useSelector((state: RootState) =>
		selectChatByUid(state, chatUid)
	);

	// ─────────────────────────────────────────────────────────────

	const {
		data: messagesResponse,
		isLoading: isMessagesLoading,
		isError: isMessagesError,
		error: messagesError
	} = useGetMessagesQuery(
		{
			user_uid: chatUid,
			page_size: MESSAGES_PAGE_SIZE,
			ordering: MESSAGES_ORDERING
		},
		{
			skip: !chatUid
		}
	);

	const isForbidden = (messagesError as FetchBaseQueryError)?.status === 403;
	const hasRealError = isMessagesError && !isForbidden;

	const messages = useMemo<ChatMessage[]>(() => {
		if (isForbidden) {
			return [];
		}
		return messagesResponse?.results ?? [];
	}, [messagesResponse, isForbidden]);

	// ─────────────────────────────────────────────────────────────

	const chatData = useMemo<Chat | null>(() => {
		return chatDataFromCache ?? null;
	}, [chatDataFromCache]);

	// ─────────────────────────────────────────────────────────────

	const { headerData, hasMessages } = useChatHeaderData(chatData);

	const getPreviewData = (uid: string | undefined) => {
		if (!uid) {
			return {};
		}

		const localStorageKey = `chat_preview_${uid}`;
		const sessionStorageKey = `chat_preview_data_${uid}`;

		try {
			const sessionRaw = sessionStorage.getItem(sessionStorageKey);
			if (sessionRaw) {
				return JSON.parse(sessionRaw) as {
					userName?: string;
					avatar?: string;
					isOnline?: boolean;
				};
			}

			const localRaw = localStorage.getItem(localStorageKey);
			if (localRaw) {
				const parsed = JSON.parse(localRaw) as {
					userName?: string;
					avatar?: string;
					isOnline?: boolean;
				};

				try {
					sessionStorage.setItem(sessionStorageKey, localRaw);
					localStorage.removeItem(localStorageKey);
				} catch (saveError) {
					console.error('Preview save error:', saveError);
				}
				return parsed;
			}
		} catch (e) {
			console.error('Preview parse error:', e);
		}
		return {};
	};

	const safeHeaderData = useMemo(() => {
		const preview = chatUid ? getPreviewData(chatUid) : {};

		const baseData = {
			userName:
				userDataFromSearch?.userName ??
				preview?.userName ??
				headerData?.userName ??
				'Неизвестный пользователь',

			userStatus: headerData?.userStatus ?? 'был(а) давно',

			userAvatar:
				userDataFromSearch?.avatar ?? preview?.avatar ?? headerData?.userAvatar,

			isOnline:
				userDataFromSearch?.isOnline ??
				preview?.isOnline ??
				headerData?.isOnline ??
				false,

			isInContacts: headerData?.isInContacts ?? false
		};

		const contactData = {
			contactPhone: chatData?.chat?.username?.startsWith('+')
				? chatData.chat.username
				: undefined,
			contactFirstName: chatData?.chat?.first_name,
			contactLastName: chatData?.chat?.last_name
		};

		return { ...baseData, ...contactData };
	}, [headerData, chatData, userDataFromSearch, chatUid]);

	// ─────────────────────────────────────────────────────────────

	const handleBack = useCallback(() => {
		if (onBack) {
			onBack();
		} else {
			window.history.back();
		}
	}, [onBack]);

	const searchMessages = useMemo((): Message[] => {
		return messages.map(msg => ({
			id: String(msg.id),

			type: MessageType.TEXT as MessageType.TEXT,

			content: msg.content || '',
			senderId: String(msg.from_user),
			senderName: '',

			status: MessageStatus.RECEIVED as MessageStatus,

			createdAt: msg.created_at,
			updatedAt: msg.updated_at,
			has_replied_message: msg.has_replied_message || false,
			has_forwarded_message: msg.has_forwarded_message || false,

			isEdited: false,
			replyTo: undefined,
			forwardedFrom: undefined,
			files_summary: msg.files_summary,
			new: msg.new
		}));
	}, [messages]);

	const {
		activeResultId,
		searchResultsCount,
		activeResultIndex,
		navigateToNext,
		navigateToPrev,
		getActiveOccurrencesForMessage
	} = useMessageSearch({
		messages: searchMessages,
		searchQuery,
		caseSensitive: false,
		searchInSender: true,
		searchInSystemText: false,
		debounceDelay: 300
	});

	const handleCall = useCallback(() => {
		console.log('📞 Call initiated for chat:', chatUid);
	}, [chatUid]);

	const handleAddToContacts = useCallback(() => {
		console.log('👤 Add to contacts:', chatUid);
	}, [chatUid]);

	const handleBlock = useCallback(() => {
		console.log('🚫 Block user:', chatUid);
	}, [chatUid]);

	// ─────────────────────────────────────────────────────────────

	if (isMessagesLoading && !chatData && messages.length === 0 && !isForbidden) {
		return (
			<section className={cls.chatView}>
				<UserCardSkeleton count={1} type={UserCardType.CONTACT} />
			</section>
		);
	}

	// ─────────────────────────────────────────────────────────────

	if (hasRealError && !chatData) {
		return (
			<section className={cls.chatView}>
				<div className={cls.notMessageWrapper}>
					<NotMessage />
				</div>
			</section>
		);
	}

	// ─────────────────────────────────────────────────────────────

	if (!chatData || isForbidden) {
		return (
			<section className={cls.chatView}>
				<ChatHeader
					userName={safeHeaderData.userName}
					userStatus={safeHeaderData.userStatus}
					userAvatar={safeHeaderData.userAvatar}
					isOnline={safeHeaderData.isOnline}
					isInContacts={safeHeaderData.isInContacts}
					contactPhone={safeHeaderData.contactPhone}
					contactFirstName={safeHeaderData.contactFirstName}
					contactLastName={safeHeaderData.contactLastName}
					onCall={handleCall}
					onAddToContacts={handleAddToContacts}
					onBlock={handleBlock}
					onBack={isMobile ? handleBack : undefined}
					onActionBarVisibilityChange={setIsActionBarVisible}
					messages={messages}
					onNavigateToMessage={handleNavigateToMessage}
					searchQuery={searchQuery}
					onSearchQueryChange={setSearchQuery}
					isSearchVisible={isSearchVisible}
					onSearchToggle={() => setIsSearchVisible(!isSearchVisible)}
					searchResultsCount={searchResultsCount}
					activeResultIndex={activeResultIndex}
					activeResultId={activeResultId}
					navigateToNext={navigateToNext}
					navigateToPrev={navigateToPrev}
				/>

				<div className={cls.notMessageWrapper}>
					<NotMessage />
				</div>

				<MessageFormComponent />
			</section>
		);
	}

	// ─────────────────────────────────────────────────────────────

	const messagesClass = classNames(cls.messagesContent, {
		[cls.messagesContent_noRadius]: isMobile && isActionBarVisible
	});

	return (
		<section className={cls.chatView}>
			<ChatHeader
				userName={safeHeaderData.userName}
				userStatus={safeHeaderData.userStatus}
				userAvatar={safeHeaderData.userAvatar}
				isOnline={safeHeaderData.isOnline}
				isInContacts={safeHeaderData.isInContacts}
				contactPhone={safeHeaderData.contactPhone}
				contactFirstName={safeHeaderData.contactFirstName}
				contactLastName={safeHeaderData.contactLastName}
				onCall={handleCall}
				onAddToContacts={handleAddToContacts}
				onBlock={handleBlock}
				onBack={isMobile ? handleBack : undefined}
				onActionBarVisibilityChange={setIsActionBarVisible}
				messages={messages}
				onNavigateToMessage={handleNavigateToMessage}
				searchQuery={searchQuery}
				onSearchQueryChange={setSearchQuery}
				isSearchVisible={isSearchVisible}
				onSearchToggle={() => setIsSearchVisible(!isSearchVisible)}
				searchResultsCount={searchResultsCount}
				activeResultIndex={activeResultIndex}
				activeResultId={activeResultId}
				navigateToNext={navigateToNext}
				navigateToPrev={navigateToPrev}
			/>

			{hasMessages ? (
				<>
					<MessagesList
						userUid={chatUid}
						className={messagesClass}
						activeResultId={activeResultId}
						searchQuery={searchQuery}
						onContainerReady={handleContainerReady}
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
