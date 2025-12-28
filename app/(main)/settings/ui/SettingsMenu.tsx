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
import cls from './SettingsMenu.module.scss';

export const SettingsMenu = () => {
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
							<Text type={TextType.TITLE} fontSize={TextSize.M}>
								Сергей Иванов
							</Text>
							<Text>+7 921 7797979</Text>
							<Text>@bond777</Text>
						</div>
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
				<div className={cls.rightCont}></div>
			</Container>
		</Container>
	);
};
