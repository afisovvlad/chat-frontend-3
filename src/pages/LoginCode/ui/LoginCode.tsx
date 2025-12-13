import Link from 'next/link';
import styles from './LoginCode.module.scss';

export const LoginCode = () => {
	return (
		<div className={styles.loginSlug}>
			<Link href='/login/phone'>Назад</Link>
			<h1 className={styles.title}>Подтвердите код</h1>
			<p>Код подтверждения отправлен на следующий номер:</p>
			<form action=''>
				<label htmlFor='phone'>Введите код</label>
				<input type='text' id='phone' />
			</form>

			<p>Отправить новый код через 0:56</p>

			<Link href='/'>Не приходит код?</Link>
		</div>
	);
};
