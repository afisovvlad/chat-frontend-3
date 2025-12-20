'use client';

import { Input, OTPInput, PhoneInput, Textarea } from '@/shared/ui/Form';
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
import styles from './FormAuthItem.module.scss';

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
		register,
		control,
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
					isError={isError}
					// onValueChange={onValueChange}
					classNameTextarea={clsx(
						styles.textarea,
						classNameParentInput,
						isError && styles.error
					)}
					rules={rules}
					register={register}
				/>
			);
			break;

		case FormAuthItemType.CODE:
			inputElement = (
				<OTPInput
					name={name}
					placeholder={placeholder}
					disabled={disabled}
					length={length}
					isError={isError}
					control={control}
					classNameInput={clsx(
						styles.input,
						classNameParentInput,
						isError && styles.error
					)}
				/>
			);
			break;

		case FormAuthItemType.TEL:
			inputElement = (
				<PhoneInput
					name={name}
					placeholder={placeholder}
					disabled={disabled}
					isError={isError}
					classNameInput={clsx(
						styles.input,
						classNameParentInput,
						isError && styles.error
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
					type={FormAuthItemType.TEXT}
					register={register}
					isError={isError}
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
			<label
				className={clsx(styles.label, classNameParentLabel, {
					[styles.hasError]: !!errorMessage
				})}
				htmlFor={name}
			>
				{errorMessage ?? label}
				{isRequired && <span className={styles.required}>*</span>}
			</label>
			{inputElement}
		</div>
	);
}
