'use client';

import { useAuthStep } from '@/entities/Auth/model/selectors';
import { StepCode } from '@/features/auth/enter-code';
import { EnterCodeForm } from '@/features/auth/enter-code/ui/EnterCodeForm';
import { EnterPhoneForm } from '@/features/auth/enter-phone/ui/EnterPhoneForm';
import { LoginGreeting } from '@/features/auth/greeting/ui/LoginGreeting';
import { RegisterForm } from '@/features/auth/register/ui/RegisterForm';
import SupportFormComponent from '@/features/auth/support/ui/SupportFormComponent';
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
					<StepCode />
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
