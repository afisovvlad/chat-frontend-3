import { Container } from '@/shared/ui/Container/ui/Container';
// import { Header } from '@/widgets/Header';
import { Navbar } from '@/widgets/Navbar';
import cls from './layout.module.scss';

export default function MainLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<Container>
			{/* <Header /> */}
			<div className={cls.mainLayout}>
				<Navbar />
				<main className={cls.content}>{children}</main>
			</div>
		</Container>
	);
}
