import '@/app/styles/index.scss';
import styles from './layout.module.scss';

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
				<main className={styles.main}>{children}</main>
			</body>
		</html>
	);
}
