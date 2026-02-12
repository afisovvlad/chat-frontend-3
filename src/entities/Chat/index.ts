export { ChatList, ChatListItem } from './ui';
export type { ChatListProps } from './ui';

export { chatApi, useGetChatsQuery, useGetChatByIdQuery } from './api/chatApi';

export type {
	Chat,
	ChatUser,
	ChatListResponse,
	GetChatsRequest,
	ChatState
} from './model';

export { ChatType } from './model';

export {
	chatSlice,
	chatReducer,
	setSelectedChatId,
	setChatLoading,
	setChatError,
	clearChatError,
	addChat,
	updateChat,
	removeChat,
	clearChats,
	setChats
} from './model';

export {
	selectChatState,
	selectAllChats,
	selectSelectedChatId,
	selectSelectedChat,
	selectFavoriteChats,
	selectUnreadChats,
	selectIsLoading,
	selectError
} from './model';

export { mapChatToUserCard } from './lib/mapper/chatMapper';
