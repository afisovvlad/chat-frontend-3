export interface ChatMessage {
	id: number;
	uid: string;
	from_user: string;
	content: string;
	files_summary: {
		types: string[];
		count: number;
	};
	has_replied_message: boolean;
	has_forwarded_message: boolean;
	new: boolean;
	created_at: number;
	updated_at: number;
}

export interface ChatUser {
	uid: string;
	username?: string;
	nickname?: string;
	first_name: string;
	last_name: string;
	patronymic?: string;
	avatar_url: string | null;
	avatar_webp_url: string | null;
	is_online: boolean;
	was_online_at: number;
	is_in_contacts: boolean;
	is_blocked: boolean;
}

export interface Chat {
	id: number;
	chat: ChatUser;
	is_group: boolean;
	is_favorite: boolean;
	notifications: boolean;
	new_message_count: number;
	name: string;
	chat_type: ChatType;
	chat_key: string;
	last_activity_at: number;
	last_seen_message: ChatMessage | null;
	last_message: ChatMessage | null;
	first_new_message: ChatMessage | null;
}

export interface ChatListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Chat[];
}

export interface GetChatsRequest {
	pageSize?: number;
	ordering?: string;
	page?: number;
	search?: string;
	isBlocked?: boolean;
	isFavorite?: boolean;
	isActive?: boolean;
}

export enum ChatType {
	CHAT = 'chat',
	GROUP = 'group',
	CHANNEL = 'channel',
	PUBLIC_GROUP = 'public-group',
	PRIVATE_GROUP = 'private-group',
	PUBLIC_CHANNEL = 'public-channel',
	PRIVATE_CHANNEL = 'private-channel'
}

export interface ChatItemInfo {
	uid: string;
	username: string;
	nickname: string;
	first_name: string;
	last_name: string;
	avatar: string;
	avatar_url: string;
	avatar_webp: string;
	avatar_webp_url: string;
	is_blocked: boolean;
	is_online: boolean;
	was_online_at: number;
	is_in_contacts: boolean;
}

interface LastMessage {
	id: number;
	uid: string;
	from_user: string;
	content: string;
	files_summary: {
		types: string[];
		count: number;
	};
	has_replied_message: boolean;
	has_forwarded_message: boolean;
	new: boolean;
	created_at: number;
	updated_at: number;
}

export interface ChatItemSchema {
	id: number;
	chat: ChatItemInfo;
	is_favorite: boolean;
	notifications: boolean;
	new_message_count: number;
	new_file_count: number; // пока что не пригодится
	name: string;
	chat_type: ChatType;
	chat_key: string;
	last_activity_at: number;
	last_seen_message: {
		id: number;
		uid: string;
	};
	first_new_message: {
		id: number;
		uid: string;
	};
	last_message: LastMessage;
}

// ============================================================================
// ОСНОВНЫЕ ТИПЫ СООБЩЕНИЙ
// ============================================================================

export enum MessageType {
	TEXT = 'text',
	IMAGE = 'image',
	VIDEO = 'video',
	AUDIO = 'audio',
	FILE = 'file',
	SYSTEM = 'system'
}

export enum MessageStatus {
	//  Уникальные значения — отражают реальное состояние в домене
	RECEIVED = 'received', //  Входящее (от другого пользователя)
	SENDING = 'sending', //  Отправляется
	SENT = 'sent', // ✓ Отправлено на сервер
	DELIVERED = 'delivered', // ✓✓ Доставлено собеседнику
	READ = 'read', // ✓✓✓ Прочитано
	ERROR = 'error' //  Ошибка отправки
}

// ============================================================================
// СИСТЕМНЫЕ СОБЫТИЯ
// ============================================================================

export enum SystemEventType {
	// Даты и временные метки
	DATE_SEPARATOR = 'date_separator',

	// Создание/удаление чата/канала
	CHAT_CREATED = 'chat_created',
	CHANNEL_CREATED = 'channel_created',
	CHAT_DELETED = 'chat_deleted',

	// Действия с участниками
	MEMBER_JOINED = 'member_joined',
	MEMBER_LEFT = 'member_left',
	MEMBER_KICKED = 'member_kicked',
	MEMBER_INVITED = 'member_invited',

	// Изменения в чате
	CHAT_NAME_CHANGED = 'chat_name_changed',
	CHAT_PHOTO_CHANGED = 'chat_photo_changed',
	MESSAGE_PINNED = 'message_pinned',
	MESSAGE_UNPINNED = 'message_unpinned',

	// Права доступа
	PERMISSIONS_CHANGED = 'permissions_changed',
	ADMIN_ADDED = 'admin_added',
	ADMIN_REMOVED = 'admin_removed'
}

// ============================================================================
// БАЗОВЫЕ ИНТЕРФЕЙСЫ
// ============================================================================

export interface BaseMessage {
	id: string;
	type: MessageType;
	createdAt: Date;
	updatedAt?: Date;
}

// ============================================================================
// СООБЩЕНИЯ ПОЛЬЗОВАТЕЛЕЙ
// ============================================================================

// src/entities/Chat/model/types/chat.types/chat.types.ts

export interface TextMessage extends BaseMessage {
	type: MessageType.TEXT;
	content: string;
	senderId: string;
	senderName: string;
	status: MessageStatus;
	isEdited?: boolean;

	// Поля для реплаев и пересылок (опциональные)
	has_replied_message?: boolean;
	has_forwarded_message?: boolean;

	//  Данные о сообщении, на которое отвечают
	replyTo?: {
		id: string;
		text: string;
		senderName?: string;
	};

	//  Данные о пересланном сообщении
	forwardedFrom?: {
		chatName: string;
		author: string;
		messageText?: string;
	};

	//  Вложения (файлы, изображения и т.д.)
	files_summary?: {
		types: string[];
		count: number;
	};

	// Флаг нового сообщения (для бейджа)
	new?: boolean;
}

// ============================================================================
// ДАННЫЕ СИСТЕМНЫХ СОБЫТИЙ (Payload)
// ============================================================================

// Создание чата/канала
export interface ChatCreatedData {
	chatId: string;
	chatKey: string;
	name: string;
	description?: string;
	chatType: ChatType; // ✅ Используем enum
	createdBy: string;
	ownerFullName: string;
	avatar?: {
		filename: string;
		url: string;
		webpUrl?: string;
		smallUrl?: string;
		masterUrl?: string;
	};
	addedUsers?: Array<{
		uid: string;
		fullName: string;
	}>;
}

// Присоединение участника
export interface MemberJoinedData {
	userId: string;
	userName: string;
	joinType: 'self' | 'invited' | 'added';
	inviterId?: string;
	inviterName?: string;
}

// Приглашение участника
export interface MemberInvitedData {
	inviterId: string;
	inviterName: string;
	invitedUserId: string;
	invitedUserName: string;
}

// Выход участника
export interface MemberLeftData {
	userId: string;
	userName: string;
	leaveType: 'voluntary' | 'kicked';
	kickerId?: string;
	kickerName?: string;
}

// Исключение участника
export interface MemberKickedData {
	userId: string;
	userName: string;
	kickerId: string;
	kickerName: string;
	reason?: string;
}

// Изменение названия чата
export interface ChatNameChangedData {
	oldName: string;
	newName: string;
	changedByUserId: string;
	changedByUserName: string;
}

// Закрепление сообщения
export interface MessagePinnedData {
	messageId: string;
	pinnedByUserId: string;
	pinnedByUserName: string;
	messageContent: string;
}

// Временная метка (разделитель дат)
export interface DateSeparatorData {
	date: Date;
	label: string;
}

// ============================================================================
// ОБЪЕДИНЁННЫЙ ТИП ДАННЫХ СОБЫТИЯ (Discriminated Union)
// ============================================================================

export type SystemEventData =
	| { type: SystemEventType.CHAT_CREATED; payload: ChatCreatedData }
	| { type: SystemEventType.CHANNEL_CREATED; payload: ChatCreatedData }
	| { type: SystemEventType.MEMBER_JOINED; payload: MemberJoinedData }
	| { type: SystemEventType.MEMBER_INVITED; payload: MemberInvitedData }
	| { type: SystemEventType.MEMBER_LEFT; payload: MemberLeftData }
	| { type: SystemEventType.MEMBER_KICKED; payload: MemberKickedData }
	| { type: SystemEventType.CHAT_NAME_CHANGED; payload: ChatNameChangedData }
	| { type: SystemEventType.MESSAGE_PINNED; payload: MessagePinnedData }
	| { type: SystemEventType.DATE_SEPARATOR; payload: DateSeparatorData };

// ============================================================================
// СИСТЕМНОЕ СООБЩЕНИЕ
// ============================================================================

export interface SystemMessageData extends BaseMessage {
	type: MessageType.SYSTEM;
	eventType: SystemEventType;
	eventData: SystemEventData;
}

// ============================================================================
// ОБЪЕДИНЁННЫЙ ТИП СООБЩЕНИЯ
// ============================================================================

export type Message = TextMessage | SystemMessageData;

// ============================================================================
// МЕТАДАННЫЕ ЧАТА
// ============================================================================

export interface ChatMetadata {
	id: string;
	name: string;
	type: ChatType;
	createdAt: Date;
	updatedAt: Date;
	participantsCount: number;
	lastActivityAt: Date;
	isArchived: boolean;
}

// Журнал событий (event log)
export interface ChatEventLog {
	id: string;
	chatId: string;
	eventType: SystemEventType;
	eventData: SystemEventData;
	timestamp: Date;
	actorId?: string;
	actorName?: string;
}
