import '@/app/styles/index.scss';
import styles from './layout.module.scss';

interface IChildren {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: IChildren) {
	return (
		<html lang='ru'>
			<head></head>

			<body>
				<main className={styles.main}>{children}</main>
			</body>
		</html>
	);
}
