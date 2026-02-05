import type { WSRequest, WSResponse } from '@/shared/api/WS/types/wsTypes';

let socket: WebSocket | null = null;
const subscribers = new Map<string, Set<(data: WSResponse) => void>>();
const pendingRequests = new Map<string, (response: WSResponse) => void>();

let currentToken: string | null = null;
let tokenExpiry = 0; // 9 мин TTL

// получение токена
const getAccessToken = async (): Promise<string | null> => {
	try {
		const res = await fetch('/api/auth/getAccessToken', {
			method: 'GET',
			cache: 'no-store'
		});
		if (!res.ok) {
			return null;
		}
		const data = await res.json();
		return data.accessToken ?? null;
	} catch {
		return null;
	}
};

// Обновление токена (вызывается перед созданием сокета)
const ensureFreshToken = async (): Promise<string> => {
	if (currentToken && Date.now() < tokenExpiry) {
		return currentToken;
	}

	const token = await getAccessToken();
	if (!token) {
		throw new Error('No token');
	}

	currentToken = token;
	tokenExpiry = Date.now() + 9 * 60 * 1000; // 9 минут
	return token;
};

// Создание/пересоздание WebSocket
const setupSocket = async (): Promise<WebSocket> => {
	const token = await ensureFreshToken();

	// Если уже открыт — возвращаем текущий сокет
	if (socket && socket.readyState === WebSocket.OPEN) {
		return socket;
	}

	// Закрываем старый, если сокет завис в состоянии CONNECTING
	if (socket && socket.readyState === WebSocket.CONNECTING) {
		// дадим ему умереть, но создадим новый
		socket.close();
	}

	const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?authorization=${encodeURIComponent(token)}`;
	socket = new WebSocket(wsUrl);

	return new Promise((resolve, reject) => {
		socket!.onopen = () => {
			// Глобальный обработчик сообщений
			socket!.onmessage = event => {
				try {
					const response: WSResponse = JSON.parse(event.data);

					// 1. pendingRequests (ответы на sendWS)
					const pendingCb = pendingRequests.get(response.request_uid);
					if (pendingCb) {
						pendingCb(response);
						pendingRequests.delete(response.request_uid);
						return;
					}

					// 2. subscribers по action
					subscribers.get(response.action)?.forEach(cb => cb(response));
				} catch (e) {
					console.error('WS parse error', e);
				}
			};

			resolve(socket!);
		};

		socket!.onerror = () => {
			socket = null;
			reject(new Error('WS connection failed'));
		};

		socket!.onclose = e => {
			if (socket && socket.readyState !== WebSocket.OPEN) {
				socket = null;
			}

			// если закрытие произошло до onopen
			if (e.code !== 1000) {
				reject(new Error(`WS closed: ${e.code}`));
			}
		};
	});
};

// Подписка по action
export const subscribeWS = <T = WSResponse>(
	action: string,
	callback: (data: T) => void
): (() => void) => {
	if (!subscribers.has(action)) {
		subscribers.set(action, new Set());
	}
	subscribers.get(action)!.add(callback as (data: WSResponse) => void);

	return () => {
		subscribers.get(action)?.delete(callback as (data: WSResponse) => void);
		if (subscribers.get(action)?.size === 0) {
			subscribers.delete(action);
		}
	};
};

// Отправка запроса с ожиданием ответа по request_uid
export const sendWS = async <T = WSResponse>(
	request: WSRequest
): Promise<T> => {
	const ws = await setupSocket();

	if (!ws || ws.readyState !== WebSocket.OPEN) {
		throw new Error('WS not connected');
	}

	return new Promise((resolve, reject) => {
		const requestUid = crypto.randomUUID();
		request.request_uid = requestUid;
		pendingRequests.set(requestUid, resolve as (res: WSResponse) => void);

		ws.send(JSON.stringify(request));

		// Таймаут ответа
		const timeoutId = setTimeout(() => {
			if (pendingRequests.has(requestUid)) {
				pendingRequests.delete(requestUid);
				reject(new Error(`Timeout: ${request.action}`));
			}
		}, 10000);

		// На случай, если resolve вызовут до таймаута
		const originalResolve = pendingRequests.get(requestUid);
		if (originalResolve) {
			pendingRequests.set(requestUid, (res: WSResponse) => {
				clearTimeout(timeoutId);
				originalResolve(res);
			});
		}
	});
};

// Отключение и cleanup
export const disconnectWS = () => {
	socket?.close();
	socket = null;
	currentToken = null;
	subscribers.clear();
	pendingRequests.clear();
};

// Helpers для ваших actions (TEST)
export const connectChat = () =>
	sendWS({
		action: '_connect'
	});

export const createTextMessage = (chatKey: string, text: string) =>
	sendWS({
		action: 'create_text_message',
		object: { chat_key: chatKey, text }
	});

export const addMembersToChat = (chatKey: string, uids: string[]) =>
	sendWS({
		action: 'add_members_to_chat',
		object: { chat_key: chatKey, uid_users_list: uids }
	});
