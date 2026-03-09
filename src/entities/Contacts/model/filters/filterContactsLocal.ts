import { ContactsSchema } from '../../model/types/contacts.types';

export const filterContactsLocal = (
	items: ContactsSchema[],
	searchTerm: string
): ContactsSchema[] => {
	const term = searchTerm.toLowerCase().trim();

	if (!term) {
		return items;
	}

	return items.filter(item => {
		const firstName = item.first_name?.toLowerCase() || '';
		const lastName = item.last_name?.toLowerCase() || '';
		const phone = item.phone?.toLowerCase() || '';
		const fullName = `${firstName} ${lastName}`.toLowerCase();

		return (
			firstName.includes(term) ||
			lastName.includes(term) ||
			fullName.includes(term) ||
			phone.includes(term) ||
			phone.replace(/[\s\-\(\)]/g, '').includes(term.replace(/[\s\-\(\)]/g, ''))
		);
	});
};
