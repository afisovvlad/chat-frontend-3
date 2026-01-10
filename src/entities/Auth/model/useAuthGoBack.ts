import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { authActions } from './authSlice';
import { useCallback } from 'react';

export const useAuthGoBack = () => {
	const dispatch = useAppDispatch();

	return useCallback(() => {
		dispatch(authActions.goBack());
	}, [dispatch]);
};
