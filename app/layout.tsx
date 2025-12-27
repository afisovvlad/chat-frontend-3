import { OnlineChecker } from '@/app/providers/OnlineChecker';
import { StoreProvider } from '@/app/providers/StoreProvider';
import '@/app/styles/index.scss';
import { roboto, sfPro } from '../public/assets/fonts/index';

interface IChildren {
	children: React.ReactNode;
}

export default function RootLayout({ children }: IChildren) {
	return (
		<html lang='ru' className={`${roboto.variable} ${sfPro.variable} `}>
			<head></head>
			<body>
				<StoreProvider>
					<OnlineChecker>{children}</OnlineChecker>
				</StoreProvider>
			</body>
		</html>
	);
}
