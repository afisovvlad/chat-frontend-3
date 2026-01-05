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
import Select, { GroupBase, StylesConfig } from 'react-select';
import { CustomDropdownIndicator, CustomSelectOption } from '../..';
import { SelectOption } from '../model/selectTypes';
import styles from './styles.module.scss';

interface SelectProps<
	TFormValues extends FieldValues,
	TOption extends SelectOption<unknown>,
	IsMulti extends boolean = false,
	Group extends GroupBase<TOption> = GroupBase<TOption>
> {
	options: TOption[];
	name: Path<TFormValues>;
	classNameParentSelectWrapper?: string;
	classNameParentSelectControl?: string;
	classNameParentSelectMenu?: string;
	classNameParentSelectMenuList?: string;
	classNameParentSelectOption?: string;
	classNameParentSelectSingleValue?: string;
	classNameParentSelectIndicatorSeparator?: string;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>> | undefined;
	disabled?: boolean;
	icon?: JSX.Element;
	customStyles?:
		| StylesConfig<TOption, IsMulti, Group>
		| ((hasError?: boolean) => StylesConfig<TOption, IsMulti, Group>)
		| undefined;
	// customStyles?: StylesConfig<TOption, IsMulti, Group> | undefined;
	menu?: string;
	ariaLabel?: string;
}

const emptyStyles = <TOption extends SelectOption<unknown>>(): StylesConfig<
	TOption,
	false
> => {
	return {
		control: base => ({
			...base,
			all: 'unset'
		}),
		menu: base => ({
			...base,
			all: 'unset'
		}),
		menuList: base => ({
			...base,
			all: 'unset'
		}),
		option: base => ({
			...base,
			all: 'unset'
		})
	};
};

export function SelectItem<
	TFormValues extends FieldValues,
	TOption extends SelectOption<unknown>,
	IsMulti extends boolean = false,
	Group extends GroupBase<TOption> = GroupBase<TOption>
>({
	options,
	name,
	classNameParentSelectWrapper,
	classNameParentSelectControl,
	classNameParentSelectMenu,
	classNameParentSelectMenuList,
	classNameParentSelectOption,
	classNameParentSelectSingleValue,
	classNameParentSelectIndicatorSeparator,
	customStyles,
	disabled = false,
	ariaLabel = '',
	rules = {
		required: 'Заполните поля'
	}
}: SelectProps<TFormValues, TOption, IsMulti, Group>) {
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
					<Select<TOption, IsMulti, Group>
						components={{
							Option: CustomSelectOption,
							DropdownIndicator: CustomDropdownIndicator
						}}
						options={options}
						name={field.name} // Передаем имя из field
						placeholder={options[0]?.label}
						// Значение и обработчик изменения связываются с react-hook-form
						value={field.value}
						aria-label={ariaLabel}
						// defaultValue={options[4].value}
						onChange={selectedOption => field.onChange(selectedOption)}
						onBlur={field.onBlur}
						hasError={!!isError}
						styles={
							typeof customStyles === 'function'
								? customStyles(isError)
								: customStyles
						}
						// classNames={{
						// 	control: () => clsx(`${classNameParentSelectControl || ''}`),
						// 	menu: () => `${classNameParentSelectMenu || ''}`,
						// 	menuList: () => `${classNameParentSelectMenuList || ''}`,
						// 	option: () => `${classNameParentSelectOption || ''}`,
						// 	singleValue: () => `${classNameParentSelectSingleValue || ''}`,
						// 	indicatorSeparator: () =>
						// 		`${classNameParentSelectIndicatorSeparator || ''}`
						// }}
						classNames={{
							control: state =>
								clsx(
									styles.control,
									`${styles.control} ${classNameParentSelectControl || ''}`,
									{
										[styles.hasError]: (
											state.selectProps as typeof state.selectProps & {
												hasError?: boolean;
											}
										).hasError
									}
								),

							menu: () => `${styles.menu} ${classNameParentSelectMenu || ''}`,
							menuList: () =>
								`${styles.menuList} ${classNameParentSelectMenuList || ''}`,
							option: () =>
								`${styles.option} ${classNameParentSelectOption || ''}`,
							singleValue: () =>
								`${styles.singleValue} ${classNameParentSelectSingleValue || ''}`,
							indicatorSeparator: () =>
								`${styles.indicatorSeparator} ${classNameParentSelectIndicatorSeparator || ''}`
						}}
						isDisabled={disabled}
						instanceId={name}
					/>
				)}
			/>
		</div>
	);
}
