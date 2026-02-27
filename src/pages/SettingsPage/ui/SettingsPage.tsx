'use client';
import { SettingsHeaderBlock } from '@/entities/Settings';
import { Button, ButtonColor, ButtonTheme } from '@/shared/ui/Button';
import { SettingsList } from '@/shared/ui/SettingsList';
import {
	mapProfileToUserCard,
	UserCard,
	UserCardType
} from '@/shared/ui/UserCard';
import { Trash } from '@icons/index';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector/useAppSelector';
import cls from './SettingsPage.module.scss';

export const SettingsPage = () => {
	const profile = useAppSelector(state => state.profile);

	return (
		<div className={cls.settings}>
			<SettingsHeaderBlock title={'Настройки'} />

			<div className={cls.content}>
				{profile ? (
					<UserCard
						userData={mapProfileToUserCard(profile)}
						type={UserCardType.PROFILE}
					/>
				) : null}

				<SettingsList />
			</div>

			<Button
				theme={ButtonTheme.CLEAR}
				color={ButtonColor.DANGER}
				className={cls.deleteProfile}
			>
				<Trash /> Удалить профиль
			</Button>
		</div>
	);
};
