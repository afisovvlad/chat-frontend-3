import { DateOption } from '@/shared/ui/Form/FormItems/model/selectTypes';
import { StylesConfig } from 'react-select';
import { CustomStylesOptions } from '../../model/types/ProfileSchema';

export const createCustomStyles = (
	options: CustomStylesOptions = {}
): StylesConfig<DateOption, boolean> => {
	const { hasError } = options;

	return {
		control: (base, state) => ({
			...base,
			position: 'relative',
			minHeight: 56,
			fontFamily: 'inherit',
			lineHeight: '130%',
			letterSpacing: '0.4px',
			borderRadius: state.menuIsOpen ? '8px 8px 0 0' : '8px',
			border: state.menuIsOpen
				? '1px solid var(--color-primary)'
				: `1px solid ${hasError ? 'transparent' : 'var(--settings-border-color)'}`,
			outline: hasError ? '2px solid var(--color-red)' : 'none',
			boxShadow: 'none',

			'&:hover': {
				borderColor: hasError ? 'var(--color-red)' : 'var(--color-primary)'
			},

			'&:focus': {
				borderColor: 'var(--color-primary)'
			}
		}),

		menu: base => ({
			...base,
			minHeight: 140,
			maxHeight: 140,
			marginTop: 0,
			marginBottom: '4px',
			padding: '4px 6px 4px 10px',
			border: '1px solid var(--color-primary)',
			borderTop: 'none ',
			borderRadius: '0 0 8px 8px',
			boxShadow: 'none',
			overflow: 'hidden'
		}),

		menuList: base => ({
			...base,
			maxHeight: 140,
			overflowY: 'auto'
		}),

		option: (base, state) => ({
			...base,
			padding: '0 0 4px 0',
			backgroundColor: state.isSelected
				? 'transparent'
				: state.isFocused
					? 'transparent'
					: 'transparent',
			color: 'var(--color-black)',
			cursor: 'pointer'
		}),

		// singleValue: base => ({
		// 	...base,
		// 	color: '#000'
		// }),

		indicatorSeparator: () => ({
			display: 'none'
		})
	};
};
