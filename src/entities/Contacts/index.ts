export type {
	ContactsSchema,
	AddContactByPhoneRequest,
	AddContactResponse,
	ContactValidationError,
	ContactAuthError,
	AddContactApiResponse
} from './model/types/ContactsSchema';

export { useAddContactByPhoneMutation } from './api/contactApi';
