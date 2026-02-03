import { authActions } from '@/features/auth';
import { AuthStep } from '@/features/auth/model/types/authStep';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useRouter } from 'next/navigation';

export const handleSuccessResponse = (
	registered: boolean,
	setStep: (arg: AuthStep) => void,
	router: ReturnType<typeof useRouter>,
	dispatch: ReturnType<typeof useAppDispatch>
) => {
	dispatch(authActions.resetAttemptCounter());

	if (registered) {
		setStep('greeting');
		router.replace('/');
	} else {
		setStep('register');
	}
};
