import { Check } from '@icons/index';
import { components, OptionProps } from 'react-select';
export const CustomSelectOption = <Option, IsMulti extends boolean = false>(
	props: OptionProps<Option, IsMulti>
) => {
	const { isSelected, children } = props;

	return (
		<components.Option {...props}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 8
				}}
			>
				<span>{children}</span>

				{isSelected && (
					<span
						style={{
							display: 'flex',
							width: 18,
							height: 13.5,
							color: 'var(--color-black)'
						}}
					>
						<Check />
					</span>
				)}
			</div>
		</components.Option>
	);
};
