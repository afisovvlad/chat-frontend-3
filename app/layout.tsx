import { StoreProvider } from '@/app/providers/StoreProvider';
import '@/app/styles/index.scss';
import { roboto, sfPro } from '@/shared/assets/fonts/index';

interface IChildren {
	children: React.ReactNode;
}

export default function RootLayout({ children }: IChildren) {
	return (
		<html lang='ru' className={`${roboto.variable} ${sfPro.variable} `}>
			<head></head>
			<body>
				<StoreProvider>
					<main>{children}</main>
				</StoreProvider>
			</body>
		</html>
	);
}
