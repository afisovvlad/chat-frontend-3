import { Button } from '@/shared/ui/Button';
import Link from 'next/link';
import styles from './Login.module.scss';

export const Login = () => {
	return (
		<section className={styles.login}>
			{/* <Image src={} width={179} height={161} alt='Логотип' /> */}
			<h1 className={styles.title}>А-Чат</h1>

			<Button className={styles.btn}></Button>

			<Link href={`/login/phone`}>Начать</Link>
		</section>
	);
};
