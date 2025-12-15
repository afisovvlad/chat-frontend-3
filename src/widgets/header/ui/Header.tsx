import Apple from '@icons/Apple.svg';
import Google from '@icons/Google.svg';
import Logo from '@icons/Logo.svg';
import styles from './Header.module.scss';

export const Header = () => {
	return (
		<header className={styles.header}>
			<Logo height={44} width={49} aria-label='Логотип' />
			<div className={styles.rightBlock}>
				<Apple height={44} width={150} aria-label='Скачать' />
				<Google height={44} width={150} aria-label='Скачать' />
			</div>
		</header>
	);
};
