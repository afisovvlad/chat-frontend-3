import { EditProfileForm } from '@/features/profile/edit';
import styles from './EditProfile.module.scss';
import { Container, ContainerType } from '@/shared/ui/Container';

export function EditProfile() {
	return (
		<Container type={ContainerType.WRAPPER}>
			<Container type={ContainerType.SIDEBAR}>
				<section className={styles.editProfile}>
					<p>Выбрать фотографию</p>
					<EditProfileForm />
				</section>
			</Container>
		</Container>
	);
}
