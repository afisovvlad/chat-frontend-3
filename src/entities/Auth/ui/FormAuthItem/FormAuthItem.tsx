'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import { Input, Label, OTPInput, PhoneInput, Textarea } from '@/shared/ui/Form';
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
import styles from './FormAuthItem.module.scss';

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
	onValueChange?: (value: string) => void; // для реакции на ввод сразу
}

export default function FormAuthItem<TFormValues extends FieldValues>({
	name,
	type,
	label,
	placeholder,
	disabled,
	isRequired,
	length = 5,
	onValueChange,
	rules,
	classNameParentInput,
	classNameParentWrapper,
	classNameParentLabel
}: FormItemProps<TFormValues>) {
	const {
		control,
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
						{ [styles.error]: isError },
						[classNameParentInput]
					)}
					rules={rules}
				/>
			);
			break;

		case FormItemType.CODE:
			inputElement = (
				<OTPInput
					name={name}
					placeholder={placeholder}
					disabled={disabled}
					length={length}
					control={control}
					classNameInput={classNames(
						styles.input,
						{ [styles.error]: isError },
						[classNameParentInput]
					)}
				/>
			);
			break;

		case FormItemType.TEL:
			inputElement = (
				<PhoneInput
					name={name}
					placeholder={placeholder}
					disabled={disabled}
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
