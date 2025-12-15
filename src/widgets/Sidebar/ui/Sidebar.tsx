'use client';

import { menuItems } from '../model/const/menuItems';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Sidebar.module.scss';

interface SidebarProps {
	activeTab: string;
	onTabChange: (id: string) => void;
	isMobile?: boolean;
}

export const Sidebar = ({
	activeTab,
	onTabChange,
	isMobile = false
}: SidebarProps) => {
	return (
		<div className={cls.Sidebar}>
			{menuItems.map(item => {
				const Icon = (isMobile ? item.IconMobile : null) || item.Icon;

				return (
					<button
						key={item.id}
						className={classNames(cls.SidebarBtn, {
							[cls.active]: activeTab === item.id
						})}
						onClick={() => onTabChange(item.id)}
						aria-label={item.title}
					>
						<Icon className={cls.SidebarIcon} />
					</button>
				);
			})}
		</div>
	);
};
