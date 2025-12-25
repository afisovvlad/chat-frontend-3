'use client';

import { Input, Label, SelectItem, Textarea } from '@/shared/ui/Form';
import {
	FormAuthItemAutocomplete,
	FormAuthItemType
} from '@/shared/ui/Form/FormItems/model/types';
import clsx from 'clsx';
import { useEffect } from 'react';
import {
	FieldValues,
	Path,
	RegisterOptions,
	useFormContext
} from 'react-hook-form';
import styles from './FormSettingsItem.module.scss';

interface FormItemProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	type: FormAuthItemType;
	label?: string;
	placeholder?: string;
	autoComplete?: FormAuthItemAutocomplete;
	disabled?: boolean;
	isRequired?: boolean;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	length?: number; // для code
	classNameParentLabel?: string;
	classNameParentInput?: string;
	classNameParentWrapper?: string;
	classNameParentSelect?: string;
	onValueChange?: (value: string) => void; // для реакции на ввод сразу
	options?: { value: string; label: string }[] | [];
}

export default function FormAuthItem<TFormValues extends FieldValues>({
	name,
	type,
	label,
	placeholder,
	disabled,
	isRequired,
	onValueChange,
	rules,
	classNameParentInput,
	classNameParentWrapper,
	classNameParentLabel,
	classNameParentSelect,
	options = []
}: FormItemProps<TFormValues>) {
	const {
		watch,
		formState: { errors }
	} = useFormContext<TFormValues>();
	const errorMessage = errors?.[name]?.message as string | undefined;
	const isError = Boolean(errorMessage);
	const value = watch(name);

	// console.log(value);

	useEffect(() => {
		if (onValueChange) {
			onValueChange(value ?? '');
		}
	}, [value, onValueChange]);

	// ---------- Render switch ----------

	let inputElement;
	switch (type) {
		case FormAuthItemType.TEXTAREA:
			inputElement = (
				<Textarea
					name={name}
					placeholder={placeholder}
					disabled={disabled}
					classNameTextarea={clsx(
						styles.textarea,
						classNameParentInput,
						isError && styles.error
					)}
					rules={rules}
				/>
			);
			break;

		case FormAuthItemType.SELECT:
			inputElement = (
				<SelectItem
					options={options}
					name={name}
					// placeholder={placeholder}
					disabled={disabled}
					classNameSelect={clsx(
						styles.select,
						classNameParentSelect,
						isError && styles.error
					)}
				/>
			);
			break;
		case FormAuthItemType.EMAIL:
			<Input
				name={name}
				placeholder={placeholder}
				disabled={disabled}
				rules={rules}
				type={FormAuthItemType.EMAIL}
				classNameInput={clsx(
					styles.input,
					classNameParentInput,
					isError && styles.error
				)}
			/>;
			break;

		default:
			inputElement = (
				<Input
					name={name}
					placeholder={placeholder}
					disabled={disabled}
					rules={rules}
					type={FormAuthItemType.TEXT}
					classNameInput={clsx(
						styles.input,
						classNameParentInput,
						isError && styles.error
					)}
				/>
			);
	}

	return (
		<div className={clsx(styles.inputWrapper, classNameParentWrapper)}>
			<Label
				classNameParentLabel={classNameParentLabel}
				name={name}
				isRequired={isRequired}
			>
				{label}
			</Label>
			{inputElement}
		</div>
	);
}
