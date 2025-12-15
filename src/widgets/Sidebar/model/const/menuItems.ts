import type { ComponentType, SVGProps } from 'react';

import {
	Chat,
	Service,
	MobileService,
	SearchContacts,
	Settings,
	MobileContacts
} from '@icons/index';

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type TabId = 'chat' | 'service' | 'contacts' | 'settings';

export type MenuItemBase = {
	id: TabId;
	title: string; // для десктопа (aria-label, tooltip)
	label: string;
	Icon: IconComponent;
	IconMobile?: IconComponent;
};

const menuItemConfig: Record<TabId, MenuItemBase> = {
	chat: {
		id: 'chat',
		title: 'Chat',
		label: 'Чаты',
		Icon: Chat,
		IconMobile: Chat
	},
	service: {
		id: 'service',
		title: 'Service',
		label: 'Сервисы',
		Icon: Service,
		IconMobile: MobileService
	},
	contacts: {
		id: 'contacts',
		title: 'Search-contacts',
		label: 'Контакты',
		Icon: SearchContacts,
		IconMobile: MobileContacts
	},
	settings: {
		id: 'settings',
		title: 'Settings',
		label: 'Настройки',
		Icon: Settings,
		IconMobile: Settings
	}
};

export const menuItems: MenuItemBase[] = [
	menuItemConfig.chat,
	menuItemConfig.service,
	menuItemConfig.contacts,
	menuItemConfig.settings
];

export const menuItemsMobile: MenuItemBase[] = [
	menuItemConfig.chat,
	menuItemConfig.contacts,
	menuItemConfig.service,
	menuItemConfig.settings
];
