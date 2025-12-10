import { JSX } from 'react';
import { TextTag, TextType, TitleTag } from '../model/enums';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Text.module.scss';
import { TextProps, AllowedTag } from '../model/type';

export const Text = (props: TextProps) => {
	const isTitle = props.type === TextType.TITLE;

	const {
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
	} = props;

	const defaultTag = isTitle ? TitleTag.H3 : TextTag.P;
	const resolvedTag = (tag ?? defaultTag) as AllowedTag;
	const typeClass = isTitle ? cls.text_title : cls.text_text;

	const dynamicStyles: React.CSSProperties = {
		...(color !== undefined ? { color } : {}),
		...(fontSize !== undefined ? { fontSize } : {}),
		...(fontWeight !== undefined ? { fontWeight } : {}),
		...(lineHeight !== undefined ? { lineHeight } : {}),
		...(textAlign !== undefined ? { textAlign } : {}),
		...(margin !== undefined ? { margin } : {}),
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
