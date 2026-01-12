import styles from './SupportPage.module.scss';
import { SupportForm } from '@/features/support/ui';
import { SettingsHeaderBlock } from '@/entities/SettingsHeaderBlock';

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
