import { SupportForm } from '@/features/support/ui';
import { Container, ContainerType } from '@/shared/ui/Container';
import { HeaderBlock } from '@/shared/ui/HeaderBlock';
import styles from './SupportPage.module.scss';

export function SupportPage() {
	return (
		<Container type={ContainerType.SIDEBAR}>
			<HeaderBlock
				title={'Обращение в поддержку'}
				href={'/settings'}
				parentClass={styles.headerBlock}
				iconLeft
				iconRight
			/>
			<SupportForm />
		</Container>
	);
}
