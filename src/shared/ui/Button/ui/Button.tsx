import { classNames, Mods } from '@/shared/lib/classNames/classNames';
import { ReactNode } from 'react';

import {
	ButtonColor,
	ButtonFontSize,
	ButtonSize,
	ButtonTheme,
	ButtonType
} from '../model/types/type';
import cls from './Button.module.scss';

interface ButtonProps {
	className?: string;
	color?: ButtonColor;
	theme?: ButtonTheme;
	size?: ButtonSize;
	fontSize?: ButtonFontSize;
	disabled?: boolean;
	callBtn?: boolean;
	btnType?: ButtonType;
	children?: ReactNode;
	onClick?: () => void;
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
		btnType = ButtonType.BUTTON,
		children,
		onClick
	} = props;

	const mods: Mods = {
		[cls[theme]]: true,
		[cls[color]]: true,
		[cls[size]]: true,
		[cls[fontSize]]: true,
		[cls.callBtn]: callBtn,
		[cls.disabled]: disabled
	};

	return (
		<button
			className={classNames(cls.Button, mods, [className])}
			disabled={disabled}
			type={btnType}
			onClick={onClick}
		>
			{children}
		</button>
	);
};
