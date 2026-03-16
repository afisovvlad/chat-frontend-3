'use client';
import { persistor } from '@/app/providers/StoreProvider/config/store';
import { profileActions } from '@/entities/Profile';
import { authActions } from '@/features/auth';
import { localApi } from '@/shared/api/localApi';
import { rtkApi } from '@/shared/api/rtkApi';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../useAppDispatch/useAppDispatch';

export function useLogout() {
	const router = useRouter();
	const dispatch = useAppDispatch();

	return async () => {
		try {
			// 1. чистим токены через прокси
			await fetch('/api/auth/removeTokens', {
				method: 'POST'
			});

			// 2. обновляем store
			dispatch(authActions.logout());
			dispatch(profileActions.clearProfile());
			dispatch(rtkApi.util.resetApiState());
			dispatch(localApi.util.resetApiState());

			await persistor.purge();

			// 3. редирект
			router.push('/login');
		} catch (_) {
			router.push('/login');
		}
	};
}
