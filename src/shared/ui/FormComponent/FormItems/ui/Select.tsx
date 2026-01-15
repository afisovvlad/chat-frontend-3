'use client';

import { CustomStylesOptions } from '@/entities/Profile';
import { classNames } from '@/shared/lib/classNames/classNames';
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
	parentSelectClass?: string;
	parentSelectWrapperClass?: string;
	parentSelectControlClass?: string;
	parentSelectMenuClass?: string;
	parentSelectMenuListClass?: string;
	parentSelectOptionClass?: string;
	parentSelectSingleValueClass?: string;
	parentSelectIndicatorSeparatorClass?: string;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	disabled?: boolean;
	createCustomStyles?: (
		options?: CustomStylesOptions
	) => StylesConfig<TOption, IsMulti, Group>;
	// menu: string;
	ariaLabel?: string;
	hasError?: boolean;
}

export function SelectItem<
	TFormValues extends FieldValues,
	TOption extends SelectOption<unknown>,
	IsMulti extends boolean = false,
	Group extends GroupBase<TOption> = GroupBase<TOption>
>({
	options,
	name,
	parentSelectClass,
	parentSelectWrapperClass,
	parentSelectControlClass,
	parentSelectMenuClass,
	parentSelectMenuListClass,
	parentSelectOptionClass,
	parentSelectSingleValueClass,
	parentSelectIndicatorSeparatorClass,
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
		<div className={classNames(parentSelectWrapperClass || '', {}, [])}>
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
								classNames(
									styles.control,
									{
										[styles.hasError]: hasError
									},
									// {
									// 	[styles.hasError]: (
									// 		state.selectProps as { hasError?: boolean }
									// 	).hasError
									// },
									[parentSelectClass, parentSelectControlClass]
								),
							menu: () => classNames(styles.menu, {}, [parentSelectMenuClass]),
							menuList: () =>
								classNames(styles.menuList, {}, [parentSelectMenuListClass]),
							option: () =>
								classNames(styles.option, {}, [parentSelectOptionClass]),
							singleValue: () =>
								classNames(styles.singleValue, {}, [
									parentSelectSingleValueClass
								]),
							indicatorSeparator: () =>
								classNames(styles.indicatorSeparator, {}, [
									parentSelectIndicatorSeparatorClass
								])
						}}
					/>
				)}
			/>
		</div>
	);
}
