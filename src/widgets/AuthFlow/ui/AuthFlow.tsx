'use client';

import {
	EnterCode,
	EnterPhoneForm,
	LoginGreeting,
	RegisterForm,
	SupportFormComponent,
	useAuthStep
} from '@/features/auth';
import { LoginWrapper } from '@/shared/ui/LoginWrapper';

export const AuthFlow = () => {
	const step = useAuthStep();

	switch (step) {
		case 'greeting':
			return <LoginGreeting />;
		case 'phone':
			return (
				<LoginWrapper>
					<EnterPhoneForm />
				</LoginWrapper>
			);
		case 'code':
			return (
				<LoginWrapper>
					<EnterCode />
				</LoginWrapper>
			);
		case 'register':
			return (
				<LoginWrapper>
					<RegisterForm />
				</LoginWrapper>
			);
		case 'support':
			return <SupportFormComponent />;
		default:
			return null;
	}
};
