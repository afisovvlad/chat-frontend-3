'use client';

import { usePathname } from 'next/navigation';
import { menuItems } from '../model/config/navigation';
import Link from 'next/link';
import { Text, TextSize, TextType } from '@/shared/ui/Text';
import { classNames } from '@/shared/lib/classNames/classNames';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import cls from './Navbar.module.scss';

export const Navbar = () => {
	const pathname = usePathname();
	const isMobile = useMediaQuery();

	const hiddenPaths = ['/chats/'];

	const isChatPage = hiddenPaths.some(
		path => pathname?.startsWith(path) && pathname.split('/').length > 2
	);

	const shouldHideNavbar = isMobile && isChatPage;

	if (shouldHideNavbar) {
		return null;
	}

	return (
		<div className={classNames(cls.navbar)}>
			{menuItems.map(item => {
				const Icon = item.Icon;
				const IconMobile = item.IconMobile || item.Icon;
				const href = `/${item.id}`;

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
