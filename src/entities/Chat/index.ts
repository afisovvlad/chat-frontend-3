export { ChatList, ChatListItem } from './ui';
export type { ChatListProps } from './ui';

export { chatApi, useGetChatsQuery, useGetChatByIdQuery } from './api/chatApi';

export type {
	Chat,
	ChatUser,
	ChatListResponse,
	GetChatsRequest
} from './model';

export { ChatType } from './model';

export { mapChatToUserCard } from './lib/mapper/chatMapper';
