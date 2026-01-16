import { Down } from '@icons/index';
import { components, DropdownIndicatorProps } from 'react-select';
import styles from './styles.module.scss';

export const CustomDropdownIndicator = <
	Option,
	IsMulti extends boolean = false
>(
	props: DropdownIndicatorProps<Option, IsMulti>
) => {
	const { selectProps } = props;
	const isOpen = selectProps.menuIsOpen;

	return (
		<components.DropdownIndicator {...props}>
			<span
				style={{
					display: 'flex',
					width: '12px',
					height: '7.4px',
					transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
					transition: 'transform 0.2s ease'
				}}
			>
				<Down className={styles.iconDown} />
			</span>
		</components.DropdownIndicator>
	);
};
