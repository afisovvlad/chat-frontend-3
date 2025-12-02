import '@/app/styles/index.scss';
import Container from '@/shared/ui/Container/Container';
import { Header } from '@/shared/ui/Header/Header';
import { Sidebar } from '@/widgets/Sidebar';

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang='ru'
			// className={`${roboto.variable} ${openSans.variable} ${montserrat.variable} ${alumniSans.variable}`}
		>
			<head></head>
			<body>
				<Container>
					<Header />
					<Sidebar />
					<main className='main'>{children}</main>
				</Container>
			</body>
		</html>
	);
}
