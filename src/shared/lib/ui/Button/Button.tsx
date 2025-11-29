import { memo } from 'react';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Button.module.scss';

interface ButtonProps {
	isActive?: boolean;
	disabled?: boolean;
}

export const Button = ({ isActive, disabled }: ButtonProps) => {
	return (
		<div
			className={classNames(
				cls.Button,
				{ isActive: isActive, disabled: disabled },
				[]
			)}
		></div>
	);
};
