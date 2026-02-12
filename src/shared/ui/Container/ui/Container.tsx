'use client';

import { memo, useMemo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import { ContainerType } from '../model/enum';
import cls from './Container.module.scss';

interface ContainerProps {
	className?: string;
	children: React.ReactNode;
	type?: ContainerType;
}

const ContainerComponent = ({
	children,
	className,
	type = ContainerType.MAIN
}: ContainerProps) => {
	// Мемоизируем модификаторы для предотвращения пересоздания объекта
	const mods = useMemo(() => {
		if (type === ContainerType.WRAPPER) {
			return {};
		}
		return {
			[cls.sidebar]: type === ContainerType.SIDEBAR,
			[cls.content]: type === ContainerType.CONTENT
		};
	}, [type]);

	// Для WRAPPER — отдельный класс
	if (type === ContainerType.WRAPPER) {
		return (
			<div className={classNames(cls.wrapper, {}, [className])}>{children}</div>
		);
	}

	// Для остальных — классический container с модификаторами
	return (
		<div className={classNames(cls.container, mods, [className])}>
			{children}
		</div>
	);
};

// Оборачиваем в memo для предотвращения лишних ререндеров
export const Container = memo(ContainerComponent);

Container.displayName = 'Container';
