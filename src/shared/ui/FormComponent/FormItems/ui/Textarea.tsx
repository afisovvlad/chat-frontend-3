'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import {
	FieldValues,
	Path,
	RegisterOptions,
	useController,
	useFormContext
} from 'react-hook-form';
import { FormItemAutocomplete } from '../model/types';
import styles from './styles.module.scss';

interface TextareaProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	placeholder?: string;
	autoComplete?: FormItemAutocomplete;
	disabled?: boolean;
	classNameTextarea?: string;
	height?: string | undefined;
}

export function Textarea<TFormValues extends FieldValues>({
	name,
	rules = {
		required: 'Заполните это поле'
	},
	placeholder = '',
	disabled,
	classNameTextarea,
	height
}: TextareaProps<TFormValues>) {
	const { register, control } = useFormContext<TFormValues>();
	// const { errors } = useFormState({
	// 	control,
	// 	name
	// });
	// const isError = Boolean(errors?.[name]?.message as string | undefined);
	const { fieldState } = useController({ name });
	const isError = !!fieldState.error;

	console.log('isError in Textarea', isError);

	console.log('Я - Textarea');

	return (
		<textarea
			{...register(name, rules)}
			id={name}
			placeholder={placeholder}
			autoComplete={FormItemAutocomplete.OFF}
			disabled={disabled}
			className={classNames(
				styles.textarea,
				{
					[styles.hasError]: isError,
					[styles.disabled]: disabled
				},
				[classNameTextarea]
			)}
			style={height ? { minHeight: height, maxHeight: height } : {}}
		/>
	);
}
