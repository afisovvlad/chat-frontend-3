import { Chat } from '@/entities/Chat';

/**
 * Сортирует чаты по приоритету:
 * 1. Непрочитанные (new_message_count > 0)
 * 2. Прочитанные с сообщениями (по времени последнего сообщения)
 * 3. Без сообщений (по last_activity_at)
 */

export const sortChatsByLastMessage = (chats: Chat[]): Chat[] => {
	return [...chats].sort((a, b) => {
		// 1. Приоритет непрочитанных
		const aUnread = (a.new_message_count ?? 0) > 0;
		const bUnread = (b.new_message_count ?? 0) > 0;

		if (aUnread && !bUnread) {
			return -1;
		} // A выше (непрочитанный)
		if (!aUnread && bUnread) {
			return 1;
		} // B выше (непрочитанный)

		// Если оба непрочитанные или оба прочитанные → сортируем внутри группы
		const hasMessage = (chat: Chat): boolean => !!chat.last_message?.content;
		const aHasMsg = hasMessage(a);
		const bHasMsg = hasMessage(b);

		// 2. Приоритет чатов с сообщениями над пустыми
		if (aHasMsg && !bHasMsg) {
			return -1;
		}
		if (!aHasMsg && bHasMsg) {
			return 1;
		}

		//  3. Сортировка по времени внутри одной группы
		const getTime = (chat: Chat): number => {
			if (chat.last_message?.updated_at) {
				return chat.last_message.updated_at;
			}
			if (chat.last_message?.created_at) {
				return chat.last_message.created_at;
			}
			return chat.last_activity_at ?? 0;
		};

		const timeA = getTime(a);
		const timeB = getTime(b);

		// DESC: новые сверху
		return timeB - timeA;
	});
};
