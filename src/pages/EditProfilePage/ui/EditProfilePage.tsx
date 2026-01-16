import styles from './EditProfilePage.module.scss';
import { EditProfileForm } from '@/entities/Profile';
import { SettingsHeaderBlock } from '@/entities/Settings';

export function EditProfilePage() {
	return (
		<section className={styles.editProfile}>
			<SettingsHeaderBlock
				title={'Редактирование профиля'}
				href={'/settings'}
				parentClass={styles.headerBlock}
			/>
			<EditProfileForm parentClass={styles.form} />
		</section>
	);
}
