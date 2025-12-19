import { Apple, Google, Logo } from '@icons/index';
import styles from './Header.module.scss';

export const Header = () => {
	return (
		<header className={styles.header}>
			<Logo height={44} width={49} aria-label='Логотип' />
			<div className={styles.rightBlock}>
				<Apple height={44} width={150} aria-label='Скачать в AppStore' />
				<Google height={44} width={150} aria-label='Найти в GooglePlay' />
			</div>
		</header>
	);
};
