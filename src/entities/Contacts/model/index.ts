export type {
	ContactsSchema,
	AddContactByPhoneRequest,
	AddContactResponse,
	ContactValidationError,
	ContactAuthError,
	AddContactApiResponse
} from './types/ContactsSchema';

export { useAddContactByPhoneMutation } from '../api/contactApi';
