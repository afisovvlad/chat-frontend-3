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
export type PageId = 'chats' | 'service' | 'contacts' | 'settings';

export interface MenuItem {
	id: PageId;
	title: string;
	label: string;
	Icon: IconComponent;
	IconMobile?: IconComponent;
}

const ORDER: PageId[] = ['chats', 'service', 'contacts', 'settings'];

const config: Record<PageId, Omit<MenuItem, 'id'>> = {
	chats: {
		title: 'Chat',
		label: 'Чаты',
		Icon: Chat,
		IconMobile: Chat
	},
	service: {
		title: 'Service',
		label: 'Сервисы',
		Icon: Service,
		IconMobile: MobileService
	},
	contacts: {
		title: 'Search contacts',
		label: 'Контакты',
		Icon: SearchContacts,
		IconMobile: MobileContacts
	},
	settings: {
		title: 'Settings',
		label: 'Настройки',
		Icon: Settings,
		IconMobile: Settings
	}
};

export const menuItems: MenuItem[] = ORDER.map(id => ({
	id,
	...config[id]
}));
