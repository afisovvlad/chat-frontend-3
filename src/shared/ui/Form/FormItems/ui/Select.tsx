'use client';

import clsx from 'clsx';
import { JSX } from 'react';
import {
	Controller,
	FieldValues,
	Path,
	RegisterOptions,
	useFormContext
} from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';
import { CustomDropdownIndicator, CustomSelectOption } from '../..';
import styles from './styles.module.scss';
import { SelectOption } from '../model/selectTypes';

interface SelectProps<
	TFormValues extends FieldValues,
	TOption extends SelectOption<unknown>
> {
	options: TOption[];
	name: Path<TFormValues>;
	classNameParentSelectWrapper?: string;
	classNameSelect?: string;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>> | undefined;
	disabled?: boolean;
	icon?: JSX.Element;
	customStyles?:
		| StylesConfig<TOption>
		| ((width?: number | string) => StylesConfig<TOption>);
	menu?: string;
	width?: number | string;
}

export function SelectItem<
	TFormValues extends FieldValues,
	TOption extends SelectOption<unknown>
>({
	options,
	name,
	classNameParentSelectWrapper,
	customStyles,
	disabled = false,
	width,
	rules = {
		required: 'Заполните это поле'
	}
}: SelectProps<TFormValues, TOption>) {
	const {
		formState: { errors }
	} = useFormContext<TFormValues>();

	const errorMessage = errors?.[name]?.message as string | undefined;
	const isError = Boolean(errorMessage);

	console.log(errors);

	return (
		<div className={clsx(classNameParentSelectWrapper, {})}>
			<Controller
				name={name} // Ключ в данных формы
				// control={control} // Объект управления формой
				rules={rules}
				render={(
					{ field } // field содержит onChange, onBlur, value, name, ref
				) => (
					<Select<TOption>
						components={{
							Option: CustomSelectOption,
							DropdownIndicator: CustomDropdownIndicator
						}}
						options={options}
						name={field.name} // Передаем имя из field
						// Значение и обработчик изменения связываются с react-hook-form
						value={options.find(option => option.value === field.value) || null}
						onChange={selectedOption =>
							field.onChange(selectedOption?.value || '')
						}
						onBlur={field.onBlur}
						styles={
							customStyles
								? typeof customStyles === 'function'
									? customStyles(width)
									: customStyles
								: {}
						}
						classNames={{
							menuList: () => styles.menuList
						}}
						isDisabled={disabled}
						instanceId={name}
					/>
				)}
			/>
		</div>
	);
}
