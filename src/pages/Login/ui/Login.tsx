import { Logo } from '@/shared/assets/icons';
import Link from 'next/link';
import styles from './Login.module.scss';

export const Login = () => {
	return (
		<section className={styles.login}>
			<Logo style={{ fontSize: '161px' }} className={styles.logo} />
			<h1 className={styles.title}>А-Чат</h1>
			<p>Привет!</p>
			<p className={styles.text}>Давай знакомиться</p>

			<Link href={`/login/phone`} className={styles.link}>
				Начать
			</Link>
		</section>
	);
};
