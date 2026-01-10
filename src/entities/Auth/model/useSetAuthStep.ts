import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useCallback } from 'react';
import { AuthStep } from './types';
import { authActions } from './authSlice';

export const useSetAuthStep = () => {
	const dispatch = useAppDispatch();

	return useCallback(
		(step: AuthStep) => {
			dispatch(authActions.setStep(step));
		},
		[dispatch]
	);
};
