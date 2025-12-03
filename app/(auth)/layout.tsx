import styles from './layout.module.scss';

interface IChildren {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: IChildren) {
	return <section className={styles.main}>{children}</section>;
}
