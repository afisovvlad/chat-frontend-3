import '@/app/styles/index.scss';

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
				<main className='main'>{children}</main>
			</body>
		</html>
	);
}
