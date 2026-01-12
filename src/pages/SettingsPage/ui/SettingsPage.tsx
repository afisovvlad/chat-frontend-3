import { Button, ButtonColor, ButtonTheme } from '@/shared/ui/Button';
import { SettingsList } from '@/shared/ui/SettingsList';
import { Text, TextSize, TextType } from '@/shared/ui/Text';
import { Trash } from '@icons/index';
import cls from './SettingsPage.module.scss';
import { SettingsHeaderBlock } from '@/entities/SettingsHeaderBlock';

export const SettingsPage = () => {
	return (
		<div className={cls.settings}>
			<SettingsHeaderBlock title={'Настройки'} />

			<div className={cls.content}>
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
		</div>
	);
};
