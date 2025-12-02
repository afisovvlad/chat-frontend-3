import { classNames, Mods } from '@/shared/lib/classNames/classNames';
import { ReactNode } from 'react';
import cls from './Button.module.scss';

export enum ButtonColor {
	PRIMARY = 'primary',
	DANGER = 'danger',
	GREEN = 'green'
}

export enum ButtonTheme {
	CLEAR = 'clear',
	OUTLINE = 'outline',
	DISABLED = 'disabled',
	BACKGROUND = 'background',
	BACKGROUND_DISABLED = 'backgroundDisabled'
}

export enum ButtonSize {
	S = 'size_s',
	M = 'size_m',
	L = 'size_l'
}

interface ButtonProps {
	className?: string;
	color?: ButtonColor;
	theme?: ButtonTheme;
	size?: ButtonSize;
	disabled?: boolean;
	children?: ReactNode;
}

export const Button = (props: ButtonProps) => {
	const {
		className,
		color = ButtonColor.PRIMARY,
		theme = ButtonTheme.BACKGROUND,
		size = ButtonSize.L,
		disabled,
		children
	} = props;

	const mods: Mods = {
		[cls[theme]]: true,
		[cls[color]]: true,
		[cls[size]]: true,
		[cls.disabled]: disabled
	};

	return (
		<button className={classNames(cls.Button, mods, [className])}>
			{children}
		</button>
	);
};
