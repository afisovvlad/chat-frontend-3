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
