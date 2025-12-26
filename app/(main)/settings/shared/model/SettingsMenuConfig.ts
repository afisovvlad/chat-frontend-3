import type { ComponentType, SVGProps } from 'react';
import { Edit, BlackList, Support, LogoutIcon } from '@icons/index';

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type SettingsMenuItemId =
	| 'edit-profile'
	| 'blacklist'
	| 'support'
	| 'logout';

export interface SettingsMenuItem {
	id: SettingsMenuItemId;
	title: string;
	label: string;
	Icon: IconComponent;
	href?: string; // отсутствует у logout
}

const ORDER: SettingsMenuItemId[] = [
	'edit-profile',
	'blacklist',
	'support',
	'logout'
];

const config: Record<SettingsMenuItemId, Omit<SettingsMenuItem, 'id'>> = {
	'edit-profile': {
		title: 'Edit Profile',
		label: 'Редактирование профиля',
		Icon: Edit,
		href: '/settings/profile'
	},
	blacklist: {
		title: 'Black List',
		label: 'Чёрный список',
		Icon: BlackList,
		href: '/settings/blacklist'
	},
	support: {
		title: 'Support',
		label: 'Поддержка',
		Icon: Support,
		href: '/settings/support'
	},
	logout: {
		title: 'Logout',
		label: 'Выйти из аккаунта',
		Icon: LogoutIcon
	}
};

export const settingsMenuItems: SettingsMenuItem[] = ORDER.map(id => ({
	id,
	...config[id]
}));
