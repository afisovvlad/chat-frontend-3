import { rtkApi } from '@/shared/api/rtkApi';
import type {
	AddContactByPhoneRequest,
	AddContactResponse
} from '../model/types/ContactsSchema';

export const contactApi = rtkApi.injectEndpoints({
	endpoints: build => ({
		addContactByPhone: build.mutation<
			AddContactResponse,
			AddContactByPhoneRequest
		>({
			query: body => ({
				url: '/contact/messenger-add-by-phone/',
				method: 'POST',
				body
			}),

			invalidatesTags: ['Contacts', 'ChatList']
		})
	}),
	overrideExisting: false
});

export const { useAddContactByPhoneMutation } = contactApi;
