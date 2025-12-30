'use client';

import { SelectOption } from '@/shared/ui/Form/FormItems/model/types';
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
import { CustomDropdownIndicator } from '../..';
import { CustomSelectOption } from './CustomSelectOption';
import styles from './styles.module.scss';

interface SelectProps<
	TFormValues extends FieldValues,
	Option extends SelectOption = SelectOption
> {
	options: { value: string; label: string }[];
	name: Path<TFormValues>;
	classNameParentSelectWrapper?: string;
	classNameSelect?: string;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>> | undefined;
	disabled?: boolean;
	icon?: JSX.Element;
	customStyles:
		| StylesConfig<Option>
		| ((width?: number | string) => StylesConfig<Option>);
	menu?: string;
	width?: number | string;
}

export function SelectItem<TFormValues extends FieldValues>({
	options,
	name,
	classNameParentSelectWrapper,
	customStyles,
	icon,
	disabled = false,
	width,
	rules = {
		required: 'Заполните это поле'
	}
}: SelectProps<TFormValues>) {
	const {
		// register,
		// control,
		// watch,
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
					<Select<SelectOption>
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
						styles={customStyles<SelectOption>(width)}
						classNames={{
							menuList: () => styles.menuList
						}}
						// styles={customStyles}
						// className={clsx(styles.select, classNameSelect, {
						// 	[styles.hasError]: isError,
						// 	[styles.disabled]: disabled
						// })}
						isDisabled={disabled}
						instanceId={name}
						// ref={field.ref}
						// isError={isError}
					/>
				)}
			/>
		</div>
	);
}

// return (
//   <div className={clsx(classNameParentSelectWrapper, {})}>
//     <select
//       id={name}
//       {...register(name, rules)}
//       // placeholder={placeholder}
//       disabled={disabled}
//       autoComplete={FormAuthItemAutocomplete.OFF}
//       className={clsx(styles.select, classNameParentSelect, {
//         [styles.hasError]: isError,
//         [styles.disabled]: disabled
//       })}
//     >
//       {options.map(option => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//     {icon && icon}
//   </div>
// );
