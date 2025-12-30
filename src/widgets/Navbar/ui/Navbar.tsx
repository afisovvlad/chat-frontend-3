'use client';

import { usePathname } from 'next/navigation';
import { menuItems } from '../model/config/navigation';
import Link from 'next/link';
import { Text, TextSize, TextType } from '@/shared/ui/Text';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Navbar.module.scss';

export const Navbar = () => {
	const pathname = usePathname();

	return (
		<nav className={classNames(cls.Navbar)}>
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
		</nav>
	);
};
