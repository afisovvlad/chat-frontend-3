'use client';

import { useRef, useState } from 'react';
import { Container, ContainerType } from '@/shared/ui/Container';
import { Button, ButtonTheme, ButtonColor } from '@/shared/ui/Button';
import { SettingsList } from '@/shared/ui/SettingsList';
import {
	TextType,
	TitleTag,
	TextSize,
	TextAlign,
	FontWeight,
	Text
} from '@/shared/ui/Text';
import { Trash } from '@icons/index';
import {
	AvatarUploader,
	AvatarUploaderRef
} from '@/shared/ui/ImageEditor/AvatarUpLoader/AvatarUpLoader';
import { ButtonType } from '../../shared/ui/Button/model/types/type';

import cls from './SettingsPage.module.scss';

export const SettingsPage = () => {
	const [avatar, setAvatar] = useState<string | null>(null);
	const avatarRef = useRef<AvatarUploaderRef>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const formData = {
			avatar: avatar // base64 строка или null
		};

		console.log('Данные для отправки Аватара:', formData);
	};

	const handleAvatarChange = (dataUrl: string) => {
		setAvatar(dataUrl);
	};

	return (
		<Container type={ContainerType.WRAPPER}>
			<Container type={ContainerType.SIDEBAR} className={cls.sidebar}>
				<div className={cls.settings}>
					<Text
						type={TextType.TITLE}
						tag={TitleTag.H3}
						fontSize={TextSize.L}
						textAlign={TextAlign.CENTER}
						fontWeight={FontWeight.MEDIUM}
						className={cls.settingsTitle}
					>
						Настройки
					</Text>

					<div className={cls.profileSection}>
						<div className={cls.avatarWrapper}>
							<div className={cls.avatar}></div>
						</div>
						<div className={cls.profileInfo}>
							<Text type={TextType.TITLE} fontSize={TextSize.M}>
								Сергей Иванов
							</Text>
							<Text>+7 921 7797979</Text>
							<Text>@bond777</Text>
						</div>
					</div>

					<div>
						<form onSubmit={handleSubmit}>
							<div className={cls.btnWrapper}>
								<Button
									btnType={ButtonType.BUTTON}
									onClick={() => avatarRef.current?.openFilePicker()}
									className={cls.avatarBtn}
								>
									Изменить аватар
								</Button>

								<AvatarUploader
									ref={avatarRef}
									onAvatarChange={handleAvatarChange}
									initialAvatar={avatar}
								/>
								<Button
									btnType={ButtonType.SUBMIT}
									theme={ButtonTheme.BACKGROUND}
									color={ButtonColor.GREEN}
									className={cls.avatarBtn}
								>
									Сохранить профиль
								</Button>
							</div>
						</form>
					</div>

					<SettingsList />

					<Button
						theme={ButtonTheme.CLEAR}
						color={ButtonColor.DANGER}
						className={cls.deleteProfile}
					>
						<Trash /> Удалить профиль
					</Button>
				</div>
			</Container>

			<Container type={ContainerType.CONTENT}>
				<></>
			</Container>
		</Container>
	);
};
