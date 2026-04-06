import {
	ChatType,
	SendMessageParams
} from '../../../types/chat.types/chat.types';
import { sendWS } from '@/shared/api/WS/services/socketClient/socketClient';

// ─────────────────────────────────────────────────────────────
//  Типы для WebSocket payload
// ─────────────────────────────────────────────────────────────

interface WSMessagePayload {
	action: 'create_text_message';
	request_uid: string;
	object: {
		content: string;
		status: 'publish';
		files: Array<{ filename: string; data: string; type?: string }>;
		replied_messages: string[];
		forwarded_messages: string[];
		to_user_uid?: string;
		chat_key?: string;
	};
}

// ─────────────────────────────────────────────────────────────
//  Генератор UUID для request_uid (фоллбэк для старых браузеров)
// ─────────────────────────────────────────────────────────────

const generateRequestId = (): string => {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

// ─────────────────────────────────────────────────────────────
//  Основная функция отправки
// ─────────────────────────────────────────────────────────────

export async function sendMessage(
	chatUid: string, // ← Для личных чатов: UID собеседника
	chatType: ChatType,
	params: SendMessageParams,
	currentUserId: string,
	chatKey?: string // ← Опционально, для групп
): Promise<void> {
	const payload: WSMessagePayload = {
		action: 'create_text_message',
		request_uid: generateRequestId(),
		object: {
			content: params.content ?? '',
			status: 'publish',
			files: params.files ?? [],
			replied_messages: params.replyIds ?? [],
			forwarded_messages: params.forwardIds ?? []
		}
	};

	if (chatType === ChatType.CHAT) {
		payload.object.to_user_uid = chatUid;
		payload.object.chat_key = undefined;
	} else {
		// Группа/канал: chat_key
		payload.object.chat_key = chatKey || chatUid;
		payload.object.to_user_uid = undefined;
	}

	return sendWS(payload);
}
