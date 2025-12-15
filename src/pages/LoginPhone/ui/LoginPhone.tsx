import Link from 'next/link';
import styles from './LoginPhone.module.scss';

export const LoginPhone = () => {
	return (
		<div className={styles.loginSlug}>
			<Link href='/login'>Назад</Link>
			<h1 className={styles.title}>Вход/регистрация</h1>
			<form action=''>
				<label htmlFor='phone'>Введите номер телефона</label>
				<input type='text' id='phone' />
			</form>

			<Link href='/login/code'>Далее</Link>
		</div>
	);
};
