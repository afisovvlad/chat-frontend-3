import { Chat } from '@/entities/Chat';

// УНИВЕРСАЛЬНЫЕ ФИЛЬТРЫ (для любых объектов)

export function filterByName<T extends Record<string, unknown>>(
	items: T[],
	searchTerm: string,
	fieldName: keyof T = 'name' as keyof T
): T[] {
	const term = searchTerm.toLowerCase().trim();
	if (!term) {
		return items;
	}

	return items.filter(item => {
		const value = item[fieldName];
		if (typeof value !== 'string') {
			return false;
		}
		return value.toLowerCase().includes(term);
	});
}

export function filterByNameExtended<T extends Record<string, unknown>>(
	items: T[],
	searchTerm: string,
	fields: Array<keyof T> = ['nickname', 'first_name', 'last_name'] as Array<
		keyof T
	>
): T[] {
	const term = searchTerm.toLowerCase().trim();
	if (!term) {
		return items;
	}

	return items.filter(item =>
		fields.some(field => {
			const value = item[field];
			return typeof value === 'string' && value.toLowerCase().includes(term);
		})
	);
}

// СПЕЦИАЛИЗИРОВАННЫЙ ФИЛЬТР ДЛЯ ЧАТОВ (оптимизированный + дженерик)

export function filterChatsLocal<
	T extends {
		name: string;
		chat: {
			username?: string | null;
			nickname?: string | null;
			first_name?: string | null;
			last_name?: string | null;
			patronymic?: string | null;
		};
		last_message?: { content?: string | null } | null;
	}
>(items: T[], searchTerm: string): T[] {
	const term = searchTerm.toLowerCase().trim();
	if (!term) {
		return items;
	}
	return items.filter(item => {
		//  1. Быстрые и вероятные проверки (короткое замыкание)
		if (item.name.toLowerCase().includes(term)) {
			return true;
		}

		//  2. Поиск по последнему сообщению (частый кейс)
		if (item.last_message?.content?.toLowerCase().includes(term)) {
			return true;
		}
		//  3. Поля пользователя — только если предыдущие не сработали
		const { chat } = item;

		// Без создания массива: нативное короткое замыкание через ||
		return (
			chat.username?.toLowerCase().includes(term) ||
			chat.nickname?.toLowerCase().includes(term) ||
			chat.first_name?.toLowerCase().includes(term) ||
			chat.last_name?.toLowerCase().includes(term) ||
			chat.patronymic?.toLowerCase().includes(term)
		);
	});
}
