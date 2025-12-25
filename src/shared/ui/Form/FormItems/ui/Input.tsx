import clsx from 'clsx';
import {
	FieldValues,
	Path,
	RegisterOptions,
	useFormContext
} from 'react-hook-form';
import { FormAuthItemAutocomplete, FormAuthItemType } from '../model/types';
import styles from './styles.module.scss';

interface InputProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>> | undefined;
	type: FormAuthItemType | string;
	placeholder?: string;
	disabled?: boolean;
	autoComplete?: FormAuthItemAutocomplete;
	classNameInput?: string;
}

export function Input<TFormValues extends FieldValues>({
	name,
	rules = {
		required: 'Заполните это поле'
	},
	type = 'text',
	placeholder,
	disabled,
	autoComplete,
	classNameInput
}: InputProps<TFormValues>) {
	const {
		register,
		formState: { errors }
	} = useFormContext<TFormValues>();
	const isError = Boolean(errors?.[name]?.message as string | undefined);

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
