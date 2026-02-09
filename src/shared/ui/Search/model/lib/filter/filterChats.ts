export function filterChats<T extends { name: string }>(
	items: T[],
	searchTerm: string
): T[] {
	const term = searchTerm.toLowerCase().trim();
	if (!term) {
		return [];
	}

	return items.filter(item => item.name?.toLowerCase().includes(term));
}
