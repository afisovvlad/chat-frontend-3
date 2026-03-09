import { ContactsSchema } from '../types/contacts.types';
import type { IUserCard } from '@/shared/ui/UserCard';

export const mapContactToUserCard = (contact: ContactsSchema): IUserCard => {
	const toOptional = <T>(value: T | null): T | undefined => value ?? undefined;

	return {
		user: {
			first_name: contact.first_name,
			last_name: contact.last_name,

			uid: contact.system_contact.uid,
			phone: contact.phone,

			avatar: toOptional(contact.system_contact.avatar),
			avatar_url: toOptional(contact.system_contact.avatar_url),
			avatar_webp: toOptional(contact.system_contact.avatar_webp),
			avatar_webp_url: toOptional(contact.system_contact.avatar_webp_url),

			is_online: contact.system_contact.is_online,
			was_online_at: toOptional(contact.system_contact.was_online_at),

			nickname: undefined,
			patronymic: undefined
		}
	};
};
