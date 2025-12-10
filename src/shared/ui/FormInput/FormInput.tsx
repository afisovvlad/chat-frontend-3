// 'use client';
// import {
// 	FieldValues,
// 	Path,
// 	RegisterOptions,
// 	useFormContext
// } from 'react-hook-form';

// interface FormInputProps<T extends FieldValues> {
// 	type: string;
// 	itemName: Path<T>;
// 	rules?: RegisterOptions<T>;
// 	disabled?: boolean;
// 	placeholder?: string;
// 	label?: string;
// 	isRequired?: boolean;
// }

// export const FormInput = <TFormValues extends FieldValues>({
// 	type,
// 	itemName,
// 	rules,
// 	placeholder,
// 	label,
// 	isRequired,
// 	disabled
// }: FormInputProps<TFormValues>) => {
// 	const {
// 		register,
// 		formState: { errors }
// 	} = useFormContext<TFormValues>();
// 	const errorMessage = errors?.[itemName]?.message as string | undefined;
// 	// console.log(errors);
// 	// console.log(errorMessage);

// 	return (
// 		// <div
// 		// 	className={clsx(styles.inputWrapper, classNames, {
// 		// 		[styles.hasError]: errors.itemName,
// 		// 		[styles.disabled]: disabled
// 		// 	})}
// 		// >
// 		// 	{label && (
// 		// 		<label
// 		// 			className={clsx(styles.label, classNames, {
// 		// 				[styles.hasError]: errors.itemName
// 		// 			})}
// 		// 			htmlFor={itemName}
// 		// 		>
// 		// 			{errorMessage ? <span>{errorMessage}</span> : label ? label : ''}
// 		// 			{isRequired && <span className={styles.required}>*</span>}
// 		// 		</label>
// 		// 	)}
// 		<input
// 			type={type}
// 			// {...props}
// 			{...register(itemName, rules)}
// 			id={itemName}
// 			placeholder={placeholder}
// 		/>
// 		// </div>
// 	);
// };
