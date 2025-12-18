'use client';

import { usePathname } from 'next/navigation';
import { Container } from '@/shared/ui/Container/ui/Container';
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/Sidebar';
import styles from './layout.module.scss';

const getActivePageFromPathname = (
	pathname: string
): 'chat' | 'service' | 'contacts' | 'settings' => {
	if (pathname.startsWith('/chat')) {
		return 'chat';
	}
	if (pathname.startsWith('/service')) {
		return 'service';
	}
	if (pathname.startsWith('/contacts')) {
		return 'contacts';
	}
	if (pathname.startsWith('/settings')) {
		return 'settings';
	}
	return 'chat';
};

export default function MainLayout({
	children
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	const activePage = pathname ? getActivePageFromPathname(pathname) : 'chat';

	return (
		<Container>
			<Header />
			<div className={styles.mainLayout}>
				<Sidebar activePage={activePage} />
				<main className={styles.content}>{children}</main>
			</div>
		</Container>
	);
}
