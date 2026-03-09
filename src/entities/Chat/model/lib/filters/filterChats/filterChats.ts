// import { Chat } from '@/entities/Chat';

// export function filterChatsLocal(items: Chat[], searchTerm: string): Chat[] {
// 	const term = searchTerm.toLowerCase().trim();
// 	if (!term) {
// 		return items;
// 	}

// 	return items.filter(item => {
// 		//  Быстрые и вероятные проверки (короткое замыкание)
// 		if (item.name.toLowerCase().includes(term)) {
// 			return true;
// 		}

// 		//  Поиск по последнему сообщению (перенесено раньше!)
// 		if (item.last_message?.content?.toLowerCase().includes(term)) {
// 			return true;
// 		}

// 		//  Поля пользователя — проверяем только если предыдущие не сработали
// 		const { chat } = item;

// 		// Без создания массива: короткое замыкание через ||
// 		if (
// 			chat.username?.toLowerCase().includes(term) ||
// 			chat.nickname?.toLowerCase().includes(term) ||
// 			chat.first_name?.toLowerCase().includes(term) ||
// 			chat.last_name?.toLowerCase().includes(term) ||
// 			chat.patronymic?.toLowerCase().includes(term)
// 		) {
// 			return true;
// 		}

// 		return false;
// 	});
// }
