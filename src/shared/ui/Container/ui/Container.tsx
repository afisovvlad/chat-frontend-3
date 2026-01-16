import { classNames } from '@/shared/lib/classNames/classNames';
import { ContainerType } from '../model/enum';
import cls from './Container.module.scss';

interface ContainerProps {
	className?: string;
	children: React.ReactNode;
	type?: ContainerType;
}

export function Container({
	children,
	className,
	type = ContainerType.MAIN
}: ContainerProps) {
	// Для WRAPPER — отдельный класс
	if (type === ContainerType.WRAPPER) {
		return (
			<div className={classNames(cls.wrapper, {}, [className])}>{children}</div>
		);
	}

	// Для остальных — классический container с модификаторами
	const mods = {
		[cls.sidebar]: type === ContainerType.SIDEBAR,
		[cls.content]: type === ContainerType.CONTENT
	};

	return (
		<div className={classNames(cls.container, mods, [className])}>
			{children}
		</div>
	);
}
