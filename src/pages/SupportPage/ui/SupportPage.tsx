import { SupportForm } from '@/features/support/ui';
import { SettingsHeaderBlock } from '@/shared/ui/SettingsHeaderBlock';
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
