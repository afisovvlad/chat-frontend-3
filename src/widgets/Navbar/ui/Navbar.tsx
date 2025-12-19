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
		<div className={classNames(cls.Navbar)}>
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
						className={classNames(cls.NavbarBtn, {
							[cls.active]: isActive
						})}
						aria-label={item.title}
					>
						<Icon className={cls.NavbarIconDesktop} />
						<IconMobile className={cls.NavbarIconMobile} />
						<Text
							type={TextType.TEXT}
							fontSize={TextSize.S}
							className={cls.label}
						>
							{item.label}
						</Text>
					</Link>
				);
			})}
		</div>
	);
};
