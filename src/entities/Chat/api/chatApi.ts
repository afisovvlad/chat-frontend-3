import { RootState } from '@/app/providers/StoreProvider';
import { rtkApi } from '@/shared/api/rtkApi';
import { createSelector } from '@reduxjs/toolkit';
import { mapApiMessageToFrontend } from '../model/mapper/mapChatType/chatMapper';
import type {
	Chat,
	ChatListResponse,
	GetChatsRequest,
	GetMessagesRequest,
	MessageListResponse,
	RawMessageListResponse,
	UpdateChatPropertiesRequest,
	UpdateChatPropertiesResponse
} from '../model/types/chat.types/chat.types';
import {
	CHATS_ORDERING,
	CHATS_PAGE_SIZE,
	MESSAGES_ORDERING,
	MESSAGES_PAGE_SIZE
} from '@/shared/model';

// ─────────────────────────────────────────────────────────────
//  RTK QUERY API
// ─────────────────────────────────────────────────────────────

export const chatApi = rtkApi.injectEndpoints({
	endpoints: build => ({
		// ─── Список чатов ───────────────────────────────────────
		getChats: build.query<ChatListResponse, GetChatsRequest | void>({
			query: query => {
				const params: Record<string, string | number | boolean | undefined> = {
					page_size: query?.pageSize ?? CHATS_PAGE_SIZE,
					ordering: query?.ordering ?? CHATS_ORDERING,
					page: query?.page,
					search: query?.search?.trim() || undefined,
					is_active: query?.isActive,
					is_blocked: query?.isBlocked,
					is_favorite: query?.isFavorite
				};

				Object.keys(params).forEach(key => {
					if (params[key] === undefined) {
						delete params[key];
					}
				});

				return { url: '/chat/list/', params, method: 'GET' };
			},
			providesTags: result =>
				result
					? [
							...result.results.map(({ id }) => ({
								type: 'Chats' as const,
								id
							})),
							{ type: 'Chats', id: 'LIST' }
						]
					: [{ type: 'Chats', id: 'LIST' }],
			keepUnusedDataFor: 60
		}),

		// ─── Один чат по UID ────────────────────────────────────
		getChatById: build.query<Chat, string>({
			query: chatUid => ({
				url: `/chat/${chatUid}/`,
				method: 'GET'
			}),
			providesTags: (result, error, chatUid) => [{ type: 'Chats', id: chatUid }]
		}),

		// ─── Сообщения чата (НОВЫЙ эндпоинт) ────────────────────
		getMessages: build.query<MessageListResponse, GetMessagesRequest>({
			query: args => {
				//user_uid должен быть в пути, а не в params
				return {
					url: `/chat/message/text/${args.user_uid}/`,
					params: {
						// Остальные параметры — в query string
						page_size: args.page_size ?? MESSAGES_PAGE_SIZE,
						ordering: args.ordering ?? MESSAGES_ORDERING,
						page: args.page,
						search: args.search
					},
					method: 'GET'
				};
			},

			providesTags: result =>
				result
					? [
							...result.results.map(({ uid }) => ({
								type: 'Messages' as const,
								id: uid
							})),
							{ type: 'Messages', id: 'LIST' }
						]
					: [{ type: 'Messages', id: 'LIST' }],
			keepUnusedDataFor: 30,

			transformResponse: (
				response: RawMessageListResponse
			): MessageListResponse => ({
				...response,
				results: response.results.map(mapApiMessageToFrontend)
			})
		}),

		deleteChat: build.mutation({
			query: (id: number) => ({
				url: `/chat/list/${id}/`,
				method: 'DELETE'
			}),

			invalidatesTags: ['Chats']
		}),

		updateChatProperties: build.mutation<
			UpdateChatPropertiesResponse,
			{ id: number } & Partial<UpdateChatPropertiesRequest>
		>({
			query: ({ id, ...body }) => ({
				url: `/chat/list/${id}/`,
				method: 'POST',
				body
			}),

			invalidatesTags: (result, error, { id }) => [{ type: 'Chats', id }]
		})
	}),
	overrideExisting: false
});

// ─────────────────────────────────────────────────────────────
//  ЭКСПОРТЫ ХУКОВ
// ─────────────────────────────────────────────────────────────

export const {
	useGetChatsQuery,
	useLazyGetChatsQuery,
	useGetChatByIdQuery,
	useGetMessagesQuery,
	useLazyGetMessagesQuery,
	useDeleteChatMutation,
	useUpdateChatPropertiesMutation,
	endpoints: { getChats, getChatById, getMessages }
} = chatApi;

// ─────────────────────────────────────────────────────────────
//  СЕЛЕКТОРЫ
// ─────────────────────────────────────────────────────────────
export const selectChatByUid = createSelector(
	[(state: RootState) => state, (_: RootState, chatUid: string) => chatUid],
	(state, chatUid) => {
		const chatsData = chatApi.endpoints.getChats.select({
			pageSize: CHATS_PAGE_SIZE,
			ordering: CHATS_ORDERING
		})(state);

		//  Ищем чат, где chat.uid === chatUid (UID собеседника)
		// ИЛИ chat_key === chatUid (для групп)
		return chatsData.data?.results?.find(
			(chat: Chat) =>
				chat.chat?.uid === chatUid || // личный чат
				chat.chat_key === chatUid // группа/канал
		);
	}
);
