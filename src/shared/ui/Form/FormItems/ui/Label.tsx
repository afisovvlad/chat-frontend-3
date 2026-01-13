import { classNames } from '@/shared/lib/classNames/classNames';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import styles from './styles.module.scss';

interface LabelProps<TFormValues extends FieldValues> {
	children: React.ReactNode;
	parentLabelClass?: string;
	name: Path<TFormValues>;
	// isRequired?: boolean;
}

export function Label<TFormValues extends FieldValues>({
	children,
	parentLabelClass,
	name
	// isRequired = false
}: LabelProps<TFormValues>) {
	const {
		formState: { errors }
	} = useFormContext<TFormValues>();

	const errorMessage = errors?.[name]?.message as string | undefined;
	const isError = Boolean(errorMessage);

	return (
		<label
			className={classNames(
				styles.label,
				{
					[styles.hasError]: isError
				},
				[parentLabelClass]
			)}
			htmlFor={name}
		>
			{errorMessage ?? children}
			{/* {isRequired && !errorMessage && (
				<span className={styles.required}>*</span>
			)} */}
		</label>
	);
}
