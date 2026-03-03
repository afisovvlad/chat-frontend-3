'use client';

import { usePathname } from 'next/navigation';
import { menuItems } from '../model/config/navigation';
import Link from 'next/link';
import { Text, TextSize, TextType } from '@/shared/ui/Text';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Navbar.module.scss';

export const Navbar = () => {
	const pathname = usePathname();

	// Скрываем Navbar на страницах чатов
	const hiddenPaths = ['/chats/']; // Можно добавить '/messages/', '/call/'

	// Проверяем: если путь начинается с /chats/ и содержит uid (длина > 7)
	const shouldHideNavbar = hiddenPaths.some(
		path => pathname?.startsWith(path) && pathname.split('/').length > 2
	);

	if (shouldHideNavbar) {
		return null;
	}

	return (
		<div className={classNames(cls.navbar)}>
			{menuItems.map(item => {
				const Icon = item.Icon;
				const IconMobile = item.IconMobile || item.Icon;
				const href = `/${item.id}`;

				// Проверяем, соответствует ли текущий путь этой странице
				const isActive = pathname?.startsWith(href) || false;

				return (
					<Link
						key={item.id}
						href={href}
						className={classNames(cls.navbarLink, {
							[cls.active]: isActive
						})}
						aria-label={item.slug}
					>
						<Icon className={cls.navbarIconDesktop} />
						<IconMobile className={cls.navbarIconMobile} />
						<Text
							type={TextType.TEXT}
							fontSize={TextSize.S}
							className={cls.label}
						>
							{item.title}
						</Text>
					</Link>
				);
			})}
		</div>
	);
};
