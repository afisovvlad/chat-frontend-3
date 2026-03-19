import { ContactsSchema } from '../../types/contacts.types/contacts.types';
import type { IUserCard } from '@/shared/ui/UserCard';

export const mapContactToUserCard = (contact: ContactsSchema): IUserCard => {
	return {
		user: {
			uid: contact.uid,
			first_name: contact.first_name,
			last_name: contact.last_name,

			phone: contact.phone,

			avatar: contact.system_contact.avatar ?? undefined,
			avatar_url: contact.system_contact.avatar_url ?? undefined,
			avatar_webp: contact.system_contact.avatar_webp ?? undefined,
			avatar_webp_url: contact.system_contact.avatar_webp_url ?? undefined,
			is_online: contact.system_contact.is_online,
			was_online_at: contact.system_contact.was_online_at
				? Math.floor(contact.system_contact.was_online_at / 1000)
				: undefined,

			nickname: undefined,
			patronymic: undefined
		}
	};
};
