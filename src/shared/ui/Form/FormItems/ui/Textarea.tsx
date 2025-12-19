import clsx from 'clsx';
import {
	FieldValues,
	Path,
	RegisterOptions,
	UseFormRegister
} from 'react-hook-form';
import { FormAuthItemAutocomplete } from '../model/types';
import styles from './styles.module.scss';

interface TextareaProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	placeholder?: string;
	autoComplete?: FormAuthItemAutocomplete;
	isError?: boolean;
	disabled?: boolean;
	register: UseFormRegister<TFormValues>;
	classNameTextarea?: string;
}

export function Textarea<TFormValues extends FieldValues>({
	name,
	rules = {
		required: 'Заполните это поле'
	},
	placeholder,
	disabled,
	isError,
	register,
	classNameTextarea
}: TextareaProps<TFormValues>) {
	return (
		<textarea
			{...register(name, rules)}
			id={name}
			placeholder={placeholder}
			autoComplete={FormAuthItemAutocomplete.OFF}
			disabled={disabled}
			className={clsx(styles.textarea, classNameTextarea, {
				[styles.hasError]: isError,
				[styles.disabled]: disabled
			})}
		/>
	);
}
