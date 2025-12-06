import styles from './layout.module.scss';
import { Container } from '@/shared/ui/Container/ui/Container';
import { Sidebar } from '@/widgets/Sidebar';
import { Header } from '@/widgets/header';

interface IChildren {
	children: React.ReactNode;
}

export default function MainLayout({ children }: IChildren) {
	return (
		<Container>
			<Header />
			<Sidebar />
			<div className={styles.mainLayout}>{children}</div>
		</Container>
	);
}
