import { Header } from '@/shared/ui/Header/Header';
import { Sidebar } from '@/widgets/sidebar';
import styles from './layout.module.scss';
import Container from '@/shared/ui/Container/Container';

interface IChildren {
	children: React.ReactNode;
}

export default function MainLayout({ children }: IChildren) {
	return (
		<Container>
			<Header />
			<Sidebar />
			<section className={styles.main}>{children}</section>
		</Container>
	);
}
