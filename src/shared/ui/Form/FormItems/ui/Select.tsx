'use client';

import { CreateCustomStylesOptions } from '@/entities/Profile';
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
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	disabled?: boolean;
	icon?: JSX.Element;
	createCustomStyles?: (
		options?: CreateCustomStylesOptions
	) => StylesConfig<TOption, IsMulti, Group>;
	menu?: string;
	ariaLabel?: string;
}

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
	createCustomStyles,
	disabled = false,
	ariaLabel = '',
	rules = { required: 'Заполните поля' }
}: SelectProps<TFormValues, TOption, IsMulti, Group>) {
	const {
		formState: { errors }
	} = useFormContext<TFormValues>();

	const errorMessage = errors?.[name]?.message as string | undefined;
	const hasError = Boolean(errorMessage);

	return (
		<div className={clsx(classNameParentSelectWrapper)}>
			<Controller
				name={name}
				rules={rules}
				render={({ field }) => (
					<Select<TOption, IsMulti, Group>
						instanceId={name}
						options={options}
						value={field.value}
						onChange={field.onChange}
						onBlur={field.onBlur}
						name={field.name}
						aria-label={ariaLabel}
						placeholder={options[0]?.label}
						isDisabled={disabled}
						styles={createCustomStyles?.({ hasError })}
						components={{
							Option: CustomSelectOption,
							DropdownIndicator: CustomDropdownIndicator
						}}
						classNames={{
							control: state =>
								clsx(styles.control, classNameParentSelectControl, {
									[styles.hasError]: (
										state.selectProps as { hasError?: boolean }
									).hasError
								}),
							menu: () => clsx(styles.menu, classNameParentSelectMenu),
							menuList: () =>
								clsx(styles.menuList, classNameParentSelectMenuList),
							option: () => clsx(styles.option, classNameParentSelectOption),
							singleValue: () =>
								clsx(styles.singleValue, classNameParentSelectSingleValue),
							indicatorSeparator: () =>
								clsx(
									styles.indicatorSeparator,
									classNameParentSelectIndicatorSeparator
								)
						}}
					/>
				)}
			/>
		</div>
	);
}

// 'use client';

// import { CreateCustomStylesOptions } from '@/entities/Profile';
// import clsx from 'clsx';
// import { JSX } from 'react';
// import {
// 	Controller,
// 	FieldValues,
// 	Path,
// 	RegisterOptions,
// 	useFormContext
// } from 'react-hook-form';
// import Select, { GroupBase, StylesConfig } from 'react-select';
// import { CustomDropdownIndicator, CustomSelectOption } from '../..';
// import { SelectOption } from '../model/selectTypes';
// import styles from './styles.module.scss';

// interface SelectProps<
// 	TFormValues extends FieldValues,
// 	TOption extends SelectOption<unknown>,
// 	IsMulti extends boolean = false,
// 	Group extends GroupBase<TOption> = GroupBase<TOption>
// > {
// 	options: TOption[];
// 	name: Path<TFormValues>;
// 	classNameParentSelectWrapper?: string;
// 	classNameParentSelectControl?: string;
// 	classNameParentSelectMenu?: string;
// 	classNameParentSelectMenuList?: string;
// 	classNameParentSelectOption?: string;
// 	classNameParentSelectSingleValue?: string;
// 	classNameParentSelectIndicatorSeparator?: string;
// 	rules?: RegisterOptions<TFormValues, Path<TFormValues>> | undefined;
// 	disabled?: boolean;
// 	icon?: JSX.Element;
// 	createCustomStyles?:
// 		| StylesConfig<TOption, IsMulti, Group>
// 		| ((
// 				options?: CreateCustomStylesOptions
// 		  ) => StylesConfig<TOption, IsMulti, Group>)
// 		| undefined;
// 	menu?: string;
// 	ariaLabel?: string;
// }

// export function SelectItem<
// 	TFormValues extends FieldValues,
// 	TOption extends SelectOption<unknown>,
// 	IsMulti extends boolean = false,
// 	Group extends GroupBase<TOption> = GroupBase<TOption>
// >({
// 	options,
// 	name,
// 	classNameParentSelectWrapper,
// 	classNameParentSelectControl,
// 	classNameParentSelectMenu,
// 	classNameParentSelectMenuList,
// 	classNameParentSelectOption,
// 	classNameParentSelectSingleValue,
// 	classNameParentSelectIndicatorSeparator,
// 	createCustomStyles,
// 	disabled = false,
// 	ariaLabel = '',
// 	rules = {
// 		required: 'Заполните поля'
// 	}
// }: SelectProps<TFormValues, TOption, IsMulti, Group>) {
// 	const {
// 		formState: { errors }
// 	} = useFormContext<TFormValues>();

// 	const errorMessage = errors?.[name]?.message as string | undefined;
// 	const isError = Boolean(errorMessage);

// 	return (
// 		<div className={clsx(classNameParentSelectWrapper, {})}>
// 			<Controller
// 				name={name} // Ключ в данных формы
// 				// control={control} // Объект управления формой
// 				rules={rules}
// 				render={(
// 					{ field } // field содержит onChange, onBlur, value, name, ref
// 				) => (
// 					<Select<TOption, IsMulti, Group>
// 						components={{
// 							Option: CustomSelectOption,
// 							DropdownIndicator: CustomDropdownIndicator
// 						}}
// 						options={options}
// 						name={field.name} // Передаем имя из field
// 						placeholder={options[0]?.label}
// 						// Значение и обработчик изменения связываются с react-hook-form
// 						value={field.value}
// 						aria-label={ariaLabel}
// 						onChange={selectedOption => field.onChange(selectedOption)}
// 						onBlur={field.onBlur}
// 						hasError={!!isError}
// 						styles={
// 							typeof createCustomStyles === 'function'
// 								? createCustomStyles({ hasError: !!isError })
// 								: createCustomStyles
// 						}
// 						// classNames={{
// 						// 	control: () => clsx(`${classNameParentSelectControl || ''}`),
// 						// 	menu: () => `${classNameParentSelectMenu || ''}`,
// 						// 	menuList: () => `${classNameParentSelectMenuList || ''}`,
// 						// 	option: () => `${classNameParentSelectOption || ''}`,
// 						// 	singleValue: () => `${classNameParentSelectSingleValue || ''}`,
// 						// 	indicatorSeparator: () =>
// 						// 		`${classNameParentSelectIndicatorSeparator || ''}`
// 						// }}
// 						classNames={{
// 							control: state =>
// 								clsx(
// 									`${styles.control} ${classNameParentSelectControl || ''}`,
// 									{
// 										[styles.hasError]: (
// 											state.selectProps as typeof state.selectProps & {
// 												hasError?: boolean;
// 											}
// 										).hasError
// 									}
// 								),

// 							menu: () => `${styles.menu} ${classNameParentSelectMenu || ''}`,
// 							menuList: () =>
// 								`${styles.menuList} ${classNameParentSelectMenuList || ''}`,
// 							option: () =>
// 								`${styles.option} ${classNameParentSelectOption || ''}`,
// 							singleValue: () =>
// 								`${styles.singleValue} ${classNameParentSelectSingleValue || ''}`,
// 							indicatorSeparator: () =>
// 								`${styles.indicatorSeparator} ${classNameParentSelectIndicatorSeparator || ''}`
// 						}}
// 						isDisabled={disabled}
// 						instanceId={name}
// 					/>
// 				)}
// 			/>
// 		</div>
// 	);
// }
