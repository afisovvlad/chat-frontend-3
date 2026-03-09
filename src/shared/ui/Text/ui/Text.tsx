'use client';
import { JSX } from 'react';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import { TextTag, TextType, TitleTag } from '../model/types/enums';
import { classNames } from '@/shared/lib/classNames/classNames';
import { TextProps, AllowedTag } from '../model/types/types';
import cls from './Text.module.scss';

export const Text = (props: TextProps) => {
	const {
		type = TextType.TEXT,
		children,
		color,
		fontSize,
		fontSizeMobile,
		fontWeight,
		fontWeightMobile,
		lineHeight,
		textAlign,
		truncate = false,
		uppercase = false,
		maxLines,
		className = '',
		tag
	} = props;

	const isMobile = useMediaQuery(768);

	const isTitle = type === TextType.TITLE;
	const defaultTag = isTitle ? TitleTag.H3 : TextTag.P;
	const resolvedTag = (tag ?? defaultTag) as AllowedTag;
	const typeClass = isTitle ? cls.text_title : cls.text_text;

	const dynamicStyles: React.CSSProperties = {
		...(color !== undefined ? { color } : {}),
		...(fontSize !== undefined && {
			fontSize: isMobile && fontSizeMobile ? fontSizeMobile : fontSize
		}),
		...(fontWeight !== undefined && {
			fontWeight: isMobile && fontWeightMobile ? fontWeightMobile : fontWeight
		}),
		...(lineHeight !== undefined ? { lineHeight } : {}),
		...(textAlign !== undefined ? { textAlign } : {}),
		...(uppercase ? { textTransform: 'uppercase' } : {})
	};

	const allClasses = [
		cls.text,
		typeClass,
		...(truncate ? [cls.text_truncate] : []),
		...(!truncate && maxLines ? [cls[`clamp-${maxLines}`]] : []),
		...(className ? [className] : [])
	];

	const Tag = resolvedTag as keyof JSX.IntrinsicElements;

	return (
		<Tag className={classNames(cls.text, {}, allClasses)} style={dynamicStyles}>
			{children}
		</Tag>
	);
};
