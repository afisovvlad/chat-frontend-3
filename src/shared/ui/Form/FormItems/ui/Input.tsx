import clsx from 'clsx';
import {
	FieldValues,
	Path,
	RegisterOptions,
	UseFormRegister
} from 'react-hook-form';
import { FormAuthItemAutocomplete, FormAuthItemType } from '../model/types';
import styles from './styles.module.scss';

interface InputProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>> | undefined;
	type: FormAuthItemType;
	placeholder?: string;
	disabled?: boolean;
	isError?: boolean;
	autoComplete?: FormAuthItemAutocomplete;
	register: UseFormRegister<TFormValues>;
	classNameInput?: string;
}

export function Input<TFormValues extends FieldValues>({
	name,
	register,
	rules = {
		required: 'Заполните это поле'
	},
	type,
	placeholder,
	disabled,
	isError,
	autoComplete,
	classNameInput
}: InputProps<TFormValues>) {
	return (
		<input
			{...register(name, rules)}
			type={type}
			placeholder={placeholder}
			disabled={disabled}
			autoComplete={autoComplete || FormAuthItemAutocomplete.ON}
			className={clsx(classNameInput, styles.input, {
				[styles.hasError]: isError,
				[styles.disabled]: disabled
			})}
		/>
	);
}
