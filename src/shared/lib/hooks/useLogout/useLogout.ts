'use client';
import { authActions } from '@/features/auth';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../useAppDispatch/useAppDispatch';
import { profileActions } from '@/entities/Profile';

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

			// 3. редирект
			router.push('/login');
		} catch (_) {
			router.push('/login');
		}
	};
}
