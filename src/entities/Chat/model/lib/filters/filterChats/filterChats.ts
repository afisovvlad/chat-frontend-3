import { Chat } from '@/entities/Chat';

export function filterChatsLocal(items: Chat[], searchTerm: string): Chat[] {
	const term = searchTerm.toLowerCase().trim();
	if (!term) {
		return items;
	}

	return items.filter(item => {
		// 1. Поиск по имени чата
		if (item.name.toLowerCase().includes(term)) {
			return true;
		}

		// 2. Поиск по полям пользователя
		const { chat } = item;
		const searchableFields = [
			chat.username,
			chat.nickname,
			chat.first_name,
			chat.last_name,
			chat.patronymic
		].filter((val): val is string => typeof val === 'string');

		if (searchableFields.some(field => field.toLowerCase().includes(term))) {
			return true;
		}

		// 3. Поиск по тексту последнего сообщения
		if (item.last_message?.content?.toLowerCase().includes(term)) {
			return true;
		}

		return false;
	});
}
