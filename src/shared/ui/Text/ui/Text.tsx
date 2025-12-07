import { ReactNode } from 'react';
import { TextType } from '../model/type';
import cls from './Text.module.scss';
import { classNames } from '@/shared/lib/classNames/classNames';

export interface TextProps {
	type?: TextType;
	children: ReactNode;
	color?: string;
	fontSize?: string | number;
	fontWeight?: string | number;
	lineHeight?: string | number;
	textAlign?: 'left' | 'center' | 'right' | 'justify';
	margin?: string;
	uppercase?: boolean;
	truncate?: boolean;
	maxLines?: 2 | 3;
	className?: string;
	tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const Text = ({
	type = TextType.TEXT,
	children,
	color,
	fontSize,
	fontWeight,
	lineHeight,
	textAlign,
	margin,
	truncate = false,
	uppercase = false,
	maxLines,
	className = '',
	tag
}: TextProps) => {
	const defaultTag = type === TextType.TITLE ? 'h3' : 'p';

	const Tag = tag ?? defaultTag;

	const baseStyles: React.CSSProperties = {};
	if (type === TextType.TITLE) {
		baseStyles.fontSize = 'var(--font-size-32)';
		baseStyles.fontWeight = '600';
		baseStyles.color = 'var(--foreground-primary)';
	} else {
		baseStyles.fontSize = 'var(--font-size-16)';
		baseStyles.fontWeight = '400';
		baseStyles.color = 'var(--foreground-secondary)';
	}

	const customStyles: React.CSSProperties = {};

	if (color !== undefined) {
		customStyles.color = color;
	}
	if (fontSize !== undefined) {
		customStyles.fontSize = fontSize;
	}
	if (fontWeight !== undefined) {
		customStyles.fontWeight = fontWeight;
	}
	if (lineHeight !== undefined) {
		customStyles.lineHeight = lineHeight;
	}
	if (textAlign !== undefined) {
		customStyles.textAlign = textAlign;
	}
	if (uppercase) {
		customStyles.textTransform = 'uppercase';
	}
	if (margin !== undefined) {
		customStyles.margin = margin;
	}

	let truncateStyles: React.CSSProperties = {};
	const additionalClasses = [cls.text];

	if (truncate) {
		truncateStyles = {
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			textOverflow: 'ellipsis'
		};
	} else if (maxLines) {
		additionalClasses.push(cls[`clamp-${maxLines}`]);
	}

	const mergedStyles: React.CSSProperties = {
		...baseStyles,
		...customStyles,
		...truncateStyles
	};

	return (
		<Tag
			className={classNames(cls.text, {}, [className, ...additionalClasses])}
			style={mergedStyles}
		>
			{children}
		</Tag>
	);
};

export { TextType };
