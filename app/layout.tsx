import '@/app/styles/index.scss';
import { roboto, sfPro } from '@/shared/fonts/index';

interface IChildren {
	children: React.ReactNode;
}

export default function RootLayout({ children }: IChildren) {
	return (
		<html lang='ru' className={`${roboto.variable} ${sfPro.variable} `}>
			<head></head>
			<body>
				<main>{children}</main>
			</body>
		</html>
	);
}
