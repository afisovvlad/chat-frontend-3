import { rtkApi } from '@/shared/api/rtkApi';
import type {
	ContactsSchema,
	GetContactsRequest,
	AddContactByPhoneRequest,
	AddContactResponse,
	PaginatedResponse,
	CheckContactRequest
} from '../model/types/contacts.types';

export const contactApi = rtkApi.injectEndpoints({
	endpoints: build => ({
		getContacts: build.query<
			PaginatedResponse<ContactsSchema>,
			GetContactsRequest
		>({
			query: params => ({
				url: '/contact/messenger-list/',
				method: 'GET',
				params: {
					page_size: params.pageSize ?? 30,
					ordering: params.ordering ?? '-created_at',
					search: params.search
				}
			}),
			providesTags: result =>
				result
					? [
							...result.results.map(({ uid }) => ({
								type: 'Contacts' as const,
								uid
							})),
							{ type: 'Contacts' as const, id: 'LIST' }
						]
					: [{ type: 'Contacts' as const, id: 'LIST' }]
		}),

		// 🔹 Обновляем эндпоинт
		searchGlobalContacts: build.query<
			PaginatedResponse<ContactsSchema>,
			CheckContactRequest[]
		>({
			query: body => ({
				url: '/contact/check/list/',
				method: 'POST',
				body
			}),
			providesTags: ['GlobalContactSearch']
		}),

		addContactByPhone: build.mutation<
			AddContactResponse,
			AddContactByPhoneRequest
		>({
			query: body => ({
				url: '/contact/messenger-add-by-phone/',
				method: 'POST',
				body
			}),
			invalidatesTags: ['Contacts', { type: 'Contacts', id: 'LIST' }]
		})
	}),
	overrideExisting: false
});

export const {
	useGetContactsQuery,
	useLazyGetContactsQuery,
	useSearchGlobalContactsQuery,
	useLazySearchGlobalContactsQuery,
	useAddContactByPhoneMutation
} = contactApi;
