import { classNames } from '@/shared/lib/classNames/classNames';
import { Button } from '@/shared/ui/Button/Button';
import cls from './Sidebar.module.scss';

interface SidebarProps {
	className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
	return (
		<div
			className={classNames(cls.Sidebar, { isActive: true, disabled: false }, [
				className
			])}
		>
			<Button disabled={false}></Button>
		</div>
	);
};
