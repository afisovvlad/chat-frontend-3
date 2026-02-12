import type { Chat, ChatMessage } from '../../model/types/chat.types';
import type { IUserCard } from '@/shared/ui/UserCard';
import { ChatType as UserCardChatType } from '../../model/types/chat.types';

const mapChatType = (type: string): UserCardChatType | undefined => {
	switch (type) {
		case 'chat':
			return UserCardChatType.CHAT;
		case 'public-group':
			return UserCardChatType.PUBLIC_GROUP;
		case 'private-group':
			return UserCardChatType.PRIVATE_GROUP;
		case 'public-channel':
			return UserCardChatType.PUBLIC_CHANNEL;
		case 'private-channel':
			return UserCardChatType.PRIVATE_CHANNEL;
		case 'group':
			return UserCardChatType.GROUP;
		case 'channel':
			return UserCardChatType.CHANNEL;
		default:
			return undefined;
	}
};

const mapLastMessage = (
	message: ChatMessage | null
): IUserCard['last_message'] => {
	if (!message) {
		return undefined;
	}

	return {
		id: message.id,
		uid: message.uid,
		from_user: message.from_user,
		content: message.content,
		files_summary: message.files_summary
			? {
					types: message.files_summary.types,
					count: message.files_summary.count
				}
			: { types: [], count: 0 },
		has_replied_message: message.has_replied_message,
		has_forwarded_message: message.has_forwarded_message,
		new: message.new,
		created_at: message.created_at,
		updated_at: message.updated_at
	};
};

/**
 * Маппинг данных чата из API в формат UserCard
 */
export const mapChatToUserCard = (chat: Chat): IUserCard => {
	const chatData = chat.chat;
	const chatName = chat.name || '';

	// Определяем имя для отображения
	let firstName = '';
	let lastName = '';
	let nickname = chatName;

	// Если это личный чат и есть данные пользователя
	if (!chat.is_group) {
		firstName = chatData.first_name || '';
		lastName = chatData.last_name || '';
		nickname = chatData.nickname || chatName;
	} else {
		// Для групповых чатов используем название чата
		// Передаём название в first_name для отображения
		firstName = chatName;
		lastName = '';
		nickname = chatName;
	}

	return {
		user: {
			uid: chatData.uid,
			username: chatData.username || undefined,
			nickname: nickname,
			first_name: firstName,
			last_name: lastName,
			avatar: chatData.avatar_url || undefined,
			avatar_url: chatData.avatar_url || undefined,
			avatar_webp: chatData.avatar_webp_url || undefined,
			avatar_webp_url: chatData.avatar_webp_url || undefined,
			is_online: chatData.is_online,
			was_online_at: chatData.was_online_at || undefined
		},
		notifications: chat.notifications,
		new_message_count: chat.new_message_count,
		chat_type: mapChatType(chat.chat_type),
		chat_key: chat.chat_key,
		last_message: chat.last_message
			? mapLastMessage(chat.last_message)
			: undefined
	};
};
