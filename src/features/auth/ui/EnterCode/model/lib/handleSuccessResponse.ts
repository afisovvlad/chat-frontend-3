import { AuthStep } from '@/features/auth/model/types/authStep';
import { useRouter } from 'next/navigation';

export const handleSuccessResponse = async (
	registered: boolean,
	setStep: (arg: AuthStep) => void,
	router: ReturnType<typeof useRouter>
) => {
	if (registered) {
		setStep('greeting');
		router.replace('/');
	} else {
		setStep('register');
	}
};
