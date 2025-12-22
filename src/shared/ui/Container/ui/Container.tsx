import { classNames } from '@/shared/lib/classNames/classNames';
import styles from './Container.module.scss';
import { ContainerTypeEnum } from '../model/enum';

interface ContainerProps {
	className?: string;
	children: React.ReactNode;
	type?: ContainerTypeEnum;
}

export function Container({
	children,
	className,
	type = ContainerTypeEnum.MAIN
}: ContainerProps) {
	const mods = {
		[styles.left]: type === ContainerTypeEnum.LEFT,
		[styles.right]: type === ContainerTypeEnum.RIGHT
	};

	return (
		<div className={classNames(styles.container, mods, [className])}>
			{children}
		</div>
	);
}
