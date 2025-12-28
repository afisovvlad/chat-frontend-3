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
	slug: string;
	title: string;
	Icon: IconComponent;
	IconMobile?: IconComponent;
}

const ORDER: PageId[] = ['chats', 'service', 'contacts', 'settings'];

const config: Record<PageId, Omit<MenuItem, 'id'>> = {
	chats: {
		slug: 'Chat',
		title: 'Чаты',
		Icon: Chat,
		IconMobile: Chat
	},
	service: {
		slug: 'Service',
		title: 'Сервисы',
		Icon: Service,
		IconMobile: MobileService
	},
	contacts: {
		slug: 'Search contacts',
		title: 'Контакты',
		Icon: SearchContacts,
		IconMobile: MobileContacts
	},
	settings: {
		slug: 'Settings',
		title: 'Настройки',
		Icon: Settings,
		IconMobile: Settings
	}
};

export const menuItems: MenuItem[] = ORDER.map(id => ({
	id,
	...config[id]
}));
