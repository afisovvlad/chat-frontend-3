import { classNames } from '@/shared/lib/classNames/classNames';
import {
	FieldValues,
	Path,
	RegisterOptions,
	useController,
	useFormContext
} from 'react-hook-form';
import { FormItemAutocomplete, FormItemType } from '../model/types';
import styles from './styles.module.scss';

interface InputProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>> | undefined;
	type: FormItemType | string;
	placeholder?: string;
	disabled?: boolean;
	autoComplete?: FormItemAutocomplete;
	parentInputClass?: string;
}

export function Input<TFormValues extends FieldValues>({
	name,
	rules = {
		required: 'Заполните это поле'
	},
	type = 'text',
	placeholder = '',
	disabled,
	autoComplete,
	parentInputClass
}: InputProps<TFormValues>) {
	const {
		register
		// formState: { errors }
	} = useFormContext<TFormValues>();
	// const isError = Boolean(errors?.[name]?.message as string | undefined);
	const { fieldState } = useController({ name });
	const isError = !!fieldState.error;

	// console.log('isError in Input', isError);

	// console.log('Я - Input');
	return (
		<input
			{...register(name, rules)}
			type={type}
			id={name}
			name={name}
			placeholder={placeholder}
			disabled={disabled}
			autoComplete={autoComplete || FormItemAutocomplete.ON}
			className={classNames(
				styles.input,
				{
					[styles.hasError]: isError,
					[styles.disabled]: disabled
				},
				[parentInputClass]
			)}
		/>
	);
}
