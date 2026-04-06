'use client';

import { useEffect } from 'react';
import { useGetProfileQuery } from '@/entities/Profile/api/editProfile.api';
import { authActions } from '@/features/auth/model/slices/authSlice';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';

interface AuthSyncProviderProps {
	children: React.ReactNode;
}

export const AuthSyncProvider = ({ children }: AuthSyncProviderProps) => {
	const dispatch = useAppDispatch();

	const { data: profileData } = useGetProfileQuery(undefined);

	useEffect(() => {
		const uid = profileData?.uid;

		if (uid) {
			dispatch(authActions.setCurrentUserId(uid));

			import('@/shared/api').then(({ setWSCurrentUserId }) => {
				setWSCurrentUserId(uid);
			});
		}
	}, [profileData?.uid, dispatch]);

	return <>{children}</>;
};
