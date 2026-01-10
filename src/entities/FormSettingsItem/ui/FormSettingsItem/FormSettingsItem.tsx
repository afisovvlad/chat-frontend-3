'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import { Input, Label, SelectItem, Textarea } from '@/shared/ui/Form';
import {
	FormItemAutocomplete,
	FormItemType
} from '@/shared/ui/Form/FormItems/model/types';
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
	type: FormItemType;
	label?: string;
	placeholder?: string;
	autoComplete?: FormItemAutocomplete;
	disabled?: boolean;
	isRequired?: boolean;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	length?: number; // для code
	classNameParentLabel?: string;
	classNameParentInput?: string;
	classNameParentWrapper?: string;
	classNameParentSelect?: string;
	isMessageShort?: boolean;
	textareaHeight?: string | undefined;
	onValueChange?: (value: string) => void; // для реакции на ввод сразу
	options?: { value: string; label: string }[] | [];
}

export function FormSettingsItem<TFormValues extends FieldValues>({
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
	isMessageShort,
	textareaHeight,
	options = []
}: FormItemProps<TFormValues>) {
	const {
		watch,
		formState: { errors }
	} = useFormContext<TFormValues>();
	const errorMessage = errors?.[name]?.message as string | undefined;
	const isError = Boolean(errorMessage);
	const value = watch(name);

	useEffect(() => {
		if (onValueChange) {
			onValueChange(value ?? '');
		}
	}, [value, onValueChange]);

	// ---------- Render switch ----------

	let inputElement;
	switch (type) {
		case FormItemType.TEXTAREA:
			inputElement = (
				<Textarea
					name={name}
					placeholder={placeholder}
					disabled={disabled}
					classNameTextarea={classNames(
						styles.textarea,
						{
							[styles.error]: isError,
							[styles.messageShort]: isMessageShort
						},
						[classNameParentInput]
					)}
					rules={rules}
					height={textareaHeight}
				/>
			);
			break;

		case FormItemType.SELECT:
			inputElement = (
				<SelectItem
					options={options}
					name={name}
					disabled={disabled}
					classNameSelect={classNames(
						styles.select,
						{ [styles.error]: isError },
						[classNameParentSelect]
					)}
				/>
			);
			break;
		case FormItemType.EMAIL:
			inputElement = (
				<Input
					name={name}
					placeholder={placeholder}
					disabled={disabled}
					rules={rules}
					type={FormItemType.EMAIL}
					classNameInput={classNames(
						styles.input,
						{ [styles.error]: isError },
						[classNameParentInput]
					)}
				/>
			);
			break;

		default:
			inputElement = (
				<Input
					name={name}
					placeholder={placeholder}
					disabled={disabled}
					rules={rules}
					type={FormItemType.TEXT}
					classNameInput={classNames(
						styles.input,
						{ [styles.error]: isError },
						[classNameParentInput]
					)}
				/>
			);
	}

	return (
		<div
			className={classNames(styles.inputWrapper, {}, [classNameParentWrapper])}
		>
			<Label
				classNameParentLabel={classNames(styles.label, {}, [
					classNameParentLabel
				])}
				name={name}
				isRequired={isRequired}
			>
				{label}
			</Label>
			{inputElement}
		</div>
	);
}
