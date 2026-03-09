// src/features/contacts/index.ts

// ─── Компоненты ────────────────────────────────────────────────

export { ContactsList } from './ui/ContactsList/ContactsList';
export { ContactsListContent } from './ui/ContactsListContent/ContactsListContent';
export { ContactsListItem } from './ui/ContactsItem/ContactsItem';

// ─── Типы ──────────────────────────────────────────────────────
export type {
	ContactsSchema,
	AddContactByPhoneRequest,
	AddContactResponse,
	ContactValidationError,
	ContactAuthError,
	AddContactApiResponse,
	GetContactsRequest,
	PaginatedResponse
} from './model/types/contacts.types';

// ─── API & Hooks ───────────────────────────────────────────────
export {
	contactApi,
	useGetContactsQuery,
	useLazyGetContactsQuery,
	useAddContactByPhoneMutation
} from './api/contactsApi';
