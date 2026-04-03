import { useMemo, useCallback, useState, useEffect } from 'react';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';
import {
	Message,
	MessageType,
	TextMessage,
	SystemMessageData
} from '../../../types/chat.types/chat.types';

// ============================================================================
//  ТИПЫ
// ============================================================================

/**
 * Представляет одно вхождение поискового запроса в тексте сообщения
 */
export interface MessageOccurrence {
	messageId: string; // ID сообщения, в котором найдено вхождение
	occurrenceIndex: number; // Порядковый номер вхождения внутри этого сообщения (0, 1, 2...)
	globalIndex: number; // Глобальный порядковый номер среди всех вхождений (для навигации)
	content: string; // Полный текст сообщения (нужен для подсветки)
}

/**
 * Возвращаемые значения хука useMessageSearch
 */
export interface UseMessageSearchReturn {
	// 🔹 Фильтрация
	filteredMessages: Message[]; // Сообщения, соответствующие запросу

	// 🔹 Навигация по вхождениям (новое)
	occurrences: MessageOccurrence[]; // Все найденные вхождения запроса во всех сообщениях
	activeOccurrenceIndex: number; // Индекс активного вхождения в массиве occurrences
	activeOccurrence: MessageOccurrence | null; // Данные текущего активного вхождения
	totalOccurrences: number; // Общее количество вхождений (для счётчика "1 из N")

	// 🔹 Обратная совместимость со старым интерфейсом
	matchingIndices: number[]; // Индексы сообщений-совпадений в исходном массиве
	activeResultIndex: number; // Алиас на activeOccurrenceIndex (для старого кода)
	activeResultId: string | undefined; // ID сообщения с активным вхождением (для скролла)
	searchResultsCount: number; // Алиас на totalOccurrences (для счётчика)

	// 🔹 Навигация
	navigateToNext: () => void; // Перейти к следующему вхождению
	navigateToPrev: () => void; // Перейти к предыдущему вхождению
	setActiveResultIndex: (index: number) => void; // Установить активное вхождение вручную

	// 🔹 Подсветка
	getActiveOccurrencesForMessage: (messageId: string) => number[]; // Получить индексы активных вхождений для конкретного сообщения
}

/**
 * Опции для настройки хука useMessageSearch
 */
export interface UseMessageSearchOptions {
	messages: Message[]; // Исходный массив сообщений для поиска
	searchQuery: string; // Поисковый запрос (текст)
	caseSensitive?: boolean; // Учитывать ли регистр (по умолчанию: false)
	searchInSender?: boolean; // Искать ли в имени отправителя (по умолчанию: true)
	searchInSystemText?: boolean; // Искать ли в системных сообщениях (по умолчанию: false)
	debounceDelay?: number; // Задержка дебаунса ввода в мс (по умолчанию: 300)
}

// ============================================================================
//  ХУК
// ============================================================================

/**
 * Хук для поиска по сообщениям с навигацией по вхождениям слов
 *
 * @example
 * const {
 *   occurrences,
 *   activeOccurrenceIndex,
 *   navigateToNext,
 *   getActiveOccurrencesForMessage
 * } = useMessageSearch({
 *   messages,
 *   searchQuery: 'привет',
 *   debounceDelay: 300
 * });
 */
export function useMessageSearch({
	messages,
	searchQuery,
	caseSensitive = false,
	searchInSender = true,
	searchInSystemText = false,
	debounceDelay = 300
}: UseMessageSearchOptions): UseMessageSearchReturn {
	// ─────────────────────────────────────────────────────────────
	//  STATE: Управление активным вхождением и дебаунсом
	// ─────────────────────────────────────────────────────────────

	/**
	 * Индекс активного вхождения в массиве occurrences
	 * Используется для навигации ↑↓ и подсветки
	 */
	// const [activeResultIndex, setActiveResultIndex] = useState(0);

	/**
	 * Дебаунс-версия поискового запроса
	 * Обновляется с задержкой, чтобы не пересчитывать поиск на каждый символ
	 */
	const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

	/**
	 * Дебаунс-функция: откладывает обновление debouncedQuery на debounceDelay мс
	 * Предотвращает лишние пересчёты при быстром вводе
	 */
	const debouncedSetQuery = useDebounce(
		(value: string) => setDebouncedQuery(value),
		debounceDelay
	);

	/**
	 * Синхронизирует внешний searchQuery с внутренним debouncedQuery
	 * Запускает дебаунс при каждом изменении запроса
	 */
	useEffect(() => {
		debouncedSetQuery(searchQuery);
	}, [searchQuery, debouncedSetQuery]);

	// ─────────────────────────────────────────────────────────────
	//  УТИЛИТЫ: Нормализация и проверка совпадений
	// ─────────────────────────────────────────────────────────────

	/**
	 * Нормализует текст для поиска: приводит к нижнему регистру, если caseSensitive=false
	 *
	 * @param text - Исходный текст
	 * @returns Нормализованный текст для сравнения
	 */
	const normalize = useCallback(
		(text: string) => (caseSensitive ? text : text.toLowerCase()),
		[caseSensitive]
	);

	/**
	 * Проверяет, соответствует ли сообщение поисковому запросу
	 * Ищет в содержимом сообщения, имени отправителя и системных данных
	 *
	 * @param message - Сообщение для проверки
	 * @param query - Поисковый запрос
	 * @returns true, если сообщение содержит запрос
	 */
	const messageMatches = useCallback(
		(message: Message, query: string): boolean => {
			if (!query.trim()) {
				return true; // Пустой запрос = все сообщения подходят
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

	// ─────────────────────────────────────────────────────────────
	//  ФИЛЬТРАЦИЯ: Сообщения, соответствующие запросу
	// ─────────────────────────────────────────────────────────────

	/**
	 * Фильтрует массив сообщений, оставляя только те, что содержат запрос
	 * Пересчитывается при изменении сообщений или дебаунс-запроса
	 *
	 * @returns Отфильтрованный массив сообщений
	 */
	const filteredMessages = useMemo(() => {
		if (!debouncedQuery.trim()) {
			return messages; // Пустой запрос = вернуть все сообщения
		}
		return messages.filter(msg => messageMatches(msg, debouncedQuery));
	}, [messages, debouncedQuery, messageMatches]);

	/**
	 * Возвращает индексы сообщений-совпадений в исходном массиве messages
	 * Нужно для обратной совместимости со старым интерфейсом
	 *
	 * @returns Массив индексов совпадающих сообщений
	 */
	const matchingIndices = useMemo(() => {
		if (!debouncedQuery.trim()) {
			return [];
		}
		return messages
			.map((msg, idx) => (messageMatches(msg, debouncedQuery) ? idx : -1))
			.filter((idx): idx is number => idx !== -1);
	}, [messages, debouncedQuery, messageMatches]);

	// ─────────────────────────────────────────────────────────────
	//  ПОИСК ВХОЖДЕНИЙ: Навигация по отдельным словам
	// ─────────────────────────────────────────────────────────────

	/**
	 * Находит все позиции (индексы) вхождений подстроки в тексте
	 * Использует регулярное выражение с флагом 'g' для поиска всех совпадений
	 *
	 * @param text - Текст для поиска
	 * @param query - Подстрока для поиска
	 * @returns Массив индексов, где найдены вхождения
	 */
	const findAllOccurrences = useCallback(
		(text: string, query: string): number[] => {
			if (!query.trim()) {
				return [];
			}

			// Экранируем спецсимволы для безопасного использования в RegExp
			const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const regex = new RegExp(escapedQuery, 'gi'); // g = global, i = ignore case
			const indices: number[] = [];

			let match;
			while ((match = regex.exec(text)) !== null) {
				indices.push(match.index); // Сохраняем позицию начала совпадения
			}

			return indices;
		},
		[]
	);

	/**
	 * Формирует плоский список всех вхождений запроса во всех отфильтрованных сообщениях
	 * Каждое вхождение имеет глобальный индекс для навигации и локальный индекс внутри сообщения
	 *
	 * @returns Массив объектов MessageOccurrence для навигации и подсветки
	 */
	const occurrences = useMemo((): MessageOccurrence[] => {
		if (!debouncedQuery.trim()) {
			return [];
		}

		const allOccurrences: MessageOccurrence[] = [];
		let globalIndex = 0;

		filteredMessages.forEach(message => {
			// Пропускаем не-текстовые сообщения
			if (message.type !== MessageType.TEXT) {
				return;
			}

			const textMsg = message as TextMessage;
			// Находим все позиции слова в тексте сообщения
			const indices = findAllOccurrences(textMsg.content, debouncedQuery);

			// Создаём запись для каждого вхождения
			indices.forEach((position, occurrenceIndex) => {
				allOccurrences.push({
					messageId: message.id, // Чтобы найти сообщение в DOM
					occurrenceIndex, // Номер вхождения внутри сообщения (0, 1, 2...)
					globalIndex: globalIndex++, // Глобальный номер для навигации ↑↓
					content: textMsg.content // Текст для подсветки
				});
			});
		});

		return allOccurrences;
	}, [filteredMessages, debouncedQuery, findAllOccurrences]);

	// ─────────────────────────────────────────────────────────────
	//  STATE: Активное вхождение
	// ─────────────────────────────────────────────────────────────

	/**
	 * Индекс текущего активного вхождения в массиве occurrences
	 * Управляется через навигационные кнопки ↑↓
	 */
	const [activeOccurrenceIndex, setActiveOccurrenceIndex] = useState(0);

	/**
	 * Возвращает данные активного вхождения с защитой от выхода за границы массива
	 *
	 * @returns Объект MessageOccurrence или null, если вхождений нет
	 */
	const activeOccurrence = useMemo(() => {
		if (occurrences.length === 0) {
			return null;
		}
		// Ограничиваем индекс допустимым диапазоном [0, length-1]
		const safeIndex = Math.max(
			0,
			Math.min(activeOccurrenceIndex, occurrences.length - 1)
		);
		return occurrences[safeIndex];
	}, [occurrences, activeOccurrenceIndex]);

	// ─────────────────────────────────────────────────────────────
	//  НАВИГАЦИЯ: Переход между вхождениями
	// ─────────────────────────────────────────────────────────────

	/**
	 * Переходит к следующему вхождению (циклически: после последнего → первое)
	 * Вызывается при нажатии на стрелку ↓ или Ctrl+Enter
	 */
	const goToNextOccurrence = useCallback(() => {
		if (occurrences.length === 0) {
			return;
		}
		setActiveOccurrenceIndex(prev => (prev + 1) % occurrences.length);
	}, [occurrences.length]);

	/**
	 * Переходит к предыдущему вхождению (циклически: перед первым → последнее)
	 * Вызывается при нажатии на стрелку ↑ или Shift+Ctrl+Enter
	 */
	const goToPrevOccurrence = useCallback(() => {
		if (occurrences.length === 0) {
			return;
		}
		setActiveOccurrenceIndex(
			prev => (prev - 1 + occurrences.length) % occurrences.length
		);
	}, [occurrences.length]);

	// ─────────────────────────────────────────────────────────────
	//  ПОДСВЕТКА: Определение активных вхождений для сообщения
	// ─────────────────────────────────────────────────────────────

	/**
	 * Возвращает индексы вхождений, которые принадлежат указанному сообщению
	 * Нужно для точечной подсветки: какие именно слова в сообщении подсвечивать как активные
	 *
	 * @param messageId - ID сообщения
	 * @returns Массив occurrenceIndex для этого сообщения
	 */
	// Функция для получения активных вхождений в сообщении
	const getActiveOccurrencesForMessage = useCallback(
		(messageId: string): number[] => {
			if (!activeOccurrence || activeOccurrence.messageId !== messageId) {
				return [];
			}
			// Возвращаем индекс вхождения внутри этого сообщения
			return [activeOccurrence.occurrenceIndex];
		},
		[activeOccurrence]
	);

	// ─────────────────────────────────────────────────────────────
	//  ЭФФЕКТЫ: Сброс состояния при новом поиске
	// ─────────────────────────────────────────────────────────────

	/**
	 * Сбрасывает индекс активного вхождения на 0 при изменении поискового запроса
	 * Чтобы при новом поиске навигация начиналась с первого результата
	 */
	useEffect(() => {
		setActiveOccurrenceIndex(0);
	}, [debouncedQuery]);

	// ─────────────────────────────────────────────────────────────
	//  RETURN: Формируем и возвращаем объект с результатами
	// ─────────────────────────────────────────────────────────────

	/**
	 * Возвращает все вычисленные значения и хендлеры
	 * Мемоизируется через useMemo для предотвращения лишних ре-рендеров
	 */
	return useMemo(
		() => ({
			// 🔹 Фильтрация (старый интерфейс)
			filteredMessages,
			matchingIndices,

			//  Навигация по вхождениям (новый интерфейс)
			occurrences,
			activeOccurrenceIndex,
			activeOccurrence,
			totalOccurrences: occurrences.length,
			goToNextOccurrence,
			goToPrevOccurrence,
			getActiveOccurrencesForMessage,

			//  Обратная совместимость: алиасы на новые поля
			// Чтобы старый код продолжал работать без изменений
			activeResultIndex: activeOccurrenceIndex, // Алиас для навигации
			activeResultId: activeOccurrence?.messageId, // Алиас для скролла по ID
			searchResultsCount: occurrences.length, // Алиас для счётчика "N из N"

			//  Хендлеры навигации (перенаправляют на новые функции)
			navigateToNext: goToNextOccurrence, // Для кнопок ↑↓
			navigateToPrev: goToPrevOccurrence,
			setActiveResultIndex: setActiveOccurrenceIndex // Для ручного управления
		}),
		[
			// Зависимости для useMemo: пересчитывать только при изменении этих значений
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
