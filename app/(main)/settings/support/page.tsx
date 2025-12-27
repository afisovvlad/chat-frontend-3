import { SupportForm } from '@/features/support/ui';
import { Container, ContainerType } from '@/shared/ui/Container';

export default function SupportPage() {
	return (
		<Container type={ContainerType.SIDEBAR}>
			<SupportForm />
		</Container>
	);
}
