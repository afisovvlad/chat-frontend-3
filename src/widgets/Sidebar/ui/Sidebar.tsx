import { classNames } from '@/shared/lib/classNames/classNames';
import { Button } from '@/shared/lib/ui/Button/Button';
import { memo } from 'react';
import cls from './Sidebar.module.scss';

interface SidebarProps {
	className?: string;
}

export const Sidebar = memo(({ className }: SidebarProps) => {
	return (
		<div
			className={classNames(cls.Sidebar, { isActive: true, disabled: false }, [
				className
			])}
		>
			<Button isActive={true} disabled={false}></Button>
		</div>
	);
});
