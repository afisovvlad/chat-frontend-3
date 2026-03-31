'use client';

import { useEffect } from 'react';
import { useGetProfileQuery } from '@/entities/Profile/api/editProfile.api';
import { authActions } from '@/features/auth/model/slices/authSlice';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';

interface AuthSyncProviderProps {
	children: React.ReactNode;
}

/**
 * Провайдер для синхронизации user_id из профиля в Redux (auth slice).
 */
export const AuthSyncProvider = ({ children }: AuthSyncProviderProps) => {
	const dispatch = useAppDispatch();

	const { data: profileData } = useGetProfileQuery(undefined);

	useEffect(() => {
		if (profileData?.uid) {
			dispatch(authActions.setCurrentUserId(profileData.uid));
		}
	}, [profileData?.uid, dispatch]);

	return <>{children}</>;
};
