'use client';

import { forwardRef, memo, useCallback } from 'react';
import { SearchIcon, Close } from '@icons/index';
import {
	Button,
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './SearchInput.module.scss';

export interface SearchInputProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'onChange'
> {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	inputClassName?: string;
	disableClear?: boolean;
	showIcon?: boolean;
	onClear?: () => void;
}

export const SearchInput = memo(
	forwardRef<HTMLInputElement, SearchInputProps>(
		(
			{
				value,
				onChange,
				placeholder = 'Поиск...',
				className = '',
				inputClassName = '',
				disableClear = false,
				showIcon = true,
				onClear,
				onKeyDown,
				...inputProps
			},
			ref
		) => {
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

			const showClearButton = !disableClear && value.trim().length > 0;

			return (
				<div
					className={classNames(cls.container, {}, [className])}
					role='search'
					aria-label='Поле поиска'
				>
					{showIcon && (
						<SearchIcon className={cls.searchIcon} aria-hidden='true' />
					)}

					<input
						ref={ref}
						name='search'
						type='text'
						value={value}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						className={classNames(cls.input, {}, [inputClassName])}
						aria-label={placeholder}
						autoComplete='off'
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

SearchInput.displayName = 'SearchInput';
