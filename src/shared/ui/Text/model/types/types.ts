import { ReactNode } from 'react';
import {
	FontWeight,
	TextAlign,
	TextClamp,
	TextColor,
	TextSize,
	TextTag,
	TextType,
	TitleTag
} from './enums';

interface BaseTextProps {
	children: ReactNode;
	color?: TextColor;
	inheritColor?: boolean;
	fontSize?: TextSize;
	fontSizeMobile?: TextSize;
	fontWeight?: FontWeight;
	fontWeightMobile?: FontWeight;
	lineHeight?: string | number;
	textAlign?: TextAlign;
	margin?: string;
	uppercase?: boolean;
	truncate?: boolean;
	maxLines?: TextClamp;
	className?: string;
}

export interface TitleTextProps extends BaseTextProps {
	type: TextType.TITLE;
	tag?: TitleTag;
}

export interface BodyTextProps extends BaseTextProps {
	type?: TextType.TEXT;
	tag?: TextTag;
}

export type TextProps = TitleTextProps | BodyTextProps;

export type AllowedTag = TitleTag | TextTag;
