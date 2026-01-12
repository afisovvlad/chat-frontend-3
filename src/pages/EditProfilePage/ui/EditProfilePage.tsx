import styles from './EditProfilePage.module.scss';
import { EditProfileForm } from '@/features/profile/edit';
import { SettingsHeaderBlock } from '@/entities/SettingsHeaderBlock';

export function EditProfilePage() {
	console.log('EditProfilePage');
	return (
		<section className={styles.editProfile}>
			<SettingsHeaderBlock
				title={'Редактирование профиля'}
				href={'/settings'}
				parentClass={styles.headerBlock}
				iconLeft
				iconRight={false}
			/>
			<EditProfileForm parentClass={styles.form} />
		</section>
	);
}
