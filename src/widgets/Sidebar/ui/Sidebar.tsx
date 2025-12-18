import { menuItems } from '../model/const/menuItems';
import { classNames } from '@/shared/lib/classNames/classNames';

import cls from './Sidebar.module.scss';
import Link from 'next/link';
import { Text, TextSize, TextType } from '@/shared/ui/Text';

export type PageId = 'chat' | 'service' | 'contacts' | 'settings';

interface SidebarProps {
	activePage: PageId;
}

export const Sidebar = ({ activePage }: SidebarProps) => {
	return (
		<div className={classNames(cls.Sidebar)}>
			{menuItems.map(item => {
				const Icon = item.Icon;
				const IconMobile = item.IconMobile || item.Icon;

				return (
					<Link
						key={item.id}
						href={`/${item.id}`}
						className={classNames(cls.SidebarBtn, {
							[cls.active]: activePage === item.id
						})}
						aria-label={item.title}
					>
						<Icon className={cls.SidebarIconDesktop} />
						<IconMobile className={cls.SidebarIconMobile} />
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
