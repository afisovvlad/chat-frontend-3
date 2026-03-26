import { sendWS } from '@/shared/api/WS/services/socketClient/socketClient';
import { SendMessageParams } from '../types/types';

// Безопасный генератор UUID (фоллбэк для старых браузеров)
const generateRequestId = (): string => {
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

export async function sendMessage(userUid: string, params: SendMessageParams) {
	return sendWS({
		action: 'create_text_message',
		request_uid: generateRequestId(),
		object: {
			to_user_uid: userUid,
			content: params.content ?? '',
			status: 'publish',
			files: params.files ?? [],
			replied_messages: params.replyIds ?? [],
			forwarded_messages: params.forwardIds ?? []
		}
	});
}
