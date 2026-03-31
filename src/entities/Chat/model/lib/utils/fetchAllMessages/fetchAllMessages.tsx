import { MESSAGES_ORDERING, MESSAGES_PAGE_SIZE } from '@/shared/model';
import { ChatMessage } from '../../../types/chat.types/chat.types';

// ─────────────────────────────────────────────────────────────
//  ВСПОМОГАТЕЛЬНАЯ: преобразование URL в прокси-путь
// ─────────────────────────────────────────────────────────────

const toProxyPath = (path: string): string => {
	if (path.startsWith('/api/proxy')) {
		return path;
	}

	return path.replace(/^\/api\/v1/, '/api/proxy');
};

// ─────────────────────────────────────────────────────────────
//  ВНУТРЕННЯЯ ФУНКЦИЯ: загрузка одной страницы
// ─────────────────────────────────────────────────────────────

const fetchMessagesPage = async (
	userUid: string,
	page: number,
	options: {
		pageSize: number;
		ordering: '-created_at' | 'created_at';
	}
): Promise<{
	results: ChatMessage[];
	next: string | null;
	count: number;
} | null> => {
	const basePath = `/api/v1/chat/message/text/${userUid}/`;
	const proxyPath = toProxyPath(basePath);

	const params = new URLSearchParams({
		page_size: options.pageSize.toString(),
		ordering: options.ordering,
		page: page.toString()
	});

	try {
		const res = await fetch(`${proxyPath}?${params}`, {
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' }
		});

		if (!res.ok) {
			return null;
		}

		return await res.json();
	} catch (err) {
		return null;
	}
};

// ─────────────────────────────────────────────────────────────
//  ФУНКЦИЯ 1: Авто-подгрузка первых N страниц
// ─────────────────────────────────────────────────────────────

export const preloadChatPages = async (
	userUid: string,
	options?: {
		pagesToLoad?: number;
		ordering?: '-created_at' | 'created_at';
		pageSize?: number;
		startPage?: number;
	}
): Promise<{ results: ChatMessage[]; nextUrl: string | null }> => {
	const {
		pagesToLoad = 4,
		ordering = MESSAGES_ORDERING,
		pageSize = MESSAGES_PAGE_SIZE,
		startPage = 2
	} = options || {};

	const allResults: ChatMessage[] = [];
	let nextUrl: string | null = null;

	for (let page = startPage; page < startPage + pagesToLoad; page++) {
		const data = await fetchMessagesPage(userUid, page, { pageSize, ordering });

		if (!data) {
			break;
		}

		allResults.push(...data.results);

		if (data.next) {
			nextUrl = toProxyPath(data.next.replace(/^https?:\/\/[^/]+/, ''));
		} else {
			break;
		}

		if (page < startPage + pagesToLoad - 1) {
			await new Promise(resolve => setTimeout(resolve, 30));
		}
	}

	return { results: allResults, nextUrl };
};

// ─────────────────────────────────────────────────────────────
//  ФУНКЦИЯ 2: Загрузка ВСЕХ сообщений
// ─────────────────────────────────────────────────────────────

export const fetchAllChatMessages = async (
	userUid: string,
	options?: {
		ordering?: '-created_at' | 'created_at';
		maxPages?: number;
		pageSize?: number;
		onProgress?: (loaded: number, total: number | null) => void;
	}
): Promise<ChatMessage[]> => {
	const {
		ordering = '-created_at',
		maxPages = 30,
		pageSize = MESSAGES_PAGE_SIZE,
		onProgress
	} = options || {};

	const allMessages: ChatMessage[] = [];
	let page = 1;
	let totalCount: number | null = null;

	while (page <= maxPages) {
		const data = await fetchMessagesPage(userUid, page, { pageSize, ordering });

		if (!data) {
			break;
		}
		if (totalCount === null) {
			totalCount = data.count;
		}

		allMessages.push(...data.results);
		onProgress?.(allMessages.length, totalCount);

		if (!data.next) {
			break;
		}

		page++;
		await new Promise(resolve => setTimeout(resolve, 50));
	}

	return allMessages;
};
