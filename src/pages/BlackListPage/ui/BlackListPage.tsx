import styles from './BlackListPage.module.scss';
import { SettingsHeaderBlock } from '@/entities/Settings';

export function BlackListPage() {
	return (
		<section className={styles.blackList}>
			<SettingsHeaderBlock
				title={'Черный список'}
				href={'/settings'}
				parentClass={styles.headerBlock}
			/>
			<div className={styles.content}>{/* Черный список поместить сюда */}</div>
		</section>
	);
}
