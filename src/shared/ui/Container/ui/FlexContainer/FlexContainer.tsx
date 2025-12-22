import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './FlexContainer.module.scss';

interface FlexContainerProps {
	children: React.ReactNode;
	className?: string;
}

export const FlexContainer = ({ children, className }: FlexContainerProps) => {
	return (
		<div className={classNames(cls.flexContainer, {}, [className])}>
			{children}
		</div>
	);
};
