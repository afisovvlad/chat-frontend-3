import { classNames, Mods } from '@/shared/lib/classNames/classNames';
import { ReactNode } from 'react';
import cls from './Button.module.scss';

export enum ButtonColor {
	PRIMARY = 'primary',
	DANGER = 'danger',
	GREEN = 'green',
	TRANSPARENT = 'transparent'
}

export enum ButtonTheme {
	CLEAR = 'clear',
	OUTLINE = 'outline',
	BACKGROUND = 'background',
	// преимущественно для кнопок внутри которых есть иконка
	CIRCLE = 'circle'
}

export enum ButtonSize {
	// в основном для кнопок в модалках
	S = 'size_s',
	M = 'size_m',
	// в основном для кнопок на всю ширину родителя
	L = 'size_l'
}

export enum ButtonFontSize {
	S = 'fs_16',
	M = 'fs_18'
}

interface ButtonProps {
	className?: string;
	color?: ButtonColor;
	theme?: ButtonTheme;
	size?: ButtonSize;
	fontSize?: ButtonFontSize;
	disabled?: boolean;
	callBtn?: boolean;
	widthDesktop?: string;
	heightDesktop?: string;
	widthMobile?: string;
	heightMobile?: string;
	children?: ReactNode;
}

export const Button = (props: ButtonProps) => {
	const {
		className,
		color = ButtonColor.PRIMARY,
		theme = ButtonTheme.BACKGROUND,
		size = ButtonSize.L,
		fontSize = ButtonFontSize.S,
		disabled = false,
		callBtn = false,
		widthDesktop,
		heightDesktop,
		widthMobile,
		heightMobile,
		children
	} = props;

	const mods: Mods = {
		[cls[theme]]: true,
		[cls[color]]: true,
		[cls[size]]: true,
		[cls[fontSize]]: true,
		[cls.callBtn]: callBtn,
		[cls.disabled]: disabled
	};

	const buttonStyles = {
		width: widthDesktop || undefined,
		height: heightDesktop || undefined,
		'@media (maxWidth: 768px)': {
			width: widthMobile || undefined,
			height: heightMobile || undefined
		}
	};

	return (
		<button
			className={classNames(cls.Button, mods, [className])}
			style={buttonStyles}
		>
			{children}
		</button>
	);
};
