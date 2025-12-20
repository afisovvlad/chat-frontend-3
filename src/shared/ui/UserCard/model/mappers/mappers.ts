import { BlackListSchema } from '@/entities/BlackList';
import { ChatItemSchema } from '@/entities/Chat';
import { ContactsSchema } from '@/entities/Contacts/model';
import { IUserCard } from '../types/IUserCard';

export const mapChatToUserCard = (user: ChatItemSchema): IUserCard => ({
	user: {
		uid: user.chat.uid,
		username: user.chat.username,
		nickname: user.chat.nickname,
		first_name: user.chat.first_name,
		last_name: user.chat.last_name,
		avatar: user.chat.avatar,
		avatar_url: user.chat.avatar_url,
		avatar_webp: user.chat.avatar_webp,
		avatar_webp_url: user.chat.avatar_webp_url,
		is_online: user.chat.is_online,
		was_online_at: user.chat.was_online_at
	},
	notifications: user.notifications,
	new_message_count: user.new_message_count,
	chat_type: user.chat_type,
	chat_key: user.chat_key,
	last_message: user.last_message
});

export const mapContactToUserCard = (user: ContactsSchema): IUserCard => ({
	user: {
		uid: user.uid,
		first_name: user.first_name,
		last_name: user.last_name,
		avatar: user.system_contact.avatar,
		avatar_url: user.system_contact.avatar_url,
		avatar_webp: user.system_contact.avatar_webp,
		avatar_webp_url: user.system_contact.avatar_webp_url,
		is_online: user.system_contact.is_online,
		was_online_at: user.system_contact.was_online_at
	}
});

export const mapBlackListToUserCard = (user: BlackListSchema): IUserCard => ({
	user: {
		uid: user.uid,
		username: user.username,
		nickname: user.nickname,
		first_name: user.first_name,
		last_name: user.last_name,
		avatar: user.avatar,
		avatar_url: user.avatar_url,
		avatar_webp: user.avatar_webp,
		avatar_webp_url: user.avatar_webp_url,
		is_online: user.is_online,
		was_online_at: user.was_online_at
	}
});
