'use client';
import clsx from 'clsx';
import { FieldValues, useFormContext } from 'react-hook-form';
import styles from './FormItem.module.scss';
import { CodeInput } from '../CodeInput/CodeInput';

interface FormInputProps<T extends FieldValues> {
	key: string;
	type: string;
	itemName: string;
	placeholder: string;
	autocomplete: string;
	label: string;
	disabled: boolean;
	isRequired: boolean;
	rules: { required: string };
	classNames?: string;
}

export default function FormItem<TFormValues extends FieldValues>({
	type,
	itemName,
	label,
	placeholder,
	autocomplete,
	disabled,
	isRequired,
	rules,
	classNames
}: FormInputProps<TFormValues>) {
	let inputElement;
	const {
		register,
		formState: { errors }
	} = useFormContext<TFormValues>();
	const errorMessage = errors?.[itemName]?.message as string | undefined;

	switch (type) {
		// case 'code':
		// 	inputElement = (
		// <CodeInput key={itemName} {...register(itemName, rules)} />
		// <input
		// 	type='number'
		// 	key={itemName}
		// 	{...register(itemName, rules)}
		// 	name={itemName}
		// 	id={itemName}
		// 	placeholder={placeholder}
		// 	autoComplete={autocomplete}
		// />
		// );

		case 'textarea':
			inputElement = (
				<textarea
					key={itemName}
					{...register(itemName, rules)}
					name={itemName}
					id={itemName}
					placeholder={placeholder}
					autoComplete={autocomplete}
					className={styles.textarea}
				/>
			);

		default:
			inputElement = (
				<input
					key={itemName}
					type={type}
					{...register(itemName, rules)}
					id={itemName}
					placeholder={placeholder}
					autoComplete={autocomplete}
					className={clsx(styles.input, classNames, {
						[styles.hasError]: errors?.[itemName],
						[styles.disabled]: disabled
					})}
				/>
			);
	}

	return (
		<div className={clsx(styles.inputWrapper, classNames)}>
			{label && (
				<label
					className={clsx(styles.label, classNames, {
						[styles.hasError]: errors?.[itemName]
					})}
					htmlFor={itemName}
				>
					{errorMessage ? (
						<span className={styles.labelSpan}>{errorMessage}</span>
					) : label ? (
						label
					) : (
						''
					)}
					{isRequired && <span className={styles.required}>*</span>}
				</label>
			)}
			{inputElement}
		</div>
	);
}
