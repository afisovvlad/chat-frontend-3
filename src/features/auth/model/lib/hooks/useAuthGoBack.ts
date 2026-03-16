import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';

import { useCallback } from 'react';
import { authActions } from '../../slices/authSlice';

export const useAuthGoBack = () => {
	const dispatch = useAppDispatch();

	return useCallback(() => {
		dispatch(authActions.goBack());
	}, [dispatch]);
};
