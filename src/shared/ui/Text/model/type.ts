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

export interface TitleTextProps {
	type: TextType.TITLE;
	tag?: TitleTag;
	children: ReactNode;
	color?: TextColor;
	fontSize?: TextSize;
	fontWeight?: FontWeight;
	lineHeight?: string | number;
	textAlign?: TextAlign;
	margin?: string;
	uppercase?: boolean;
	truncate?: boolean;
	maxLines?: TextClamp;
	className?: string;
}

export interface BodyTextProps {
	type?: TextType.TEXT;
	tag?: TextTag;
	children: ReactNode;
	color?: TextColor;
	fontSize?: TextSize;
	fontWeight?: FontWeight;
	lineHeight?: string | number;
	textAlign?: TextAlign;
	margin?: string;
	uppercase?: boolean;
	truncate?: boolean;
	maxLines?: TextClamp;
	className?: string;
}

export type TextProps = TitleTextProps | BodyTextProps;

export type AllowedTag = TitleTag | TextTag;
