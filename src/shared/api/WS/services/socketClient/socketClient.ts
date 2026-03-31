import type { WSRequest, WSResponse } from '@/shared/api/WS/types/wsTypes';
import { chatApi } from '@/entities/Chat/api/chatApi';
import { mapApiMessageToFrontend } from '@/entities/Chat/model/mapper/mapChatType/chatMapper';
import type { AppDispatch } from '@/app/providers/StoreProvider/config/store';
import { ChatMessage, RawApiChatMessage } from '@/entities/Chat';
import { MESSAGES_PAGE_SIZE, MESSAGES_ORDERING } from '@/shared/model';

let isConnecting = false;
let connectPromise: Promise<WebSocket> | null = null;
let socket: WebSocket | null = null;

// ─────────────────────────────────────────────────────────────
//  НОВОЕ: Модульные переменные для интеграции с Redux
// ─────────────────────────────────────────────────────────────

/**
 * Dispatch Redux store для обновления кэша при получении сообщений через WebSocket.
 * Устанавливается через initWSHandlers() при инициализации приложения.
 */
let wsDispatch: AppDispatch | null = null;

/**
 * UID текущего авторизованного пользователя.
 * Нужен для определения: "я отправитель или получатель?" при обновлении кэша.
 * Обновляется через setWSCurrentUserId() при изменении авторизации.
 */
let currentUserId: string | null = null;

const subscribers = new Map<string, Set<(data: WSResponse) => void>>();
const pendingRequests = new Map<string, (response: WSResponse) => void>();

let currentToken: string | null = null;
let tokenExpiry = 0;

let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 1000;

// ─────────────────────────────────────────────────────────────
//  НОВОЕ: Функции инициализации обработчиков
// ─────────────────────────────────────────────────────────────

/**
 * Инициализирует обработчики WebSocket, сохраняя Redux dispatch.
 * Вызывается один раз при старте приложения (например, в StoreProvider).
 * @param dispatch - Redux dispatch из store
 */

export const initWSHandlers = (dispatch: AppDispatch) => {
	wsDispatch = dispatch;
};

/**
 * Обновляет UID текущего пользователя в модуле сокета.
 * Вызывается при авторизации/смене пользователя, чтобы корректно
 * определять направление сообщений при обновлении кэша.
 * @param userId - UID пользователя или null при выходе
 */

export const setWSCurrentUserId = (userId: string | null) => {
	currentUserId = userId;
};

// ─────────────────────────────────────────────────────────────
//  НОВОЕ: Обработка входящих сообщений для обновления кэша
// ─────────────────────────────────────────────────────────────

/**
 * Обрабатывает входящее сообщение типа 'create_text_message':
 * 1. Определяет, какой чат затронут (личный или групповой)
 * 2. Вычисляет queryUserUid — ключ для поиска нужного кэша в RTK Query
 * 3. Обновляет кэш через updateQueryData, добавляя новое сообщение
 *
 * Использует константы MESSAGES_PAGE_SIZE/MESSAGES_ORDERING для
 * точного совпадения с аргументами запросов в ChatView/MessagesList.
 */

const handleIncomingMessage = (response: WSResponse) => {
	// Фильтруем только нужные действия
	if (response.action !== 'create_text_message') {
		return;
	}

	if (!response.object) {
		return;
	}

	// Пропускаем, если обработчики ещё не инициализированы
	if (!wsDispatch) {
		return;
	}

	const rawMessage = response.object as RawApiChatMessage;

	// ─── Извлечение UID (поддержка разных форматов от бэка) ───
	const fromUid =
		typeof rawMessage.from_user === 'string'
			? rawMessage.from_user
			: rawMessage.from_user?.uid;

	const toUid =
		typeof rawMessage.to_user === 'string'
			? rawMessage.to_user
			: rawMessage.to_user?.uid;

	// ─── НОВОЕ: Определение queryUserUid для поиска кэша ───
	/**
	 * queryUserUid — это значение, которое используется как user_uid
	 * в аргументах запроса getMessages. Должно точно совпадать,
	 * иначе RTK Query не найдёт нужный кэш для обновления.
	 */
	let queryUserUid: string | undefined;

	if (rawMessage.chat_type !== 'chat' && rawMessage.chat_key) {
		// Группы/каналы: используем chat_key
		queryUserUid = rawMessage.chat_key;
	} else if (rawMessage.chat_type === 'chat' || !rawMessage.chat_key) {
		// Личные чаты: берём UID собеседника (не свой!)
		if (toUid && toUid !== currentUserId) {
			queryUserUid = toUid; // Я получатель → ключ = отправитель
		} else if (fromUid && fromUid !== currentUserId) {
			queryUserUid = fromUid; // Я отправитель → ключ = получатель
		}
	}

	// ─── НОВОЕ: Обновление кэша через RTK Query ───
	if (queryUserUid) {
		wsDispatch(
			chatApi.util.updateQueryData(
				'getMessages',
				{
					user_uid: queryUserUid,
					//  Важно: те же константы, что в ChatView/MessagesList!
					page_size: MESSAGES_PAGE_SIZE,
					ordering: MESSAGES_ORDERING
				},
				draft => {
					if (!draft?.results) {
						console.warn('⚠️ No draft.results');
						return;
					}

					// Проверяем, нет ли уже такого сообщения (защита от дублей)
					const exists = draft.results.some(
						(m: ChatMessage) => m.uid === rawMessage.uid
					);

					if (!exists && rawMessage.uid) {
						// Маппим сырой ответ бэка в формат фронтенда
						const mapped = mapApiMessageToFrontend(rawMessage);
						// Добавляем в начало списка (новые сверху)
						draft.results.unshift(mapped);
					}
				}
			)
		);
	} else {
		console.warn('⚠️ Could not determine queryUserUid', {
			chat_type: rawMessage.chat_type,
			chat_key: rawMessage.chat_key,
			fromUid,
			toUid,
			currentUserId
		});
	}
};

// ─────────────────────────────────────────────────────────────
//  СТАРЫЕ функции (без изменений)
// ─────────────────────────────────────────────────────────────

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

const ensureFreshToken = async (): Promise<string> => {
	if (currentToken && Date.now() < tokenExpiry) {
		return currentToken;
	}
	const token = await getAccessToken();
	if (!token) {
		throw new Error('No token');
	}
	currentToken = token;
	tokenExpiry = Date.now() + 9 * 60 * 1000;
	return token;
};

const setupSocket = async (): Promise<WebSocket> => {
	const token = await ensureFreshToken();

	if (socket && socket.readyState === WebSocket.OPEN) {
		return socket;
	}

	if (isConnecting) {
		return await connectPromise!;
	}

	if (socket && socket.readyState === WebSocket.CONNECTING) {
		socket.close();
	}

	connectPromise = new Promise((resolve, reject) => {
		isConnecting = true;
		const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}?authorization=${encodeURIComponent(token)}`;
		socket = new WebSocket(wsUrl);

		socket.onopen = () => {
			//  Устанавливаем onmessage один раз при подключении
			socket!.onmessage = event => {
				try {
					const response: WSResponse = JSON.parse(event.data);

					// 1. Обработка ожидающих запросов (request/response)
					const pendingCb = pendingRequests.get(response.request_uid);
					if (pendingCb) {
						pendingCb(response);
						pendingRequests.delete(response.request_uid);
						return;
					}

					// 2.  НОВОЕ: Обработка для кэша (наша новая логика)
					handleIncomingMessage(response);

					// 3. Обработка подписок (pub/sub)
					subscribers.get(response.action)?.forEach(cb => cb(response));
				} catch (err) {
					console.error('❌ WS onmessage error:', err);
				}
			};

			isConnecting = false;
			connectPromise = null;
			resolve(socket!);
		};

		socket.onerror = () => {
			isConnecting = false;
			connectPromise = null;
			socket = null;
			reject(new Error('WS connection failed'));

			if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
				reconnectAttempts++;
				setTimeout(() => {
					setupSocket();
				}, RECONNECT_DELAY * reconnectAttempts);
			}
		};

		socket.onclose = e => {
			if (socket && socket.readyState !== WebSocket.OPEN) {
				socket = null;
			}
			pendingRequests.forEach((rejectCb, uid) => {
				rejectCb({
					request_uid: uid,
					action: 'error',
					status: 'error'
				} as WSResponse);
			});
			pendingRequests.clear();
			subscribers.clear();
			isConnecting = false;
			connectPromise = null;
			if (e.code !== 1000) {
				reject(new Error(`WS closed: ${e.code}`));
			}
		};
	});

	return connectPromise;
};

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

export const sendWS = async <T = WSResponse>(
	request: WSRequest
): Promise<T | undefined> => {
	try {
		const ws = await setupSocket();
		if (!ws || ws.readyState !== WebSocket.OPEN) {
			throw new Error('WS not connected');
		}
		return new Promise((resolve, reject) => {
			const requestUid = request.request_uid ?? crypto.randomUUID();
			const requestWithUid = { ...request, request_uid: requestUid };
			pendingRequests.set(requestUid, resolve as (res: WSResponse) => void);
			ws.send(JSON.stringify(requestWithUid));
			const timeoutId = setTimeout(() => {
				if (pendingRequests.has(requestUid)) {
					pendingRequests.delete(requestUid);
					reject(new Error(`Timeout: ${request.action}`));
				}
			}, 10000);
			const originalResolve = pendingRequests.get(requestUid);
			if (originalResolve) {
				pendingRequests.set(requestUid, (res: WSResponse) => {
					clearTimeout(timeoutId);
					originalResolve(res);
				});
			}
		});
	} catch (error) {
		throw error;
	}
};

export const disconnectWS = () => {
	socket?.close();
	socket = null;
	currentToken = null;
	subscribers.clear();
	pendingRequests.clear();
};

// Helpers
export const connectChat = () => sendWS({ action: '_connect' });

export const createTextMessageForChat = (chatKey: string, content: string) =>
	sendWS({
		action: 'create_text_message',
		object: { chat_key: chatKey, content }
	});

export const addMembersToChat = (chatKey: string, uids: string[]) =>
	sendWS({
		action: 'add_members_to_chat',
		object: { chat_key: chatKey, uid_users_list: uids }
	});
