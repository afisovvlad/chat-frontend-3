import { useMemo, useCallback, useState, useEffect } from 'react';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';
import {
	Message,
	MessageType,
	TextMessage,
	SystemMessageData,
	MessageOccurrence,
	UseMessageSearchOptions,
	UseMessageSearchReturn
} from '../../../types/chat.types/chat.types';

export function useMessageSearch({
	messages,
	searchQuery,
	caseSensitive = false,
	searchInSender = true,
	searchInSystemText = false,
	debounceDelay = 300
}: UseMessageSearchOptions): UseMessageSearchReturn {
	const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

	const debouncedSetQuery = useDebounce(
		(value: string) => setDebouncedQuery(value),
		debounceDelay
	);

	useEffect(() => {
		debouncedSetQuery(searchQuery);
	}, [searchQuery, debouncedSetQuery]);

	const normalize = useCallback(
		(text: string) => (caseSensitive ? text : text.toLowerCase()),
		[caseSensitive]
	);

	const messageMatches = useCallback(
		(message: Message, query: string): boolean => {
			if (!query.trim()) {
				return true;
			}
			const normalizedQuery = normalize(query.trim());

			if (message.type === MessageType.TEXT) {
				const textMsg = message as TextMessage;
				const contentMatch = normalize(textMsg.content).includes(
					normalizedQuery
				);

				if (searchInSender && textMsg.senderName) {
					const senderMatch = normalize(textMsg.senderName).includes(
						normalizedQuery
					);
					return contentMatch || senderMatch;
				}
				return contentMatch;
			}

			if (message.type === MessageType.SYSTEM && searchInSystemText) {
				const sysMsg = message as SystemMessageData;
				const systemText = JSON.stringify(sysMsg.eventData).toLowerCase();
				return normalize(systemText).includes(normalizedQuery);
			}

			return false;
		},
		[normalize, searchInSender, searchInSystemText]
	);
	const filteredMessages = useMemo(() => {
		if (!debouncedQuery.trim()) {
			return messages;
		}
		return messages.filter(msg => messageMatches(msg, debouncedQuery));
	}, [messages, debouncedQuery, messageMatches]);

	const matchingIndices = useMemo(() => {
		if (!debouncedQuery.trim()) {
			return [];
		}
		return messages
			.map((msg, idx) => (messageMatches(msg, debouncedQuery) ? idx : -1))
			.filter((idx): idx is number => idx !== -1);
	}, [messages, debouncedQuery, messageMatches]);

	const findAllOccurrences = useCallback(
		(text: string, query: string): number[] => {
			if (!query.trim()) {
				return [];
			}

			const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = new RegExp(escapedQuery, 'gi');
			const indices: number[] = [];

			let match;
			while ((match = regex.exec(text)) !== null) {
				indices.push(match.index);
			}

			return indices;
		},
		[]
	);

	const occurrences = useMemo((): MessageOccurrence[] => {
		if (!debouncedQuery.trim()) {
			return [];
		}

		const allOccurrences: MessageOccurrence[] = [];
		let globalIndex = 0;

		filteredMessages.forEach(message => {
			if (message.type !== MessageType.TEXT) {
				return;
			}

			const textMsg = message as TextMessage;

			const indices = findAllOccurrences(textMsg.content, debouncedQuery);

			indices.forEach((position, occurrenceIndex) => {
				allOccurrences.push({
					messageId: message.id,
					occurrenceIndex,
					globalIndex: globalIndex++,
					content: textMsg.content
				});
			});
		});

		return allOccurrences;
	}, [filteredMessages, debouncedQuery, findAllOccurrences]);

	const [activeOccurrenceIndex, setActiveOccurrenceIndex] = useState(0);

	const activeOccurrence = useMemo(() => {
		if (occurrences.length === 0) {
			return null;
		}

		const safeIndex = Math.max(
			0,
			Math.min(activeOccurrenceIndex, occurrences.length - 1)
		);
		return occurrences[safeIndex];
	}, [occurrences, activeOccurrenceIndex]);

	const goToNextOccurrence = useCallback(() => {
		if (occurrences.length === 0) {
			return;
		}
		setActiveOccurrenceIndex(prev => (prev + 1) % occurrences.length);
	}, [occurrences.length]);

	const goToPrevOccurrence = useCallback(() => {
		if (occurrences.length === 0) {
			return;
		}
		setActiveOccurrenceIndex(
			prev => (prev - 1 + occurrences.length) % occurrences.length
		);
	}, [occurrences.length]);

	const getActiveOccurrencesForMessage = useCallback(
		(messageId: string): number[] => {
			if (!activeOccurrence || activeOccurrence.messageId !== messageId) {
				return [];
			}

			return [activeOccurrence.occurrenceIndex];
		},
		[activeOccurrence]
	);

	useEffect(() => {
		setActiveOccurrenceIndex(0);
	}, [debouncedQuery]);

	return useMemo(
		() => ({
			filteredMessages,
			matchingIndices,

			occurrences,
			activeOccurrenceIndex,
			activeOccurrence,
			totalOccurrences: occurrences.length,
			goToNextOccurrence,
			goToPrevOccurrence,
			getActiveOccurrencesForMessage,

			activeResultIndex: activeOccurrenceIndex,
			activeResultId: activeOccurrence?.messageId,
			searchResultsCount: occurrences.length,

			navigateToNext: goToNextOccurrence,
			navigateToPrev: goToPrevOccurrence,
			setActiveResultIndex: setActiveOccurrenceIndex
		}),
		[
			filteredMessages,
			matchingIndices,
			activeOccurrenceIndex,
			activeOccurrence,
			occurrences,
			goToNextOccurrence,
			goToPrevOccurrence,
			getActiveOccurrencesForMessage
		]
	);
}
