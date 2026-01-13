import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useCallback } from 'react';
import { authActions } from '../../..';
import { AuthStep } from '../../types/authStep';

export const useSetAuthStep = () => {
	const dispatch = useAppDispatch();

	return useCallback(
		(step: AuthStep) => {
			dispatch(authActions.setStep(step));
		},
		[dispatch]
	);
};
