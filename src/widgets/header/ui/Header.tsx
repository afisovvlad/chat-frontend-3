import { Apple, Google, Logo } from '@/shared/assets/icons';
import styles from './Header.module.scss';

export const Header = () => {
	return (
		<header className={styles.header}>
			<Logo height={44} width={44} fontSize={44} />
			<div className={styles.riteBlock}>
				<Apple height={44} width={150} />
				<Google height={44} width={150} />
			</div>
		</header>
	);
};
