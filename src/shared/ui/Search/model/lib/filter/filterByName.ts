// src/features/Search/lib/filters/filterChats.ts
/**
 * Фильтр для чатов (поиск по имени, никнейму, имени пользователя)
 * Используется для локального поиска в уже загруженных данных
 */
export function filterByName<T extends { name: string }>(
	items: T[],
	searchTerm: string
): T[] {
	const term = searchTerm.toLowerCase().trim();
	if (!term) {
		return [];
	}

	return items.filter(item => {
		const name = item.name?.toLowerCase() || '';
		return name.includes(term);
	});
}

/**
 * Фильтр для расширенного поиска чатов (по всем полям пользователя)
 * Используется для локального поиска в уже загруженных данных
 */
export function filterByNameExtended<
	T extends {
		name: string;
		chat: {
			username?: string;
			nickname?: string;
			first_name?: string;
			last_name?: string;
			patronymic?: string;
		};
	}
>(items: T[], searchTerm: string): T[] {
	const term = searchTerm.toLowerCase().trim();
	if (!term) {
		return [];
	}

	return items.filter(item => {
		const name = item.name?.toLowerCase() || '';
		const username = item.chat.username?.toLowerCase() || '';
		const nickname = item.chat.nickname?.toLowerCase() || '';
		const firstName = item.chat.first_name?.toLowerCase() || '';
		const lastName = item.chat.last_name?.toLowerCase() || '';
		const patronymic = item.chat.patronymic?.toLowerCase() || '';

		return (
			name.includes(term) ||
			username.includes(term) ||
			nickname.includes(term) ||
			firstName.includes(term) ||
			lastName.includes(term) ||
			patronymic.includes(term)
		);
	});
}
