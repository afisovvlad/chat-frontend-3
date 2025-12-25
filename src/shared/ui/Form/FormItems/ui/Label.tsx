import clsx from 'clsx';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import styles from './styles.module.scss';

interface LabelProps<TFormValues extends FieldValues> {
	children: React.ReactNode;
	classNameParentLabel?: string;
	name: Path<TFormValues>;
	isRequired?: boolean;
}

export function Label<TFormValues extends FieldValues>({
	children,
	classNameParentLabel,
	name,
	isRequired = false
}: LabelProps<TFormValues>) {
	const {
		formState: { errors }
	} = useFormContext<TFormValues>();

	const errorMessage = errors?.[name]?.message as string | undefined;
	const isError = Boolean(errorMessage);

	return (
		<label
			className={clsx(styles.label, classNameParentLabel, {
				[styles.hasError]: isError
			})}
			htmlFor={name}
		>
			{errorMessage ?? children}
			{isRequired && !errorMessage && (
				<span className={styles.required}>*</span>
			)}
		</label>
	);
}
