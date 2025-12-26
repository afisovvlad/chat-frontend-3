'use client';

import {
	Text,
	TextType,
	TitleTag,
	TextAlign,
	TextSize,
	FontWeight
} from '@/shared/ui/Text';
import { Trash } from '@icons/index';
import { Container, ContainerType } from '@/shared/ui/Container';
import { SettingsMenu } from './shared/ui/SettingsMenu/SettingsMenu';
import cls from './settings.module.scss';
import { Button, ButtonColor, ButtonTheme } from '@/shared/ui/Button';

const Settings = () => {
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
					{/* Тестовое наполнение — удалить в проде */}
					<div className={cls.profileSection}>
						<div className={cls.avatarWrapper}>
							<div className={cls.avatar}></div>
						</div>
						<div className={cls.profileInfo}>
							<Text type={TextType.TITLE}>Сергей Иванов</Text>
							<Text>+7 921 7797979</Text>
							<Text>@bond777</Text>
						</div>
					</div>

					<SettingsMenu />

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
				<div className={cls.rightCont}></div>
			</Container>
		</Container>
	);
};

export default Settings;
