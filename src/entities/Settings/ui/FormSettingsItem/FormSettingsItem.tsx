'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import { Label } from '@/shared/ui/FormComponent';
import {
	FormItemAutocomplete,
	FormItemType
} from '@/shared/ui/FormComponent/FormItems/model/types';
import { useEffect } from 'react';
import {
	FieldValues,
	Path,
	RegisterOptions,
	useFormContext
} from 'react-hook-form';
import styles from './FormSettingsItem.module.scss';
import { RenderSettingsInputByType } from './RenderSettingsInputByType';

interface FormItemProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	type: FormItemType;
	label?: string;
	placeholder?: string;
	autoComplete?: FormItemAutocomplete;
	disabled?: boolean;
	// isRequired?: boolean;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	parentLabelClass?: string;
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
	// isRequired,
	onValueChange,
	rules,
	classNameParentInput,
	classNameParentWrapper,
	parentLabelClass,
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

	const inputElement = RenderSettingsInputByType({
		name,
		type,
		placeholder,
		disabled,
		isError,
		rules,
		classNameParentInput,
		classNameParentSelect,
		isMessageShort,
		textareaHeight,
		options
	});

	return (
		<div
			className={classNames(styles.inputWrapper, {}, [classNameParentWrapper])}
		>
			<Label
				parentLabelClass={classNames(styles.label, {}, [parentLabelClass])}
				name={name}
				// isRequired={isRequired}
			>
				{label}
			</Label>
			{inputElement}
		</div>
	);
}
