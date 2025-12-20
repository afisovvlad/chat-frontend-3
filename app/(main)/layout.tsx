import { Container } from '@/shared/ui/Container/ui/Container';
import { Header } from '@/widgets/Header';
import { Navbar } from '@/widgets/Navbar';
import styles from './layout.module.scss';

export default function MainLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<Container>
			<Header />
			<div className={styles.mainLayout}>
				<Navbar />
				<main className={styles.content}>{children}</main>
			</div>
		</Container>
	);
}
