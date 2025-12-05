import styles from './layout.module.scss';

interface IChildren {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: IChildren) {
	return <div className={styles.authLayout}>{children}</div>;
}
