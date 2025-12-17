import clsx from 'clsx';
import styles from './InputInternal.module.scss';
import { FieldValues, Path, RegisterOptions } from 'react-hook-form';

interface TextareaInternalProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	rules: RegisterOptions<TFormValues, Path<TFormValues>>;
	placeholder?: string;
	autoComplete?: string;
	errorMessage?: string;
	disabled?: boolean;
}

export function TextareaInternal({
	name,
	rules,
	placeholder,
	autoComplete,
	disabled,
	errorMessage
}: TextareaInternalProps<FieldValues>) {
	return (
		<textarea
			{...register(name, rules)}
			id={name}
			placeholder={placeholder}
			autoComplete={autoComplete}
			disabled={disabled}
			className={clsx(styles.textarea, {
				[styles.hasError]: errorMessage,
				[styles.disabled]: disabled
			})}
		/>
	);
}
