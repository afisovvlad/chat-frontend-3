import { EditProfileForm } from '@/features/profile/edit';
import { HeaderBlock } from '@/shared/ui/HeaderBlock';
import styles from './EditProfile.module.scss';

export function EditProfile() {
	return (
		// <Container type={ContainerType.WRAPPER}>
		// 	<Container type={ContainerType.SIDEBAR}>
		<section className={styles.editProfile}>
			<HeaderBlock
				title={'Редактирование профиля'}
				href={'/settings'}
				parentClass={styles.headerBlock}
				iconLeft
				iconRight={false}
			/>
			<EditProfileForm />
		</section>
		// 	</Container>
		// </Container>
	);
}
