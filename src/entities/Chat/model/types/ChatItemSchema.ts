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

interface ChatItemInfo {
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

export enum ChatType {
	CHAT = 'chat',
	PUBLIC_GROUP = 'public-group',
	PRIVATE_GROUP = 'private-group',
	PUBLIC_CHANNEL = 'public-channel',
	PRIVATE_CHANNEL = 'private-channel'
}
