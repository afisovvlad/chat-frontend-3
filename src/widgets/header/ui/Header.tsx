import { Apple, Google, Logo } from '@/shared/assets/icons';
import styles from './Header.module.scss';

export const Header = () => {
	const hours = new Date().getHours();
	const minutes = new Date().getMinutes();
	const time = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;

	return (
		<header className={styles.header}>
			{/* <div className={styles.leftBlock}> */}
			{/* <div className={styles.desktop}> */}
			<Logo height={44} width={44} fontSize={44} />
			{/* </div> */}
			{/* <div className={styles.mobile}>
					<span className={styles.time}>{time}</span>
				</div> */}
			{/* </div> */}

			<div className={styles.riteBlock}>
				{/* <div className={styles.desktop}> */}
				<Apple height={44} width={150} />
				<Google height={44} width={150} />
				{/* </div>
				<div className={styles.mobile}>
					<Connection fontSize={12.23} />
					<Wifi width={17.14} height={12.23} />
					<StatusBar />
				</div> */}
			</div>
		</header>
	);
};
