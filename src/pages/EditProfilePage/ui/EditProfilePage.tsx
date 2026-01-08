import { EditProfileForm } from '@/features/profile/edit';
import { SettingsHeaderBlock } from '@/shared/ui/SettingsHeaderBlock';
import styles from './EditProfilePage.module.scss';

export function EditProfilePage() {
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
