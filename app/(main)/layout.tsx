import { Container } from '@/shared/ui/Container/ui/Container';
import { Header } from '@/widgets/Header';
import { Sidebar } from '@/widgets/Sidebar';
import styles from './layout.module.scss';

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
