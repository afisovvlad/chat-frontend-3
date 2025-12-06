'use client';

import { classNames, Mods } from '@/shared/lib/classNames/classNames';
import { ReactNode } from 'react';
import styled from 'styled-components';
import {
	ButtonColor,
	ButtonFontSize,
	ButtonSize,
	ButtonTheme,
	ButtonType
} from '../model/type';
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
		btnType = ButtonType.BUTTON,
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

	const StyledButton = styled.button<ButtonProps>`
		width: ${widthDesktop || undefined};
		height: ${heightDesktop || undefined};

		@media(max-width: 768px) {
			width: ${widthMobile || undefined};
			height: ${heightMobile || undefined};
		`;

	return (
		<StyledButton
			className={classNames(cls.Button, mods, [className])}
			disabled={disabled}
			type={btnType}
		>
			{children}
		</StyledButton>
	);
};
