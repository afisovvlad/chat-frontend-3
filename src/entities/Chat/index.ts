export { ChatListItem } from './ui/ChatListItem/ChatListItem';
export { ChatList } from './ui/ChatList/ChatList';
export type { ChatListProps } from './ui/ChatList/ChatList';

export type {
	ChatMessage,
	ChatUser,
	Chat,
	ChatListResponse,
	GetChatsRequest,
	ChatItemSchema
} from './model/types/chat.types';

export { ChatType } from './model/types/chat.types';

export { mapChatToUserCard } from './model/mapper/chatMapper';

export { chatApi, useGetChatsQuery, useGetChatByIdQuery } from './api/chatApi';
