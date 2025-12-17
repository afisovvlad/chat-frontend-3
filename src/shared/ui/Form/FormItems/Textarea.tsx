import clsx from 'clsx';
import styles from './styles.module.scss';
import { FieldValues, Path, RegisterOptions } from 'react-hook-form';

interface TextareaInternalProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	rules: RegisterOptions<TFormValues, Path<TFormValues>>;
	placeholder?: string;
	autoComplete?: string;
	errorMessage?: string;
	disabled?: boolean;
}

export default function Textarea({
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
