import { EditProfileForm } from '@/features/profile/edit';
import { Container, ContainerType } from '@/shared/ui/Container';
import {
	FontWeight,
	Text,
	TextColor,
	TextSize,
	TextType,
	TitleTag
} from '@/shared/ui/Text';
import { Back } from '@icons/index';
import Link from 'next/link';
import styles from './EditProfile.module.scss';

export function EditProfile() {
	return (
		<Container type={ContainerType.WRAPPER}>
			<Container type={ContainerType.SIDEBAR}>
				<section className={styles.editProfile}>
					<Text
						type={TextType.TITLE}
						tag={TitleTag.H1}
						fontSize={TextSize.L}
						fontWeight={FontWeight.MEDIUM}
						color={TextColor.BLACK}
						className={styles.title}
					>
						<Link href={'/settings'} className={styles.link}>
							<Back color={'#000'} className={styles.back} />
						</Link>
						Редактирование профиля
					</Text>
					<p style={{ marginBottom: '20px' }}>Выбрать фотографию</p>
					<EditProfileForm />
				</section>
			</Container>
		</Container>
	);
}
