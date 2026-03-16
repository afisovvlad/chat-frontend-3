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
			/>
			<SupportForm parentClass={styles.form} marginTop='341px' />
		</section>
	);
}
