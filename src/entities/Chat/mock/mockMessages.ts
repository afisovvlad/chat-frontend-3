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

// Пользователи
export const USERS = {
	ME: { id: 'user-me', name: 'Вы' },
	ANNA: { id: 'user-anna', name: 'Анна Петрова' },
	VLAD: { id: 'user-vlad', name: 'Влад Ляшев' },
	SERGEY: { id: 'user-sergey', name: 'Сергей Евтушенко' }
} as const;

// ============================================================================
// ХЕЛПЕРЫ (минимум кода, максимум пользы)
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
// МОКОВЫЕ СООБЩЕНИЯ (~40 шт, все сценарии)
// ============================================================================

export const mockMessages: Message[] = [
	// 📅 Разделитель: Сегодня
	systemMsg('sys-today', -24 * HOUR, SystemEventType.DATE_SEPARATOR, {
		date: new Date(NOW - 24 * HOUR),
		label: 'Сегодня'
	}),

	// 🔹 Входящие сообщения (статус: RECEIVED)
	textMsg(
		'm1',
		-23 * HOUR + 5 * MINUTE,
		'Привет! Как дела?',
		USERS.ANNA.id,
		USERS.ANNA.name,
		MessageStatus.RECEIVED
	),
	textMsg(
		'm2',
		-23 * HOUR + 7 * MINUTE,
		'Работаешь сегодня?',
		USERS.ANNA.id,
		USERS.ANNA.name,
		MessageStatus.RECEIVED
	),

	// 🔹 Исходящие: разные статусы
	textMsg(
		'm3',
		-23 * HOUR + 10 * MINUTE,
		'Привет! Да, работаю 👋',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.READ
	),
	textMsg(
		'm4',
		-23 * HOUR + 12 * MINUTE,
		'Заканчиваю отчёт, потом свободен',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.DELIVERED
	),
	textMsg(
		'm5',
		-23 * HOUR + 14 * MINUTE,
		'Это сообщение ещё летит...',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.SENDING
	),

	// 🔹 Входящий с ответом (реплаем)
	textMsg(
		'm6',
		-23 * HOUR + 20 * MINUTE,
		'Понял, жду тогда!',
		USERS.ANNA.id,
		USERS.ANNA.name,
		MessageStatus.RECEIVED,
		{
			has_replied_message: true,
			replyTo: { id: 'm4', text: 'Заканчиваю отчёт...' }
		}
	),

	// 🔹 Исходящее с пересылкой
	textMsg(
		'm7',
		-23 * HOUR + 25 * MINUTE,
		'Смотри, что нашёл 👇',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.READ,
		{
			has_forwarded_message: true,
			forwardedFrom: { chatName: 'Рабочий чат', author: 'Максим' }
		}
	),

	// 🔹 Сообщение с файлом
	textMsg(
		'm8',
		-22 * HOUR + 30 * MINUTE,
		'📎 Отчёт_январь_2024.pdf',
		USERS.SERGEY.id,
		USERS.SERGEY.name,
		MessageStatus.RECEIVED,
		{
			files_summary: { types: ['pdf'], count: 1 }
		}
	),

	// 🔹 Редактированное сообщение
	textMsg(
		'm9',
		-22 * HOUR + 40 * MINUTE,
		'Встреча перенесена на 16:00 ⏰',
		USERS.ANNA.id,
		USERS.ANNA.name,
		MessageStatus.READ,
		{
			isEdited: true
		}
	),

	// 🔹 Ошибка отправки
	textMsg(
		'm10',
		-22 * HOUR + 45 * MINUTE,
		'Это не ушло из-за сети ⚠️',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.ERROR
	),

	// 👥 Системные события
	systemMsg(
		'sys-join',
		-22 * HOUR + 50 * MINUTE,
		SystemEventType.MEMBER_JOINED,
		{
			userId: USERS.VLAD.id,
			userName: USERS.VLAD.name,
			joinType: 'invited',
			inviterId: USERS.ANNA.id,
			inviterName: USERS.ANNA.name
		}
	),

	textMsg(
		'm11',
		-22 * HOUR + 52 * MINUTE,
		'Всем привет! 👋',
		USERS.VLAD.id,
		USERS.VLAD.name,
		MessageStatus.RECEIVED
	),

	// 🔹 Групповые сообщения (для теста аватарок)
	textMsg(
		'm12',
		-21 * HOUR,
		'Кто будет на митинге?',
		USERS.ANNA.id,
		USERS.ANNA.name,
		MessageStatus.RECEIVED
	),
	textMsg(
		'm13',
		-21 * HOUR + 2 * MINUTE,
		'Я буду',
		USERS.VLAD.id,
		USERS.VLAD.name,
		MessageStatus.RECEIVED
	),
	textMsg(
		'm14',
		-21 * HOUR + 3 * MINUTE,
		'Тоже подключусь',
		USERS.SERGEY.id,
		USERS.SERGEY.name,
		MessageStatus.RECEIVED
	),
	textMsg(
		'm15',
		-21 * HOUR + 4 * MINUTE,
		'Ок, созвон в 15:00',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.READ
	),

	// 🔹 Длинные сообщения (тест переносов)
	textMsg(
		'm16',
		-20 * HOUR,
		'Коллеги, напоминаю повестку:\n' +
			'1. Статус по задачам\n' +
			'2. Блокеры и риски\n' +
			'3. План на неделю\n' +
			'4. Вопросы\n\n' +
			'Подготовьте, пожалуйста, короткие апдейты. 📋',
		USERS.ANNA.id,
		USERS.ANNA.name,
		MessageStatus.RECEIVED
	),

	// 🔹 Эмодзи и спецсимволы
	textMsg(
		'm17',
		-19 * HOUR,
		'Тест: 🔥✅⚠️📎 "кавычки" \'апострофы\' & <tags>',
		USERS.VLAD.id,
		USERS.VLAD.name,
		MessageStatus.RECEIVED
	),

	// 📅 Разделитель: Вчера
	systemMsg('sys-yesterday', -18 * HOUR, SystemEventType.DATE_SEPARATOR, {
		date: new Date(NOW - 18 * HOUR),
		label: 'Вчера'
	}),

	// 🔹 Сообщения "вчера"
	textMsg(
		'm18',
		-18 * HOUR + 2 * HOUR,
		'Доброе утро! Начнём?',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.READ
	),
	textMsg(
		'm19',
		-18 * HOUR + 2 * HOUR + 5 * MINUTE,
		'Доброе! Да, я готов',
		USERS.ANNA.id,
		USERS.ANNA.name,
		MessageStatus.RECEIVED
	),

	// 🔹 Цепочка ответов
	textMsg(
		'm20',
		-18 * HOUR + 3 * HOUR,
		'Нашёл баг в модуле авторизации',
		USERS.SERGEY.id,
		USERS.SERGEY.name,
		MessageStatus.RECEIVED,
		{
			has_replied_message: true
		}
	),
	textMsg(
		'm21',
		-18 * HOUR + 3 * HOUR + 2 * MINUTE,
		'Какой именно? Скинь лог',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.DELIVERED
	),
	textMsg(
		'm22',
		-18 * HOUR + 3 * HOUR + 5 * MINUTE,
		'📎 error_log.txt',
		USERS.SERGEY.id,
		USERS.SERGEY.name,
		MessageStatus.RECEIVED,
		{
			files_summary: { types: ['txt'], count: 1 }
		}
	),

	// 🔹 Закреплённое сообщение (системное)
	systemMsg('sys-pin', -17 * HOUR, SystemEventType.MESSAGE_PINNED, {
		messageId: 'm16',
		pinnedByUserId: USERS.ANNA.id,
		pinnedByUserName: USERS.ANNA.name,
		messageContent: 'Коллеги, напоминаю повестку...'
	}),

	// 🔹 Ещё входящие
	textMsg(
		'm23',
		-16 * HOUR,
		'Обновил документацию в Confluence',
		USERS.VLAD.id,
		USERS.VLAD.name,
		MessageStatus.RECEIVED
	),
	textMsg(
		'm24',
		-16 * HOUR + 10 * MINUTE,
		'Спасибо, посмотрю после обеда',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.SENT
	),

	// 📅 Разделитель: Прошлая дата (с годом)
	systemMsg('sys-old', -7 * 24 * HOUR, SystemEventType.DATE_SEPARATOR, {
		date: new Date(NOW - 7 * 24 * HOUR),
		label: '11 января 2024'
	}),

	// 🔹 Старые сообщения
	textMsg(
		'm25',
		-7 * 24 * HOUR + 5 * HOUR,
		'Помните, обсуждали рефакторинг?',
		USERS.ANNA.id,
		USERS.ANNA.name,
		MessageStatus.READ
	),
	textMsg(
		'm26',
		-7 * 24 * HOUR + 6 * HOUR,
		'Да, начнём на следующей неделе',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.READ
	),

	// 🔹 Разные статусы для теста индикаторов
	textMsg(
		'm27',
		-5 * HOUR,
		'Статус: RECEIVED',
		USERS.ANNA.id,
		USERS.ANNA.name,
		MessageStatus.RECEIVED
	),
	textMsg(
		'm28',
		-4 * HOUR + 50 * MINUTE,
		'Статус: SENDING',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.SENDING
	),
	textMsg(
		'm29',
		-4 * HOUR + 40 * MINUTE,
		'Статус: SENT',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.SENT
	),
	textMsg(
		'm30',
		-4 * HOUR + 30 * MINUTE,
		'Статус: DELIVERED',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.DELIVERED
	),
	textMsg(
		'm31',
		-4 * HOUR + 20 * MINUTE,
		'Статус: READ',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.READ
	),
	textMsg(
		'm32',
		-4 * HOUR + 10 * MINUTE,
		'Статус: ERROR',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.ERROR
	),

	// 🔹 Сообщения с файлами разных типов
	textMsg(
		'm33',
		-3 * HOUR,
		'📎 image.png',
		USERS.VLAD.id,
		USERS.VLAD.name,
		MessageStatus.RECEIVED,
		{
			files_summary: { types: ['image/png'], count: 1 }
		}
	),
	textMsg(
		'm34',
		-2 * HOUR + 50 * MINUTE,
		'📎 video.mp4, doc.pdf',
		USERS.SERGEY.id,
		USERS.SERGEY.name,
		MessageStatus.RECEIVED,
		{
			files_summary: { types: ['video/mp4', 'application/pdf'], count: 2 }
		}
	),

	// 🔹 Короткие / пустые / спец. случаи
	textMsg(
		'm35',
		-2 * HOUR,
		'👍',
		USERS.ANNA.id,
		USERS.ANNA.name,
		MessageStatus.RECEIVED
	),
	textMsg(
		'm36',
		-1 * HOUR + 55 * MINUTE,
		'...',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.DELIVERED
	),

	// 🔹 Системные: изменение названия чата
	systemMsg(
		'sys-rename',
		-1 * HOUR + 30 * MINUTE,
		SystemEventType.CHAT_NAME_CHANGED,
		{
			oldName: 'Проект Альфа',
			newName: 'Проект Альфа 🚀',
			changedByUserId: USERS.ANNA.id,
			changedByUserName: USERS.ANNA.name
		}
	),

	// 🔹 Последние сообщения (для теста скролла вниз)
	textMsg(
		'm37',
		-30 * MINUTE,
		'Всем хорошего дня! 👋',
		USERS.ANNA.id,
		USERS.ANNA.name,
		MessageStatus.RECEIVED
	),
	textMsg(
		'm38',
		-25 * MINUTE,
		'И вам! До завтра!',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.READ
	),
	textMsg(
		'm39',
		-20 * MINUTE,
		'Не забудьте про митинг в 10:00 ⏰',
		USERS.VLAD.id,
		USERS.VLAD.name,
		MessageStatus.RECEIVED
	),
	textMsg(
		'm40',
		-15 * MINUTE,
		'Помню, буду вовремя ✅',
		USERS.ME.id,
		USERS.ME.name,
		MessageStatus.DELIVERED
	)
];

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
