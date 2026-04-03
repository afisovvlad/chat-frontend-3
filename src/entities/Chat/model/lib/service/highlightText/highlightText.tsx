import { classNames } from '@/shared/lib/classNames/classNames';
import React from 'react';

export interface HighlightOptions {
	query: string;
	activeIndices?: number[];
	baseClassName?: string;
	activeClassName?: string;
	caseSensitive?: boolean;
}

/**
 * Подсвечивает вхождения запроса в тексте
 * @param content - исходный текст
 * @param options - настройки подсветки
 * @returns React.ReactNode с размеченными совпадениями
 */
export const highlightText = (
	content: string,
	options: HighlightOptions
): React.ReactNode => {
	const {
		query,
		activeIndices = [],
		baseClassName = '',
		activeClassName = '',
		caseSensitive = false
	} = options;

	// Если запрос пустой — возвращаем строку (валидный ReactNode)
	if (!query.trim()) {
		return content;
	}

	// Экранируем спецсимволы для безопасного использования в RegExp
	const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const flags = caseSensitive ? 'g' : 'gi';

	// Используем захватывающую группу (), чтобы split сохранял совпадения в результате
	const regex = new RegExp(`(${escapedQuery})`, flags);
	const parts = content.split(regex);

	let occurrenceCounter = 0;

	return parts.map((part, index) => {
		// Если часть пустая — пропускаем (но возвращаем null с ключом)
		if (!part) {
			return null;
		}

		// Проверяем, является ли часть совпадением (точное совпадение)
		const matchRegex = new RegExp(
			`^${escapedQuery}$`,
			caseSensitive ? '' : 'i'
		);
		const isMatch = matchRegex.test(part);

		if (isMatch) {
			const isActive = activeIndices.includes(occurrenceCounter);
			occurrenceCounter++;

			return (
				<mark
					key={index}
					className={classNames(baseClassName, {
						[activeClassName]: isActive
					})}
				>
					{part}
				</mark>
			);
		}

		// Обычный текст оборачиваем в span для сохранения ключей
		return <span key={index}>{part}</span>;
	});
};
