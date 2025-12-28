import type { ComponentType, SVGProps } from 'react';
import { Edit, BlackList, Support, LogoutIcon } from '@icons/index';

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type SettingsListItemId =
	| 'edit-profile'
	| 'blacklist'
	| 'support'
	| 'logout';

export interface SettingsListItem {
	id: SettingsListItemId;
	slug: string;
	title: string;
	Icon: IconComponent;
	href?: string; // отсутствует у logout
}

const ORDER: SettingsListItemId[] = [
	'edit-profile',
	'blacklist',
	'support',
	'logout'
];

const config: Record<SettingsListItemId, Omit<SettingsListItem, 'id'>> = {
	'edit-profile': {
		slug: 'Edit Profile',
		title: 'Редактирование профиля',
		Icon: Edit,
		href: '/settings/profile'
	},
	blacklist: {
		slug: 'Black List',
		title: 'Чёрный список',
		Icon: BlackList,
		href: '/settings/blacklist'
	},
	support: {
		slug: 'Support',
		title: 'Поддержка',
		Icon: Support,
		href: '/settings/support'
	},
	logout: {
		slug: 'Logout',
		title: 'Выйти из аккаунта',
		Icon: LogoutIcon
	}
};

export const settingsListItems: SettingsListItem[] = ORDER.map(id => ({
	id,
	...config[id]
}));
