'use client';

import { forwardRef, memo, useCallback, useMemo } from 'react';
import { SearchIcon, Close } from '@icons/index';
import {
	Button,
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button';
import { classNames } from '@/shared/lib/classNames/classNames';

import cls from './Search.module.scss';

export interface SearchProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'onChange' | 'ref'
> {
	className?: string;
	inputRef?: React.Ref<HTMLInputElement>;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	inputClassName?: string;
	disableClear?: boolean;
	showIcon?: boolean;
	onClear?: () => void;
}

export const Search = memo(
	forwardRef<HTMLInputElement, SearchProps>(
		(
			{
				value,
				onChange,
				placeholder = 'Поиск...',
				className = '',
				inputClassName = '',
				inputRef,
				disableClear = false,
				showIcon = true,
				onClear,
				onKeyDown,
				...inputProps
			},
			ref
		) => {
			const showClearButton = useMemo(
				() => !disableClear && value.trim().length > 0,
				[disableClear, value]
			);

			const handleClear = useCallback(() => {
				onChange('');
				onClear?.();
			}, [onChange, onClear]);

			const handleKeyDown = useCallback(
				(e: React.KeyboardEvent<HTMLInputElement>) => {
					if (e.key === 'Escape') {
						handleClear();
						e.currentTarget.blur();
					}
					onKeyDown?.(e);
				},
				[handleClear, onKeyDown]
			);

			const handleChange = useCallback(
				(e: React.ChangeEvent<HTMLInputElement>) => {
					onChange(e.target.value);
				},
				[onChange]
			);

			const containerClass = useMemo(
				() => classNames(cls.container, {}, [className]),
				[className]
			);

			const inputClass = useMemo(
				() => classNames(cls.input, {}, [inputClassName]),
				[inputClassName]
			);

			return (
				<div className={containerClass} role='search' aria-label='Поле поиска'>
					{showIcon && (
						<SearchIcon className={cls.searchIcon} aria-hidden='true' />
					)}

					<input
						ref={ref || inputRef}
						name='search'
						type='text'
						value={value}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						className={inputClass}
						aria-label={placeholder}
						autoComplete='search'
						spellCheck={false}
						{...inputProps}
					/>

					{showClearButton && (
						<Button
							btnType={ButtonType.BUTTON}
							color={ButtonColor.TRANSPARENT}
							theme={ButtonTheme.CLEAR}
							onClick={handleClear}
							className={cls.clearButton}
							aria-label='Очистить поиск'
						>
							<Close className={cls.closeIcon} aria-hidden='true' />
						</Button>
					)}
				</div>
			);
		}
	)
);

Search.displayName = 'Search';
