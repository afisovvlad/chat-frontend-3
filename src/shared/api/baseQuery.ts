import { RootState } from '@/app/providers/StoreProvider';
import { authActions } from '@/features/auth';
import {
	BaseQueryFn,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';
import { getAccessToken } from './services/getAccessToken/getAccessToken';
import { getRefreshToken } from './services/getRefreshToken/getRefreshToken';

// Интерсептор 1: добавление accessToken в заголовок
const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_BASE_API as string,
	prepareHeaders: async headers => {
		const accessToken = await getAccessToken();
		if (accessToken) {
			headers.set('Authorization', `Bearer ${accessToken}`);
		}
		return headers;
	}
});

// Интерсептор 2: refresh при 401
const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	const result = await baseQuery(args, api, extraOptions);

	if (result.error && result.error.status === 401) {
		const state = api.getState() as RootState;

		// Ждем завершения текущего refresh, чтобы избежать состояния гонки
		if (state.auth?.isRefreshing) {
			await new Promise(resolve => {
				const check = () => {
					if (!state.auth?.isRefreshing) {
						resolve(true);
					} else {
						setTimeout(check, 50);
					}
				};
				check();
			});
			return baseQuery(args, api, extraOptions);
		}

		api.dispatch(authActions.setRefreshing(true));

		try {
			const refreshToken = await getRefreshToken();

			const refreshResult = await baseQuery(
				{
					url: '/auth/refresh/',
					method: 'POST',
					body: { refresh: refreshToken }
				},
				api,
				extraOptions
			);

			if (refreshResult.error) {
				throw refreshResult.error;
			}

			// Повторяем с новым токеном (prepareHeaders подхватит автоматически)
			return baseQuery(args, api, extraOptions);
		} catch (error) {
			// TODO: добавить логику logout после создания логина

			// api.dispatch({ type: 'auth/logout' });
			// if (typeof window !== 'undefined') {
			// 	window.location.href = '/login';
			// }
			return result;
		} finally {
			api.dispatch(authActions.setRefreshing(false));
		}
	}

	return result;
};

export default baseQueryWithReauth;
