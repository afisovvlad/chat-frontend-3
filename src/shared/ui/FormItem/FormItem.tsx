'use client';
import clsx from 'clsx';
import { Controller, FieldValues, useFormContext } from 'react-hook-form';
import { CodeInput } from '../CodeInput/CodeInput';
import styles from './FormItem.module.scss';

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
	classNamesWrapper?: string;
	classNamesLabel?: string;
	classNamesTextarea?: string;
	classNamesInput?: string;
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
	classNamesWrapper,
	classNamesLabel,
	classNamesTextarea,
	classNamesInput
}: FormInputProps<TFormValues>) {
	let inputElement;
	const {
		register,
		formState: { errors }
	} = useFormContext<TFormValues>();
	const errorMessage = errors?.[itemName]?.message as string | undefined;

	switch (type) {
		case 'code':
			inputElement = (
				<CodeInput value={''} key={itemName} {...register(itemName, rules)} />
			);
			break;

		case 'textarea':
			inputElement = (
				<textarea
					key={itemName}
					{...register(itemName, rules)}
					name={itemName}
					id={itemName}
					placeholder={placeholder}
					autoComplete={autocomplete}
					className={clsx(styles.input, classNamesTextarea, {
						[styles.hasError]: errors?.[itemName],
						[styles.disabled]: disabled
					})}
				/>
			);
			break;

		case 'tel':
			inputElement = (
				<Controller
					name={itemName}
					rules={rules}
					render={({ field }) => (
						<input
							{...field}
							type='tel'
							id={itemName}
							placeholder={placeholder}
							autoComplete={autocomplete}
							className={clsx(styles.input, classNamesInput, {
								[styles.hasError]: errors?.[itemName],
								[styles.disabled]: disabled
							})}
							onFocus={() => {
								if (!field.value) {
									field.onChange('+7 ');
								}
							}}
							onChange={e => {
								const raw = e.target.value.replace(/\D/g, ''); // только цифры
								let formatted = '+7 ';

								// удаляем код страны (+7) из raw
								const digits = raw.startsWith('7') ? raw.slice(1) : raw;

								if (digits.length > 10) {
									return;
								} // ограничение на 10 цифр

								if (digits.length > 0) {
									formatted += digits.substring(0, 3);
								}
								if (digits.length > 3) {
									formatted += ' ' + digits.substring(3, 6);
								}
								if (digits.length > 6) {
									formatted += ' ' + digits.substring(6, 8);
								}
								if (digits.length > 8) {
									formatted += ' ' + digits.substring(8, 10);
								}

								field.onChange(formatted);
							}}
						/>
					)}
				/>
			);
			break;

		default:
			inputElement = (
				<input
					key={itemName}
					type={type}
					{...register(itemName, rules)}
					id={itemName}
					placeholder={placeholder}
					autoComplete={autocomplete}
					className={clsx(styles.input, classNamesInput, {
						[styles.hasError]: errors?.[itemName],
						[styles.disabled]: disabled
					})}
				/>
			);
	}

	return (
		<div className={clsx(styles.inputWrapper, classNamesWrapper)}>
			{label && (
				<label
					className={clsx(styles.label, classNamesLabel, {
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
