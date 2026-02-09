'use client';

import { memo } from 'react';
import { SearchInput, SearchInputProps } from '../SearchInput/SearchInput';
import { classNames } from '@/shared/lib/classNames/classNames';
import cls from './Search.module.scss';

export interface SearchProps extends Omit<SearchInputProps, 'ref'> {
	className?: string;
	inputRef?: React.Ref<HTMLInputElement>;
}

export const Search = memo<SearchProps>(
	({ className = '', inputRef, ...props }) => {
		return (
			<div className={classNames(cls.container, {}, [className])}>
				<SearchInput {...props} ref={inputRef} />
			</div>
		);
	}
);

Search.displayName = 'Search';
