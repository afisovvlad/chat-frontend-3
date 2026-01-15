import { RootState } from '@/app/providers/StoreProvider';

import {
	BaseQueryFn,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError
} from '@reduxjs/toolkit/query/react';
import { logoutFromInterceptor } from './services/logoutForInterceptor/logoutForInterceptor';
import { authActions } from '@/features/auth/model/slices/authSlice';

// Интерсептор 1: добавление accessToken в заголовок
const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_BASE_API as string,
	credentials: 'include'
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
			const refreshResult = await baseQuery(
				{
					url: '/api/auth/refresh',
					method: 'POST'
				},
				api,
				extraOptions
			);

			if (refreshResult.error) {
				api.dispatch(authActions.logout());
				await logoutFromInterceptor();
				return result;
			}

			// Повторяем с новым токеном (prepareHeaders подхватит автоматически)
			return baseQuery(args, api, extraOptions);
		} catch (_) {
			api.dispatch(authActions.logout());
			await logoutFromInterceptor();
			return result;
		} finally {
			api.dispatch(authActions.setRefreshing(false));
		}
	}

	return result;
};

export default baseQueryWithReauth;
