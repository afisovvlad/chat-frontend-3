'use client';
import clsx from 'clsx';
import { useEffect } from 'react';
import {
	FieldValues,
	Path,
	RegisterOptions,
	useFormContext
} from 'react-hook-form';
import CodeInput from '../Form/FormItems/CodeInput';
import PhoneInput from '../Form/FormItems/PhoneInput';
import Textarea from '../Form/FormItems/Textarea';
import styles from './FormAuthItem.module.scss';
import { FormAuthItemType } from './model/types';

interface FormItemProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	type: FormAuthItemType;
	label?: string;
	placeholder?: string;
	autoComplete?: string;
	disabled?: boolean;
	isRequired?: boolean;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	length?: number; // для code
	classNamesLabel?: string;
	classNamesInput?: string;
	classNamesWrapper?: string;
	onValueChange?: (value: string) => void; // для реакции на ввод сразу
}

export default function FormAuthItem<TFormValues extends FieldValues>({
	name,
	type,
	label,
	placeholder,
	autoComplete = 'off',
	disabled,
	isRequired,
	// rules,
	length = 5,
	// classNamesLabel,
	// classNamesInput,
	// classNamesWrapper,
	onValueChange
}: FormItemProps<TFormValues>) {
	const {
		register,
		control,
		watch,
		formState: { errors }
	} = useFormContext<TFormValues>();
	const errorMessage = errors?.[name]?.message as string | undefined;
	const classNamesInput = styles.input;

	const value = watch(name);

	useEffect(() => {
		if (onValueChange) {
			onValueChange(value ?? '');
		}
	}, [value, onValueChange]);

	// ---------- Render switch ----------

	let inputElement;
	switch (type) {
		case 'textarea':
			inputElement = (
				<Textarea
					name={name}
					placeholder={placeholder}
					autoComplete={autoComplete}
					disabled={disabled}
					// rules={rules}
					errorMessage={errorMessage}
					onValueChange={onValueChange}
					classNamesTextarea={classNamesInput}
				/>
			);

			break;
		case 'code':
			inputElement = (
				<CodeInput
					name={name}
					placeholder={placeholder}
					// autoComplete={autoComplete}
					disabled={disabled}
					// rules={rules}
					length={length}
					isError={Boolean(errorMessage)}
					control={control}
					classNamesCode={classNamesInput}
				/>
			);
			break;
		case 'tel':
			inputElement = (
				<PhoneInput
					name={name}
					placeholder={placeholder}
					disabled={disabled}
					classNamesPhone={classNamesInput}
					isError={Boolean(errorMessage)}
				/>
			);
			break;
		// default:
		// 	inputElement = <input {...register(name, rules)} />;
	}

	// // console.log(errors);

	// const handleClick = () => {
	// 	if (!disabled) {
	// 		inputRefs.current[index]?.focus();
	// 	}
	// };

	// useEffect(() => {
	// 	const input = inputRefs.current[index];
	// 	if (!disabled && input && input.value === '') {
	// 		input.focus();
	// 	}
	// }, [index, disabled]);

	// switch (type) {
	// 	case 'code':
	// 		inputElement = (
	// 			<Controller
	// 				name={itemName}
	// 				control={control}
	// 				rules={rules}
	// 				render={({ field }) => {
	// 					console.log(length);
	// 					console.log(field.value);
	// 					const cells = Array.from(
	// 						{ length: length ?? 5 },
	// 						(_, index) => (field.value ?? '')[index] || ''
	// 					);

	// 					return (
	// 						<>
	// 							<div
	// 								className={clsx(styles.container, {
	// 									[styles.error]: errors?.[itemName]?.message,
	// 									[styles.disabled]: disabled
	// 								})}
	// 								onClick={handleClick}
	// 								role='button'
	// 								tabIndex={-1}
	// 							>
	// 								<>
	// 									<div className={styles.cells}>
	// 										{cells.map((char, index) => (
	// 											<span
	// 												key={index}
	// 												className={clsx(styles.cell, {
	// 													[styles.active]:
	// 														!disabled && index === (field.value?.length ?? 0),
	// 													[styles.filled]: !!char
	// 												})}
	// 											>
	// 												{char}
	// 											</span>
	// 										))}
	// 									</div>

	// 									<input
	// 										name={itemName}
	// 										id={itemName}
	// 										// ref={el => setRef(index, el)}
	// 										className={styles.hiddenInput}
	// 										value={field.value ?? ''} // never undefined
	// 										onChange={e => {
	// 											const formatted = e.target.value
	// 												.replace(/\D/g, '')
	// 												.slice(0, length); // обрезаем длину строки, если вводят больше символов, чем length

	// 											field.onChange(formatted);
	// 										}}
	// 										type='text'
	// 										autoComplete='one-time-code'
	// 										disabled={disabled}
	// 									/>
	// 								</>
	// 							</div>
	// 						</>
	// 					);
	// 				}}
	// 			/>
	// 		);
	// 		break;

	// 	case 'textarea':
	// 		inputElement = (
	// 			<Controller
	// 				name={itemName}
	// 				rules={rules}
	// 				render={({ field }) => (
	// 					<textarea
	// 						// ref={el => setRef(index, el)}
	// 						// ref={el => void (inputRefs.current[index] = el)}
	// 						key={itemName}
	// 						onChange={e => field.onChange(e.target.value)}
	// 						value={field.value ?? ''}
	// 						name={itemName}
	// 						id={itemName}
	// 						placeholder={placeholder}
	// 						autoComplete={autocomplete}
	// 						className={clsx(styles.input, classNamesTextarea, {
	// 							[styles.hasError]: errors?.[itemName],
	// 							[styles.disabled]: disabled
	// 						})}
	// 					/>
	// 				)}
	// 			/>
	// 		);
	// 		break;

	// 	case 'tel':
	// 		inputElement = (
	// 			<Controller
	// 				name={itemName}
	// 				rules={rules}
	// 				render={({ field }) => (
	// 					<input
	// 						{...field}
	// 						// ref={el => setRef(index, el)}
	// 						// ref={el => void (inputRefs.current[index] = el)}
	// 						type='tel'
	// 						id={itemName}
	// 						placeholder={placeholder}
	// 						autoComplete={autocomplete}
	// 						className={clsx(styles.input, classNamesInput, {
	// 							[styles.hasError]: errors?.[itemName],
	// 							[styles.disabled]: disabled
	// 						})}
	// 						onFocus={() => {
	// 							if (!field.value) {
	// 								field.onChange('+7 ');
	// 							}
	// 						}}
	// 						// onBlur={() => field.onChange('')}
	// 						onChange={e => {
	// 							const raw = e.target.value.replace(/\D/g, ''); // только цифры
	// 							let formatted = '+7 ';

	// 							// удаляем код страны (+7) из raw
	// 							const digits = raw.startsWith('7') ? raw.slice(1) : raw;

	// 							if (digits.length > 10) {
	// 								return;
	// 							} // ограничение на 10 цифр

	// 							if (digits.length > 0) {
	// 								formatted += digits.substring(0, 3);
	// 							}
	// 							if (digits.length > 3) {
	// 								formatted += ' ' + digits.substring(3, 6);
	// 							}
	// 							if (digits.length > 6) {
	// 								formatted += ' ' + digits.substring(6, 8);
	// 							}
	// 							if (digits.length > 8) {
	// 								formatted += ' ' + digits.substring(8, 10);
	// 							}

	// 							field.onChange(formatted);
	// 						}}
	// 					/>
	// 				)}
	// 			/>
	// 		);
	// 		break;

	// 	default:
	// 		inputElement = (
	// 			<Controller
	// 				name={itemName}
	// 				rules={rules}
	// 				render={({ field }) => (
	// 					<input
	// 						key={itemName}
	// 						type={type}
	// 						// ref={el => setRef(index, el)}
	// 						// ref={el => void (inputRefs.current[index] = el)}
	// 						onChange={e => field.onChange(e.target.value)}
	// 						value={field.value ?? ''}
	// 						name={itemName}
	// 						id={itemName}
	// 						placeholder={placeholder}
	// 						autoComplete={autocomplete}
	// 						className={clsx(styles.input, classNamesInput, {
	// 							[styles.hasError]: errors?.[itemName],
	// 							[styles.disabled]: disabled
	// 						})}
	// 					/>
	// 				)}
	// 			/>
	// 		);
	// }

	return (
		<div
			className={clsx(
				styles.inputWrapper
				// classNamesWrapper
			)}
		>
			<label
				className={clsx(
					styles.label,
					// classNamesLabel,
					{
						[styles.hasError]: !!errorMessage
					}
				)}
				htmlFor={name}
			>
				{errorMessage ?? label}
				{/* {errorMessage ? (
					<span className={styles.labelSpan}>{errorMessage}</span>
				) : label ? (
					label
				) : (
					''
				)} */}
				{isRequired && <span className={styles.required}>*</span>}
			</label>
			{inputElement}
		</div>
	);
}

// 'use client';
// import clsx from 'clsx';
// import { useEffect, useRef } from 'react';
// import {
// 	Controller,
// 	FieldValues,
// 	Path,
// 	RegisterOptions,
// 	useFormContext
// } from 'react-hook-form';
// import styles from './FormItem.module.scss';

// interface FormInputProps<T extends FieldValues> {
// 	index: number;
// 	type: string;
// 	itemName: Path<T>;
// 	placeholder: string;
// 	autocomplete: string;
// 	label: string;
// 	disabled: boolean;
// 	length?: number;
// 	isRequired: boolean;
// 	rules?: RegisterOptions<T, Path<T>>;
// 	classNamesWrapper?: string;
// 	classNamesLabel?: string;
// 	classNamesTextarea?: string;
// 	classNamesInput?: string;
// 	setRef: (
// 		index: number,
// 		el: HTMLInputElement | HTMLTextAreaElement | null
// 	) => void;
// }

// export default function FormItem<TFormValues extends FieldValues>({
// 	index,
// 	type,
// 	itemName,
// 	label,
// 	placeholder,
// 	autocomplete,
// 	disabled,
// 	isRequired,
// 	rules,
// 	classNamesWrapper,
// 	classNamesLabel,
// 	classNamesTextarea,
// 	classNamesInput,
// 	length = 5,
// 	setRef
// }: FormInputProps<TFormValues>) {
// 	const inputRefs = useRef<
// 		Array<HTMLInputElement | HTMLTextAreaElement | null>
// 	>([]);
// 	let inputElement;
// 	const {
// 		control,
// 		formState: { errors }
// 	} = useFormContext<TFormValues>();
// 	const errorMessage = errors?.[itemName]?.message as string | undefined;

// 	console.log(errors);

// 	const handleClick = () => {
// 		if (!disabled) {
// 			inputRefs.current[index]?.focus();
// 		}
// 	};

// 	useEffect(() => {
// 		const input = inputRefs.current[index];
// 		if (!disabled && input && input.value === '') {
// 			input.focus();
// 		}
// 	}, [index, disabled]);

// 	switch (type) {
// 		case 'code':
// 			inputElement = (
// 				<Controller
// 					name={itemName}
// 					control={control}
// 					rules={rules}
// 					render={({ field }) => {
// 						console.log(length);
// 						console.log(field.value);
// 						const cells = Array.from(
// 							{ length: length ?? 5 },
// 							(_, index) => (field.value ?? '')[index] || ''
// 						);

// 						return (
// 							<>
// 								<div
// 									className={clsx(styles.container, {
// 										[styles.error]: errors?.[itemName]?.message,
// 										[styles.disabled]: disabled
// 									})}
// 									onClick={handleClick}
// 									role='button'
// 									tabIndex={-1}
// 								>
// 									<>
// 										<div className={styles.cells}>
// 											{cells.map((char, index) => (
// 												<span
// 													key={index}
// 													className={clsx(styles.cell, {
// 														[styles.active]:
// 															!disabled && index === (field.value?.length ?? 0),
// 														[styles.filled]: !!char
// 													})}
// 												>
// 													{char}
// 												</span>
// 											))}
// 										</div>

// 										<input
// 											name={itemName}
// 											id={itemName}
// 											ref={el => setRef(index, el)}
// 											className={styles.hiddenInput}
// 											value={field.value ?? ''} // never undefined
// 											onChange={e => {
// 												const formatted = e.target.value
// 													.replace(/\D/g, '')
// 													.slice(0, length);
// 												if (formatted.length >= length) {
// 													formatted.substring(0, length);
// 													field.onChange(formatted);
// 												}
// 												field.onChange(formatted);
// 											}}
// 											type='text'
// 											autoComplete='one-time-code'
// 											disabled={disabled}
// 										/>
// 									</>
// 								</div>
// 							</>
// 						);
// 					}}
// 				/>
// 			);
// 			break;

// 		case 'textarea':
// 			inputElement = (
// 				<Controller
// 					name={itemName}
// 					rules={rules}
// 					render={({ field }) => (
// 						<textarea
// 							ref={el => setRef(index, el)}
// 							// ref={el => void (inputRefs.current[index] = el)}
// 							key={itemName}
// 							onChange={e => field.onChange(e.target.value)}
// 							value={field.value ?? ''}
// 							name={itemName}
// 							id={itemName}
// 							placeholder={placeholder}
// 							autoComplete={autocomplete}
// 							className={clsx(styles.input, classNamesTextarea, {
// 								[styles.hasError]: errors?.[itemName],
// 								[styles.disabled]: disabled
// 							})}
// 						/>
// 					)}
// 				/>
// 			);
// 			break;

// 		case 'tel':
// 			inputElement = (
// 				<Controller
// 					name={itemName}
// 					rules={rules}
// 					render={({ field }) => (
// 						<input
// 							{...field}
// 							ref={el => setRef(index, el)}
// 							// ref={el => void (inputRefs.current[index] = el)}
// 							type='tel'
// 							id={itemName}
// 							placeholder={placeholder}
// 							autoComplete={autocomplete}
// 							className={clsx(styles.input, classNamesInput, {
// 								[styles.hasError]: errors?.[itemName],
// 								[styles.disabled]: disabled
// 							})}
// 							onFocus={() => {
// 								if (!field.value) {
// 									field.onChange('+7 ');
// 								}
// 							}}
// 							// onBlur={() => field.onChange('')}
// 							onChange={e => {
// 								const raw = e.target.value.replace(/\D/g, ''); // только цифры
// 								let formatted = '+7 ';

// 								// удаляем код страны (+7) из raw
// 								const digits = raw.startsWith('7') ? raw.slice(1) : raw;

// 								if (digits.length > 10) {
// 									return;
// 								} // ограничение на 10 цифр

// 								if (digits.length > 0) {
// 									formatted += digits.substring(0, 3);
// 								}
// 								if (digits.length > 3) {
// 									formatted += ' ' + digits.substring(3, 6);
// 								}
// 								if (digits.length > 6) {
// 									formatted += ' ' + digits.substring(6, 8);
// 								}
// 								if (digits.length > 8) {
// 									formatted += ' ' + digits.substring(8, 10);
// 								}

// 								field.onChange(formatted);
// 							}}
// 						/>
// 					)}
// 				/>
// 			);
// 			break;

// 		default:
// 			inputElement = (
// 				<Controller
// 					name={itemName}
// 					rules={rules}
// 					render={({ field }) => (
// 						<input
// 							key={itemName}
// 							type={type}
// 							ref={el => setRef(index, el)}
// 							// ref={el => void (inputRefs.current[index] = el)}
// 							onChange={e => field.onChange(e.target.value)}
// 							value={field.value ?? ''}
// 							name={itemName}
// 							id={itemName}
// 							placeholder={placeholder}
// 							autoComplete={autocomplete}
// 							className={clsx(styles.input, classNamesInput, {
// 								[styles.hasError]: errors?.[itemName],
// 								[styles.disabled]: disabled
// 							})}
// 						/>
// 					)}
// 				/>
// 			);
// 	}

// 	return (
// 		<div className={clsx(styles.inputWrapper, classNamesWrapper)}>
// 			<label
// 				className={clsx(styles.label, classNamesLabel, {
// 					[styles.hasError]: errors?.[itemName]
// 				})}
// 				htmlFor={itemName}
// 			>
// 				{errorMessage ? (
// 					<span className={styles.labelSpan}>{errorMessage}</span>
// 				) : label ? (
// 					label
// 				) : (
// 					''
// 				)}
// 				{isRequired && <span className={styles.required}>*</span>}
// 			</label>
// 			{inputElement}
// 		</div>
// 	);
// }
