import '@/app/styles/index.scss';

interface IChildren {
	children: React.ReactNode;
}

export default function RootLayout({ children }: IChildren) {
	return (
		<html
			lang='ru'
			// className={`${roboto.variable} ${openSans.variable} ${montserrat.variable} ${alumniSans.variable}`}
		>
			<head></head>
			<body>
				<main>{children}</main>
			</body>
		</html>
	);
}
