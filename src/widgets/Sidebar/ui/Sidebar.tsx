import { classNames } from '@/shared/lib/classNames/classNames';
import Image from 'next/image';
// import { Button } from '@/shared/ui/Button/Button';
import { menuItems } from '../model/const/menuItems';
import cls from './Sidebar.module.scss';

interface SidebarProps {
	className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
	return (
		<ul
			className={classNames(cls.Sidebar, { isActive: true, disabled: false }, [
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

			{/* <Button isActive={true} disabled={false}></Button> */}
		</ul>
	);
};
