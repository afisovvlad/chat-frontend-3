import {
	MessageType,
	MessageStatus,
	SystemEventType,
	Message,
	TextMessage,
	SystemMessageData,
	SystemEventData
} from '../model/types/chat.types/chat.types';

// ============================================================================
// КОНСТАНТЫ
// ============================================================================

const NOW = Date.now();
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Пользователи
export const USERS = {
	ME: { id: 'user-me', name: 'Вы' },
	ANNA: { id: 'user-anna', name: 'Анна Петрова' },
	VLAD: { id: 'user-vlad', name: 'Влад Ляшев' },
	SERGEY: { id: 'user-sergey', name: 'Сергей Евтушенко' },
	OLEG: { id: 'user-oleg', name: 'Олег Смирнов' }
} as const;

// ============================================================================
// ХЕЛПЕРЫ
// ============================================================================

const textMsg = (
	id: string,
	offset: number,
	content: string,
	senderId: string,
	senderName: string,
	status: MessageStatus,
	partial?: Partial<TextMessage>
): TextMessage => ({
	id,
	type: MessageType.TEXT,
	content,
	senderId,
	senderName,
	status,
	createdAt: new Date(NOW + offset),
	updatedAt: new Date(NOW + offset),
	isEdited: false,
	...partial
});

const systemMsg = (
	id: string,
	offset: number,
	eventType: SystemEventType,
	payload: unknown
): SystemMessageData => ({
	id,
	type: MessageType.SYSTEM,
	eventType,
	createdAt: new Date(NOW + offset),
	eventData: { type: eventType, payload } as SystemEventData
});

// ============================================================================
// ГЕНЕРАТОР МОКОВЫЕ ДАННЫХ (~120 сообщений, 14 дней)
// ============================================================================

export const mockMessages: Message[] = [
	// ========================================================================
	// 📅 ДЕНЬ 0: СЕГОДНЯ (0 дней назад)
	// ========================================================================

	// Разделитель "Сегодня"
	...generateDayMessages({
		dayOffset: 0,
		label: 'Сегодня',
		messages: [
			{
				offset: -15 * MINUTE,
				from: USERS.ANNA,
				text: 'Всем доброе утро! ☀️',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -12 * MINUTE,
				from: USERS.ME,
				text: 'Доброе! Кофе уже пью ☕',
				status: MessageStatus.READ
			},
			{
				offset: -10 * MINUTE,
				from: USERS.VLAD,
				text: 'Привет! Кто сегодня на стендапе?',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -8 * MINUTE,
				from: USERS.ME,
				text: 'Я буду, подключусь в 10:00',
				status: MessageStatus.DELIVERED
			},
			{
				offset: -5 * MINUTE,
				from: USERS.SERGEY,
				text: 'Я тоже, только доделываю задачу',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -2 * MINUTE,
				from: USERS.ANNA,
				text: 'Отлично, тогда созвон как обычно',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -1 * MINUTE,
				from: USERS.ME,
				text: '👍',
				status: MessageStatus.READ
			}
		]
	}),

	// ========================================================================
	// 📅 ДЕНЬ 1: ВЧЕРА (-1 день)
	// ========================================================================

	...generateDayMessages({
		dayOffset: -1,
		label: 'Вчера',
		messages: [
			{
				offset: -23 * HOUR + 30 * MINUTE,
				from: USERS.VLAD,
				text: 'Кто видел последний коммит?',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -22 * HOUR + 45 * MINUTE,
				from: USERS.ME,
				text: 'Я пушил фикс баги с авторизацией',
				status: MessageStatus.READ
			},
			{
				offset: -22 * HOUR + 30 * MINUTE,
				from: USERS.ANNA,
				text: 'Спасибо! Тестировала — всё ок ✅',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -21 * HOUR + 15 * MINUTE,
				from: USERS.SERGEY,
				text: 'Коллеги, не забудьте про деплой вечером',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -20 * HOUR + 50 * MINUTE,
				from: USERS.ME,
				text: 'Помню, подготовлю релиз-ноты',
				status: MessageStatus.DELIVERED
			},
			{
				offset: -19 * HOUR + 30 * MINUTE,
				from: USERS.OLEG,
				text: 'Я тоже помогу с тестами',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -18 * HOUR + 10 * MINUTE,
				from: USERS.ANNA,
				text: 'Супер, тогда все готовы 🚀',
				status: MessageStatus.RECEIVED
			}
		]
	}),

	// ========================================================================
	// 📅 ДЕНЬ 2: 2 дня назад
	// ========================================================================

	...generateDayMessages({
		dayOffset: -2,
		label: '23 марта',
		messages: [
			{
				offset: -2 * DAY + 20 * HOUR,
				from: USERS.ME,
				text: 'Начал работу над новым модулем',
				status: MessageStatus.READ
			},
			{
				offset: -2 * DAY + 19 * HOUR,
				from: USERS.ANNA,
				text: 'Какой именно?',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -2 * DAY + 18 * HOUR + 30 * MINUTE,
				from: USERS.ME,
				text: 'Система уведомлений — как раз то, что обсуждали',
				status: MessageStatus.DELIVERED
			},
			{
				offset: -2 * DAY + 17 * HOUR,
				from: USERS.VLAD,
				text: 'О, круто! Нужна помощь с бэкендом?',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -2 * DAY + 16 * HOUR + 15 * MINUTE,
				from: USERS.ME,
				text: 'Пока справляюсь, но если что — напишу',
				status: MessageStatus.READ
			},
			{
				offset: -2 * DAY + 14 * HOUR,
				from: USERS.SERGEY,
				text: 'Скинь ссылку на задачу в трекере',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -2 * DAY + 13 * HOUR + 45 * MINUTE,
				from: USERS.ME,
				text: 'https://tracker.local/task/12345',
				status: MessageStatus.READ
			}
		]
	}),

	// ========================================================================
	// 📅 ДЕНЬ 3: 3 дня назад
	// ========================================================================

	...generateDayMessages({
		dayOffset: -3,
		label: '22 марта',
		messages: [
			{
				offset: -3 * DAY + 22 * HOUR,
				from: USERS.ANNA,
				text: 'Ребята, у нас дедлайн по проекту Альфа',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -3 * DAY + 21 * HOUR + 30 * MINUTE,
				from: USERS.ME,
				text: 'Понял, сколько времени осталось?',
				status: MessageStatus.DELIVERED
			},
			{
				offset: -3 * DAY + 20 * HOUR,
				from: USERS.ANNA,
				text: 'До конца недели, так что есть время',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -3 * DAY + 19 * HOUR + 15 * MINUTE,
				from: USERS.VLAD,
				text: 'Я возьму на себя интеграцию с API',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -3 * DAY + 18 * HOUR,
				from: USERS.SERGEY,
				text: 'А я тесты напишу',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -3 * DAY + 17 * HOUR + 30 * MINUTE,
				from: USERS.OLEG,
				text: 'Мне можно верстку поручить',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -3 * DAY + 16 * HOUR,
				from: USERS.ME,
				text: 'Отлично, распределили задачи 👍',
				status: MessageStatus.READ
			}
		]
	}),

	// ========================================================================
	// 📅 ДЕНЬ 4: 4 дня назад
	// ========================================================================

	...generateDayMessages({
		dayOffset: -4,
		label: '21 марта',
		messages: [
			{
				offset: -4 * DAY + 23 * HOUR,
				from: USERS.VLAD,
				text: 'Кто-нибудь проверял новый дизайн?',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -4 * DAY + 22 * HOUR + 15 * MINUTE,
				from: USERS.ANNA,
				text: 'Да, выглядит отлично! Особенно тёмная тема',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -4 * DAY + 21 * HOUR,
				from: USERS.ME,
				text: 'Согласен, но есть пара мелких багов',
				status: MessageStatus.DELIVERED
			},
			{
				offset: -4 * DAY + 20 * HOUR + 30 * MINUTE,
				from: USERS.SERGEY,
				text: 'Какие именно?',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -4 * DAY + 19 * HOUR + 45 * MINUTE,
				from: USERS.ME,
				text: 'Кнопка не центрируется на мобильных',
				status: MessageStatus.READ
			},
			{
				offset: -4 * DAY + 18 * HOUR + 20 * MINUTE,
				from: USERS.OLEG,
				text: 'Поправлю в течение часа',
				status: MessageStatus.RECEIVED
			}
		]
	}),

	// ========================================================================
	// 📅 ДЕНЬ 5: 5 дней назад
	// ========================================================================

	...generateDayMessages({
		dayOffset: -5,
		label: '20 марта',
		messages: [
			{
				offset: -5 * DAY + 20 * HOUR,
				from: USERS.ANNA,
				text: 'Провели ретроспективу спринта',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -5 * DAY + 19 * HOUR + 30 * MINUTE,
				from: USERS.ME,
				text: 'Что решили улучшить?',
				status: MessageStatus.DELIVERED
			},
			{
				offset: -5 * DAY + 18 * HOUR + 45 * MINUTE,
				from: USERS.ANNA,
				text: 'Больше код-ревью и меньше митингов 😄',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -5 * DAY + 17 * HOUR + 20 * MINUTE,
				from: USERS.VLAD,
				text: 'Поддерживаю! Митинги съедают время',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -5 * DAY + 16 * HOUR,
				from: USERS.SERGEY,
				text: 'А ещё автоматизировать деплой',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -5 * DAY + 15 * HOUR + 10 * MINUTE,
				from: USERS.ME,
				text: 'Запишу в бэклог',
				status: MessageStatus.READ
			}
		]
	}),

	// ========================================================================
	// 📅 ДЕНЬ 6: 6 дней назад
	// ========================================================================

	...generateDayMessages({
		dayOffset: -6,
		label: '19 марта',
		messages: [
			{
				offset: -6 * DAY + 22 * HOUR + 30 * MINUTE,
				from: USERS.OLEG,
				text: 'Задеплоили новую версию на стейдж',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -6 * DAY + 21 * HOUR + 45 * MINUTE,
				from: USERS.ME,
				text: 'Проверяю, пока всё стабильно',
				status: MessageStatus.DELIVERED
			},
			{
				offset: -6 * DAY + 20 * HOUR + 20 * MINUTE,
				from: USERS.ANNA,
				text: 'Отлично, тогда завтра на прод',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -6 * DAY + 19 * HOUR,
				from: USERS.VLAD,
				text: 'Нужно ещё обновить документацию',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -6 * DAY + 18 * HOUR + 15 * MINUTE,
				from: USERS.SERGEY,
				text: 'Я займусь этим после обеда',
				status: MessageStatus.RECEIVED
			}
		]
	}),

	// ========================================================================
	// 📅 ДЕНЬ 7: Неделя назад
	// ========================================================================

	...generateDayMessages({
		dayOffset: -7,
		label: '18 марта',
		messages: [
			{
				offset: -7 * DAY + 23 * HOUR,
				from: USERS.ME,
				text: 'Неделя пролетела быстро! 🚀',
				status: MessageStatus.READ
			},
			{
				offset: -7 * DAY + 22 * HOUR + 15 * MINUTE,
				from: USERS.ANNA,
				text: 'Да, но мы много успели',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -7 * DAY + 21 * HOUR + 30 * MINUTE,
				from: USERS.VLAD,
				text: 'Следующая неделя будет ещё продуктивнее',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -7 * DAY + 20 * HOUR + 45 * MINUTE,
				from: USERS.SERGEY,
				text: 'Главное — не выгореть 😅',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -7 * DAY + 19 * HOUR + 20 * MINUTE,
				from: USERS.OLEG,
				text: 'Баланс работа/отдых — наше всё',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -7 * DAY + 18 * HOUR,
				from: USERS.ME,
				text: 'Согласен на 100% 💯',
				status: MessageStatus.READ
			}
		]
	}),

	// ========================================================================
	// 📅 ДЕНЬ 8-14: Прошлые дни (по 3-4 сообщения для теста длинного скролла)
	// ========================================================================

	...generateDayMessages({
		dayOffset: -8,
		label: '17 марта',
		messages: [
			{
				offset: -8 * DAY + 20 * HOUR,
				from: USERS.ANNA,
				text: 'Планируем следующий спринт',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -8 * DAY + 19 * HOUR,
				from: USERS.ME,
				text: 'У меня есть пара идей для улучшения',
				status: MessageStatus.DELIVERED
			},
			{
				offset: -8 * DAY + 18 * HOUR,
				from: USERS.VLAD,
				text: 'Расскажи на планировании',
				status: MessageStatus.RECEIVED
			}
		]
	}),

	...generateDayMessages({
		dayOffset: -9,
		label: '16 марта',
		messages: [
			{
				offset: -9 * DAY + 21 * HOUR,
				from: USERS.SERGEY,
				text: 'Написал тесты для нового функционала',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -9 * DAY + 20 * HOUR + 30 * MINUTE,
				from: USERS.ME,
				text: 'Супер, покрытие выросло?',
				status: MessageStatus.READ
			},
			{
				offset: -9 * DAY + 19 * HOUR + 45 * MINUTE,
				from: USERS.SERGEY,
				text: 'С 78% до 85% 📈',
				status: MessageStatus.RECEIVED
			}
		]
	}),

	...generateDayMessages({
		dayOffset: -10,
		label: '15 марта',
		messages: [
			{
				offset: -10 * DAY + 22 * HOUR,
				from: USERS.OLEG,
				text: 'Обновил зависимости в проекте',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -10 * DAY + 21 * HOUR + 15 * MINUTE,
				from: USERS.ME,
				text: 'Были брейкинг-ченджи?',
				status: MessageStatus.DELIVERED
			},
			{
				offset: -10 * DAY + 20 * HOUR + 30 * MINUTE,
				from: USERS.OLEG,
				text: 'Нет, всё совместимо ✅',
				status: MessageStatus.RECEIVED
			}
		]
	}),

	...generateDayMessages({
		dayOffset: -11,
		label: '14 марта',
		messages: [
			{
				offset: -11 * DAY + 23 * HOUR,
				from: USERS.ANNA,
				text: 'Клиент доволен демо!',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -11 * DAY + 22 * HOUR + 20 * MINUTE,
				from: USERS.ME,
				text: 'Ура! 🎉 Что сказали?',
				status: MessageStatus.READ
			},
			{
				offset: -11 * DAY + 21 * HOUR + 40 * MINUTE,
				from: USERS.ANNA,
				text: 'Хотят запустить в прод на следующей неделе',
				status: MessageStatus.RECEIVED
			}
		]
	}),

	...generateDayMessages({
		dayOffset: -12,
		label: '13 марта',
		messages: [
			{
				offset: -12 * DAY + 20 * HOUR,
				from: USERS.VLAD,
				text: 'Оптимизировал загрузку аватарок',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -12 * DAY + 19 * HOUR + 30 * MINUTE,
				from: USERS.ME,
				text: 'Насколько быстрее стало?',
				status: MessageStatus.DELIVERED
			},
			{
				offset: -12 * DAY + 18 * HOUR + 45 * MINUTE,
				from: USERS.VLAD,
				text: 'На 40% меньше времени загрузки 🚀',
				status: MessageStatus.RECEIVED
			}
		]
	}),

	...generateDayMessages({
		dayOffset: -13,
		label: '12 марта',
		messages: [
			{
				offset: -13 * DAY + 21 * HOUR,
				from: USERS.SERGEY,
				text: 'Нашёл и пофиксил утечку памяти',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -13 * DAY + 20 * HOUR + 15 * MINUTE,
				from: USERS.ME,
				text: 'Отличная работа! 👏',
				status: MessageStatus.READ
			},
			{
				offset: -13 * DAY + 19 * HOUR + 30 * MINUTE,
				from: USERS.SERGEY,
				text: 'Теперь приложение стабильнее работает',
				status: MessageStatus.RECEIVED
			}
		]
	}),

	...generateDayMessages({
		dayOffset: -14,
		label: '11 марта',
		// Системное событие в начале дня
		systemFirst: systemMsg(
			'sys-old-start',
			-14 * DAY + 23 * HOUR + 30 * MINUTE,
			SystemEventType.CHAT_CREATED,
			{
				chatId: 'chat-test-001',
				name: 'Тестовый чат',
				ownerId: USERS.ME.id,
				ownerFullName: USERS.ME.name
			}
		),
		messages: [
			{
				offset: -14 * DAY + 22 * HOUR,
				from: USERS.ME,
				text: 'Создал тестовый чат для отладки',
				status: MessageStatus.READ
			},
			{
				offset: -14 * DAY + 21 * HOUR + 30 * MINUTE,
				from: USERS.ANNA,
				text: 'Вижу, спасибо!',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -14 * DAY + 20 * HOUR + 45 * MINUTE,
				from: USERS.VLAD,
				text: 'Буду тестировать скролл здесь',
				status: MessageStatus.RECEIVED
			},
			{
				offset: -14 * DAY + 19 * HOUR + 20 * MINUTE,
				from: USERS.ME,
				text: 'Отлично, пиши если найдёшь баги',
				status: MessageStatus.DELIVERED
			}
		]
	}),

	// ========================================================================
	// 🔹 ДОПОЛНИТЕЛЬНЫЕ СИСТЕМНЫЕ СОБЫТИЯ (разбросаны по времени)
	// ========================================================================

	// Приглашение пользователя
	systemMsg(
		'sys-invite-1',
		-3 * DAY + 15 * HOUR,
		SystemEventType.MEMBER_INVITED,
		{
			inviterId: USERS.ANNA.id,
			inviterName: USERS.ANNA.name,
			invitedUserId: USERS.OLEG.id,
			invitedUserName: USERS.OLEG.name
		}
	),

	// Пользователь покинул чат (потом вернулся)
	systemMsg('sys-left-1', -5 * DAY + 10 * HOUR, SystemEventType.MEMBER_LEFT, {
		userId: USERS.VLAD.id,
		userName: USERS.VLAD.name
	}),
	systemMsg(
		'sys-join-2',
		-5 * DAY + 10 * HOUR + 30 * MINUTE,
		SystemEventType.MEMBER_JOINED,
		{
			userId: USERS.VLAD.id,
			userName: USERS.VLAD.name,
			joinType: 'self'
		}
	),

	// Закрепление сообщения
	systemMsg('sys-pin-1', -2 * DAY + 12 * HOUR, SystemEventType.MESSAGE_PINNED, {
		messageId: 'm-important',
		pinnedByUserId: USERS.ANNA.id,
		pinnedByUserName: USERS.ANNA.name,
		messageContent: 'Важное напоминание о дедлайне!'
	}),

	// Изменение названия чата
	systemMsg(
		'sys-rename-1',
		-6 * DAY + 14 * HOUR,
		SystemEventType.CHAT_NAME_CHANGED,
		{
			oldName: 'Рабочий чат',
			newName: 'Рабочий чат 🚀',
			changedByUserId: USERS.ME.id,
			changedByUserName: USERS.ME.name
		}
	)
];

// ============================================================================
// ХЕЛПЕР: Генерация сообщений для одного дня
// ============================================================================

interface DayMessagesConfig {
	dayOffset: number; // Отрицательное число: -1 = вчера, -7 = неделя назад
	label: string; // Текст для разделителя
	messages: Array<{
		offset: number;
		from: (typeof USERS)[keyof typeof USERS];
		text: string;
		status: MessageStatus;
	}>;
	systemFirst?: SystemMessageData; // Опциональное системное сообщение в начале
}

function generateDayMessages(config: DayMessagesConfig): Message[] {
	const result: Message[] = [];
	const dayStart = config.dayOffset * DAY;

	// Добавляем разделитель даты
	// Используем нормализованную дату (без времени) для корректного сравнения
	const separatorDate = new Date(NOW + dayStart);
	separatorDate.setHours(0, 0, 0, 0);

	result.push(
		systemMsg(
			`sys-date-${config.dayOffset}`,
			dayStart - HOUR, // Разделитель чуть раньше первых сообщений дня
			SystemEventType.DATE_SEPARATOR,
			{ date: separatorDate, label: config.label }
		)
	);

	// Опциональное системное сообщение в начале
	if (config.systemFirst) {
		result.push(config.systemFirst);
	}

	// Текстовые сообщения
	for (const msg of config.messages) {
		result.push(
			textMsg(
				`msg-${config.dayOffset}-${msg.offset}`,
				dayStart + msg.offset,
				msg.text,
				msg.from.id,
				msg.from.name,
				msg.status
			)
		);
	}

	return result;
}

// ============================================================================
// ЭКСПОРТЫ ДЛЯ УДОБНОГО ИМПОРТА
// ============================================================================

/** Только текстовые сообщения */
export const mockTextMessages = mockMessages.filter(
	(msg): msg is TextMessage => msg.type === MessageType.TEXT
);

/** Только системные сообщения */
export const mockSystemMessages = mockMessages.filter(
	(msg): msg is SystemMessageData => msg.type === MessageType.SYSTEM
);

/** Только исходящие (от "меня") */
export const mockOutgoingMessages = mockTextMessages.filter(
	msg => msg.senderId === USERS.ME.id
);

/** Только входящие (от других) */
export const mockIncomingMessages = mockTextMessages.filter(
	msg => msg.senderId !== USERS.ME.id
);

/** Сообщения с ошибками / отправкой */
export const mockPendingMessages = mockTextMessages.filter(
	msg =>
		msg.senderId === USERS.ME.id &&
		[MessageStatus.SENDING, MessageStatus.ERROR].includes(msg.status)
);

/** Сообщения по дням (для отладки) */
export const getMessagesByDate = (dateOffset: number): Message[] => {
	const dayStart = dateOffset * DAY;
	const dayEnd = dayStart + DAY;

	return mockMessages.filter(msg => {
		const msgTime = msg.createdAt.getTime();
		return msgTime >= NOW + dayStart && msgTime < NOW + dayEnd;
	});
};

/** Получить все разделители дат */
export const getDateSeparators = (): SystemMessageData[] => {
	return mockSystemMessages.filter(
		msg => msg.eventType === SystemEventType.DATE_SEPARATOR
	);
};
