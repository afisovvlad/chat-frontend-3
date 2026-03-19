import { Message, MessageType } from '../model/types/chat.types/chat.types';

/**
 * Фильтрует только системные сообщения из массива
 */
export function getSystemMessages(messages: Message[]) {
	return messages.filter(msg => msg.type === MessageType.SYSTEM);
}

/**
 * Фильтрует только пользовательские сообщения
 */
export function getUserMessages(messages: Message[]) {
	return messages.filter(msg => msg.type === MessageType.TEXT);
}

/**
 * Группирует сообщения по датам для отображения разделителей
 */
export function groupMessagesByDate(messages: Message[]) {
	const groups = new Map<string, Message[]>();

	messages.forEach(message => {
		const dateKey = message.createdAt.toISOString().split('T')[0];
		if (!groups.has(dateKey)) {
			groups.set(dateKey, []);
		}
		groups.get(dateKey)!.push(message);
	});

	return Array.from(groups.entries()).map(([date, msgs]) => ({
		date: new Date(date),
		messages: msgs
	}));
}

/**
 * Добавляет моковые сообщения к существующим
 */
export function mergeWithMockMessages(
	existing: Message[],
	mock: Message[]
): Message[] {
	return [...existing, ...mock].sort(
		(a, b) => a.createdAt.getTime() - b.createdAt.getTime()
	);
}
