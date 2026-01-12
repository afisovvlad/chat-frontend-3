import { SettingsHeaderBlock } from '@/entities/SettingsHeaderBlock';
import styles from './BlackListPage.module.scss';

export function BlackListPage() {
	return (
		<section className={styles.blackList}>
			<SettingsHeaderBlock
				title={'Черный список'}
				href={'/settings'}
				parentClass={styles.headerBlock}
				iconLeft
			/>
			<div className={styles.content}>{/* Черный список поместить сюда */}</div>
		</section>
	);
}
