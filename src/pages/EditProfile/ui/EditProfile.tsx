import { EditProfileForm } from '@/features/profile/edit';
import styles from './EditProfile.module.scss';

export function EditProfile() {
	return (
		<section className={styles.editProfile}>
			<p>Выбрать фотографию</p>
			<EditProfileForm />
		</section>
	);
}
