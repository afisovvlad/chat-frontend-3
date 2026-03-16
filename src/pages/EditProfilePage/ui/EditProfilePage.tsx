import { EditProfileForm } from '@/entities/Profile';
import { SettingsHeaderBlock } from '@/entities/Settings';
import styles from './EditProfilePage.module.scss';

export function EditProfilePage() {
	return (
		<section className={styles.editProfile}>
			<SettingsHeaderBlock
				title={'Редактирование профиля'}
				href={'/settings'}
				parentClass={styles.headerBlock}
			/>
			{/* <AvatarProfile /> */}
			<EditProfileForm parentClass={styles.form} />
		</section>
	);
}
