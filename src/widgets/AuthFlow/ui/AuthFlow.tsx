import {
	EnterCode,
	EnterPhoneForm,
	FinishRegister,
	LoginGreeting,
	Register,
	SupportSuccess,
	useAuthStep
} from '@/features/auth';
import { SupportForm } from '@/features/support';
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
					<Register />
				</LoginWrapper>
			);

		case 'finish-register':
			return <FinishRegister />;

		case 'support':
			return (
				<LoginWrapper>
					<SupportForm marginTop='0' />
				</LoginWrapper>
			);

		case 'success-support':
			return (
				<LoginWrapper>
					<SupportSuccess />
				</LoginWrapper>
			);

		default:
			return null;
	}
};
