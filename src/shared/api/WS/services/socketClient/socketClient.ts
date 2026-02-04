import { WSRequest, WSResponse } from '@/shared/api/WS/types/wsTypes';

let socket: WebSocket | null = null;
const subscribers = new Map<string, Set<(data: WSResponse) => void>>();
const pendingRequests = new Map<string, (response: WSResponse) => void>();

const getAccessToken = async (): Promise<string | null> => {
	try {
		const res = await fetch('/api/auth/getAccessToken', { method: 'GET' });
		if (!res.ok) {
			return null;
		}

		const data = await res.json();

		return data.accessToken ?? null;
	} catch {
		return null;
	}
};

// функция создания нового ws, а если ws уже есть - возвращает существующий
// export const createSocket = async () => {
// 	if (socket?.readyState === WebSocket.OPEN) {
// 		return socket;
// 	}

// 	const accessToken = await getAccessToken();

// 	if (!accessToken) {
// 		throw new Error('No access token');
// 	}

// 	if (!socket || socket.readyState === WebSocket.CLOSED) {
// 		socket = new WebSocket(
// 			`${process.env.NEXT_PUBLIC_WS_URL}?authorization=${accessToken}`
// 		);

// 		socket.onopen = () => {
// 			setupGlobalMessageHandler();
// 		};
// 	}
// 	return socket;
// };

export const createSocket = async (): Promise<WebSocket> => {
	const accessToken = await getAccessToken();

	if (!accessToken) {
		throw new Error('No token');
	}

	// Если уже OPEN — сразу возвращаем
	if (socket?.readyState === WebSocket.OPEN) {
		return socket!;
	}

	// Возвращаем Promise, который ждет onopen
	return new Promise((resolve, reject) => {
		if (socket?.readyState === WebSocket.OPEN) {
			resolve(socket!);
			return;
		}

		const ws = new WebSocket(
			`${process.env.NEXT_PUBLIC_WS_URL}?authorization=${accessToken}`
		);

		ws.onopen = () => {
			socket = ws;
			setupGlobalMessageHandler();
			resolve(ws); // ✅ Теперь точно OPEN!
		};

		ws.onclose = e => {
			socket = null;
			reject(new Error(`WS closed: ${e.code}`));
		};

		ws.onerror = reject;
	});
};

const setupGlobalMessageHandler = () => {
	if (!socket || socket.onmessage) {
		// уже настроен
		return;
	}

	socket.onmessage = event => {
		try {
			// парсинг новых данных
			const response: WSResponse = JSON.parse(event.data);

			// 1. Pending requests (sendWS)
			const pendingCallback = pendingRequests.get(response.request_uid);
			if (pendingCallback) {
				pendingCallback(response);
				pendingRequests.delete(response.request_uid);
				return;
			}

			// 2. Подписки по action (subscribeWS)
			subscribers.get(response.action)?.forEach(cb => cb(response));
		} catch (e) {
			console.error('WS parse error', e);
		}
	};
};

// подписки на всевозможные actions
export const subscribeWS = (
	action: string,
	callback: (data: WSResponse) => void
) => {
	if (!subscribers.has(action)) {
		subscribers.set(action, new Set());
	}
	subscribers.get(action)!.add(callback);

	return () => {
		subscribers.get(action)?.delete(callback);
		if (subscribers.get(action)?.size === 0) {
			subscribers.delete(action);
		}
	};
};

export const sendWS = async (request: WSRequest): Promise<WSResponse> => {
	const ws = await createSocket();

	// if (!ws || ws.readyState !== WebSocket.OPEN) {
	if (!ws) {
		throw new Error('WS not connected');
	}

	return new Promise((resolve, reject) => {
		const requestUid = crypto.randomUUID();
		request.request_uid = requestUid;
		pendingRequests.set(requestUid, resolve);

		ws.send(JSON.stringify(request));

		setTimeout(() => {
			if (pendingRequests.has(requestUid)) {
				pendingRequests.delete(requestUid);
				reject(new Error('WS request timeout'));
			}
		}, 10000);
	});
};
