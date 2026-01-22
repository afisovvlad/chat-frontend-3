import {
	EnterCode,
	EnterPhoneForm,
	LoginGreeting,
	RegisterForm,
	SupportFormComponent,
	useAuthStep
} from '@/features/auth';
import { LoginWrapper } from '@/shared/ui/LoginWrapper';

interface AuthFlowProps {
	containerRef?: React.RefObject<HTMLDivElement | null>;
}

export const AuthFlow = ({ containerRef }: AuthFlowProps) => {
	const step = useAuthStep();

	switch (step) {
		case 'greeting':
			return <LoginGreeting />;
		case 'phone':
			return (
				<LoginWrapper>
					<EnterPhoneForm containerRef={containerRef} />
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
