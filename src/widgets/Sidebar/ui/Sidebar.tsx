import { classNames } from '@/shared/lib/classNames/classNames';
import { Button } from '@/shared/ui/Button';
import Image from 'next/image';
import cls from './Sidebar.module.scss';
import { menuItems } from '../model/const/menuItems';

interface SidebarProps {
	className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
	return (
		<ul
			className={classNames(cls.Sidebar, {}, [
				className
			])}
		>
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
