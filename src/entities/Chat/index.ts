export { ChatListItem } from './ui/ChatListItem/ChatListItem';
export { ChatList } from './ui/ChatList/ChatList';
export { MessagesList } from './ui/MessagesList/MessagesList';
export { ChatHeader } from './ui/ChatHeader/ChatHeader';
export { MessageFormComponent } from './ui/ChatBottom/ui/MessageFormComponent/MessageFormComponent';
export { ChatView } from './ui/ChatView/ChatView';

export type { ChatListProps } from './ui/ChatList/ChatList';

// ─── БАЗОВЫЕ ТИПЫ ПОЛЬЗОВАТЕЛЯ ─────────────────────────────────────────
export type { BaseUser, ChatUser } from './model/types/chat.types/chat.types';

// ─── ВЛОЖЕНИЯ (ФАЙЛЫ) ─────────────────────────────────────────────────
export type {
	FileAttachment,
	FilesSummary
} from './model/types/chat.types/chat.types';

// ─── КОНСТАНТЫ ───────────────────────────────────────
export {
	MESSAGES_PAGE_SIZE,
	MESSAGES_ORDERING,
	MESSAGES_QUERY_DEFAULTS,
	CHATS_PAGE_SIZE,
	CHATS_ORDERING,
	CHATS_QUERY_DEFAULTS
} from './model/constants/constants';

export type {
	MessageOrdering,
	ChatsOrdering
} from './model/constants/constants';

// ─── СООБЩЕНИЯ: ФРОНТЕНД-ФОРМАТ ───────────────────────────────────────
export type { ChatMessage } from './model/types/chat.types/chat.types';

// ─── СООБЩЕНИЯ: RAW-ФОРМАТ (API) ──────────────────────────────────────
export type {
	RawApiChatMessage,
	MessagePreview,
	ForwardedMessagePreview,
	RTCMessageMeta,
	RawMessageListResponse,
	MessageListResponse,
	GetMessagesRequest
} from './model/types/chat.types/chat.types';

// ─── ЧАТЫ: ОСНОВНЫЕ ТИПЫ ──────────────────────────────────────────────
export type { Chat } from './model/types/chat.types/chat.types';
export { ChatType } from './model/types/chat.types/chat.types';

// ─── API: СПИСОК ЧАТОВ ────────────────────────────────────────────────
export type {
	ChatListResponse,
	GetChatsRequest
} from './model/types/chat.types/chat.types';

// ─── UI-ХЕЛПЕРЫ (для UserCard, списков) ───────────────────────────────
export type {
	ChatItemInfo,
	ChatItemSchema
} from './model/types/chat.types/chat.types';

// ─── ЭНУМЫ: СООБЩЕНИЯ ─────────────────────────────────────────────────
export {
	MessageType,
	MessageStatus
} from './model/types/chat.types/chat.types';

// ─── ЭНУМЫ: СИСТЕМНЫЕ СОБЫТИЯ ─────────────────────────────────────────
export { SystemEventType } from './model/types/chat.types/chat.types';

// ─── СИСТЕМНЫЕ СООБЩЕНИЯ: ТИПЫ ДАННЫХ ─────────────────────────────────
export type {
	SystemEventPayload,
	ChatCreatedData,
	MemberJoinedData,
	MemberInvitedData,
	MemberLeftData,
	MemberKickedData,
	ChatNameChangedData,
	MessagePinnedData,
	SystemEventData,
	SystemMessageData
} from './model/types/chat.types/chat.types';

// ─── КОНТАКТЫ: ЗАПРОСЫ/ОТВЕТЫ (для добавления контакта) ───────────────
export type {
	AddContactByPhoneRequest,
	AddContactResponse
} from './model/types/chat.types/chat.types';

// ─── УТИЛИТЫ ─────────────────────────────────────────────────────────
// Экспортируем как значения (не type), т.к. это функции
export {
	getFilesSummary,
	parseIsoDateToTimestamp
} from './model/types/chat.types/chat.types';

// ─── СООБЩЕНИЯ: ДЛЯ ПОИСКА (useMessageSearch) ─────────────────────────
export type {
	BaseSearchMessage,
	TextMessage,
	Message
} from './model/types/chat.types/chat.types';

export { mapChatToUserCard } from './model/mapper/mapChatType/chatMapper';

export {
	chatApi,
	useGetChatsQuery,
	useGetChatByIdQuery,
	useLazyGetChatsQuery
} from './api/chatApi';
