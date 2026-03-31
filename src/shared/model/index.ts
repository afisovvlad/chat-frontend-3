// ─── КОНСТАНТЫ ───────────────────────────────────────
export {
	MESSAGES_PAGE_SIZE,
	MESSAGES_ORDERING,
	MESSAGES_QUERY_DEFAULTS,
	CHATS_PAGE_SIZE,
	CHATS_ORDERING,
	CHATS_QUERY_DEFAULTS
} from './constants/chat.constants';

export type {
	MessageOrdering,
	ChatsOrdering
} from './constants/chat.constants';

export {
	CONTACTS_PAGE_SIZE,
	CONTACTS_ORDERING,
	CONTACTS_GLOBAL_SEARCH_MIN_LENGTH,
	CONTACTS_GLOBAL_SEARCH_PREFIX,
	CONTACTS_SEARCH_DEBOUNCE_MS,
	CONTACTS_QUERY_DEFAULTS,
	CONTACTS_SEARCH_DEFAULTS
} from './constants/contacts.constants';

export type { ContactsOrdering } from './constants/contacts.constants';
