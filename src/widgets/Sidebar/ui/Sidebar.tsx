import { classNames } from '@/shared/lib/classNames/classNames';
import Image from 'next/image';
import { menuItems } from '../model/const/menuItems';
import cls from './Sidebar.module.scss';

interface SidebarProps {
	className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
	return (
		<ul className={classNames(cls.Sidebar, {}, [className])}>
			{menuItems.map(item => (
				<li key={item.id}>
					<a href={item.src}>
						<Image src={item.src} width={48} height={48} alt={item.title} />
					</a>
				</li>
			))}
		</ul>
	);
};
