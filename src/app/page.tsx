import styles from './page.module.scss';

export default function Home() {
	return (
		<div className={styles.Page}>
			<main className={styles.Main}>
				<p>Тестовая страница</p>
			</main>
		</div>
	);
}
