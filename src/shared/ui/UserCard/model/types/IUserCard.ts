export interface IUserCard {
	user?: UserCardInfo;
	notifications?: boolean;
	new_message_count?: number;
	chat_type?: ChatType;
	chat_key?: string;
	last_message?: LastMessage;
	phone?: string;
}

interface UserCardInfo {
	uid: string;
	username?: string;
	nickname?: string;
	first_name: string;
	last_name: string;
	avatar: string;
	avatar_url: string;
	avatar_webp: string;
	avatar_webp_url: string;
	is_online: boolean;
	was_online_at: number;
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

enum ChatType {
	CHAT = 'chat',
	PUBLIC_GROUP = 'public-group',
	PRIVATE_GROUP = 'private-group',
	PUBLIC_CHANNEL = 'public-channel',
	PRIVATE_CHANNEL = 'private-channel'
}
