'use client';
import { SettingsHeaderBlock } from '@/entities/Settings';
import { Button, ButtonColor, ButtonTheme } from '@/shared/ui/Button';
import { SettingsList } from '@/shared/ui/SettingsList';
import { Trash } from '@icons/index';
import { Text } from '@/shared/ui/Text';
import {
	mapProfileToUserCard,
	UserCard,
	UserCardType
} from '@/shared/ui/UserCard';

import { useGetProfileQuery } from '@/entities/Profile/api/editProfile.api';
import cls from './SettingsPage.module.scss';

export const SettingsPage = () => {
	const { data: profile, isLoading, isError } = useGetProfileQuery();

	return (
		<div className={cls.settings}>
			<SettingsHeaderBlock title={'Настройки'} />

			<div className={cls.content}>
				{isLoading ? (
					<Text>Загрузка...</Text>
				) : isError ? (
					<Text>Ошибка загрузки профиля</Text>
				) : profile ? (
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
