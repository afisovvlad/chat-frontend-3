'use client';

import { JSX, memo, useMemo } from 'react';
import { TextTag, TextType, TitleTag } from '../model/types/enums';
import { classNames } from '@/shared/lib/classNames/classNames';
import { TextProps, AllowedTag } from '../model/types/types';
import cls from './Text.module.scss';

const TextComponent = (props: TextProps) => {
	const {
		type = TextType.TEXT,
		children,
		color,
		fontSize,
		fontWeight,
		lineHeight,
		textAlign,
		truncate = false,
		uppercase = false,
		maxLines,
		className = '',
		tag
	} = props;

	// ✅ Мемоизируем вычисляемые значения

	// Определяем тип текста (заголовок или обычный текст)
	const isTitle = useMemo(() => type === TextType.TITLE, [type]);

	// Определяем тег по умолчанию
	const defaultTag = useMemo(
		() => (isTitle ? TitleTag.H3 : TextTag.P),
		[isTitle]
	);

	// Определяем итоговый тег
	const resolvedTag = useMemo(
		() => (tag ?? defaultTag) as AllowedTag,
		[tag, defaultTag]
	);

	// Определяем класс типа
	const typeClass = useMemo(
		() => (isTitle ? cls.text_title : cls.text_text),
		[isTitle]
	);

	//  Мемоизируем динамические стили
	// Пересоздаются только при изменении соответствующих пропсов
	const dynamicStyles = useMemo<React.CSSProperties>(() => {
		const styles: React.CSSProperties = {};

		if (color !== undefined) {
			styles.color = color;
		}
		if (fontSize !== undefined) {
			styles.fontSize = fontSize;
		}
		if (fontWeight !== undefined) {
			styles.fontWeight = fontWeight;
		}
		if (lineHeight !== undefined) {
			styles.lineHeight = lineHeight;
		}
		if (textAlign !== undefined) {
			styles.textAlign = textAlign;
		}
		if (uppercase) {
			styles.textTransform = 'uppercase';
		}

		return styles;
	}, [color, fontSize, fontWeight, lineHeight, textAlign, uppercase]);

	// ✅ Мемоизируем массив классов
	// Пересоздаётся только при изменении зависимостей
	const allClasses = useMemo(() => {
		const classes = [cls.text, typeClass];

		if (truncate) {
			classes.push(cls.text_truncate);
		} else if (maxLines) {
			classes.push(cls[`clamp-${maxLines}`]);
		}

		if (className) {
			classes.push(className);
		}

		return classes;
	}, [typeClass, truncate, maxLines, className]);

	// ✅ Мемоизируем итоговый класс через classNames
	const finalClassName = useMemo(
		() => classNames(cls.text, {}, allClasses),
		[allClasses]
	);

	// Определяем тег для рендера
	const Tag = resolvedTag as keyof JSX.IntrinsicElements;

	return (
		<Tag className={finalClassName} style={dynamicStyles}>
			{children}
		</Tag>
	);
};

//  Оборачиваем в memo для предотвращения лишних ререндеров
export const Text = memo(TextComponent);

Text.displayName = 'Text';
