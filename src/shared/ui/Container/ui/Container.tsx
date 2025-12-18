import { classNames } from '@/shared/lib/classNames/classNames';
import styles from './Container.module.scss';

interface ContainerProps {
	className?: string;
	children: React.ReactNode;
}

export function Container({ children, className }: ContainerProps) {
	return (
		<div className={classNames(styles.container, {}, [className])}>
			{children}
		</div>
	);
}
