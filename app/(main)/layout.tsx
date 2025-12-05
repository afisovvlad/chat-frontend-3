import styles from './layout.module.scss';
import { Header } from '@/shared/ui/Header/Header';
import { Sidebar } from '@/widgets/Sidebar';
import Container from '@/shared/ui/Container/Container';

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
