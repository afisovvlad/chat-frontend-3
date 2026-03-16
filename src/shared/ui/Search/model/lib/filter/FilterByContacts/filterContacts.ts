export function filterContacts<
	// дораработал чтобы работало с ContactsSchema
	T extends {
		first_name?: string;
		last_name?: string;
		nickname?: string;
		username?: string;
		phone?: string;
	}
>(items: T[], searchTerm: string): T[] {
	const term = searchTerm.toLowerCase().trim();

	if (!term) {
		return items;
	}

	// Нормализуем терм для поиска по телефону (убираем пробелы, тире, скобки)
	const normalizedTerm = term.replace(/[\s\-\(\)]/g, '');

	return items.filter(item => {
		const firstName = item.first_name?.toLowerCase() || '';
		const lastName = item.last_name?.toLowerCase() || '';
		const nickname = item.nickname?.toLowerCase() || '';
		const username = item.username?.toLowerCase() || '';
		const phone = item.phone?.toLowerCase() || '';

		// fullName для поиска по "Имя Фамилия"
		const fullName = `${firstName} ${lastName}`.trim().toLowerCase();

		// Нормализуем телефон для сравнения
		const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');

		return (
			firstName.includes(term) ||
			lastName.includes(term) ||
			nickname.includes(term) ||
			username.includes(term) ||
			fullName.includes(term) ||
			phone.includes(term) ||
			normalizedPhone.includes(normalizedTerm)
		);
	});
}
