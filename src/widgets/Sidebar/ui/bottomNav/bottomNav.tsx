import { classNames } from '@/shared/lib/classNames/classNames';
import { menuItemsMobile } from '../../model/const/menuItems';

import cls from './bottomNav.module.scss';

interface BottomNavProps {
	activeTab: string;
	onTabChange: (id: string) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
	return (
		<div className={cls.BottomNav}>
			{menuItemsMobile.map(item => {
				const Icon =
					(activeTab === item.id && item.IconMobile) ||
					item.IconMobile ||
					item.Icon;
				return (
					<button
						key={item.id}
						className={classNames(cls.navBtn, {
							[cls.active]: activeTab === item.id
						})}
						onClick={() => onTabChange(item.id)}
					>
						<Icon className={cls.navIcon} />
						<span>{item.label}</span>
					</button>
				);
			})}
		</div>
	);
};
