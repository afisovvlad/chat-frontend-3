import { ContainerType } from '@/shared/ui/Container';
import { Container } from '@/shared/ui/Container/ui/Container';

export default function SettingsLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Container type={ContainerType.WRAPPER}>
				<Container type={ContainerType.SIDEBAR}>{children}</Container>
				<Container type={ContainerType.CONTENT}>
					<></>
				</Container>
			</Container>
		</>
	);
}
