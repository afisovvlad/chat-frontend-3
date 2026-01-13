import { SettingsHeaderBlock } from '@/entities/Settings';
import { SupportForm } from '@/features/support';
import styles from './SupportPage.module.scss';

export function SupportPage() {
	return (
		<section className={styles.support}>
			<SettingsHeaderBlock
				title={'Обращение в поддержку'}
				href={'/settings'}
				parentClass={styles.headerBlock}
				iconLeft
			/>
			<SupportForm parentClass={styles.form} />
		</section>
	);
}
