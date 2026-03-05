import { classNames } from '@/shared/lib/classNames/classNames';
import { useEffect, useRef } from 'react';
import { KebabMenuItem } from '../model/types/type';
import cls from './KebabMenu.module.scss';

interface KebabMenuProps {
	className?: string;
	visible: boolean;
	items: KebabMenuItem[];
	onClose?: () => void;
}

export const KebabMenu = ({
	className,
	visible,
	items,
	onClose
}: KebabMenuProps) => {
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!visible) {
			return;
		}

		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node) &&
				onClose
			) {
				onClose();
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [visible, onClose]);

	if (!visible) {
		return null;
	}

	return (
		<div
			ref={menuRef}
			className={classNames(cls.KebabMenuList, {}, [className])}
		>
			{items.map(item => (
				<div
					key={item.text}
					className={classNames(cls.kebabMenuItem, {
						[cls.danger]: item.danger
					})}
					onClick={item.onClick}
				>
					<div className={cls.kebabMenuItemText}>{item.text}</div>
					<div className={cls.kebabMenuItemIcon}>{item.icon}</div>
				</div>
			))}
		</div>
	);
};
