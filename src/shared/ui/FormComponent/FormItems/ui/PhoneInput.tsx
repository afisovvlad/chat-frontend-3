'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import {
	Controller,
	FieldValues,
	Path,
	useController
	// useFormContext
} from 'react-hook-form';
import { formatPhoneForPhoneInput } from '../lib/formatPhoneForPhoneInput';
import { FormItemAutocomplete } from '../model/types';
import styles from './styles.module.scss';

interface PhoneInputProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	placeholder?: string;
	parentInputClass?: string;
	disabled?: boolean;
}

export function PhoneInput<TFormValues extends FieldValues>({
	name,
	placeholder = '',
	parentInputClass,
	disabled
}: PhoneInputProps<TFormValues>) {
	// const {
	// 	formState: { errors }
	// } = useFormContext<TFormValues>();
	// const isError = Boolean(errors?.[name]?.message as string | undefined);
	const { fieldState } = useController({ name });
	const isError = !!fieldState.error;

	// Функция обработки изменения ВНЕ render
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		onChange: (value: string) => void
	) => {
		const inputValue = e.target?.value || '';
		const formatted = formatPhoneForPhoneInput(inputValue);
		onChange(formatted);
	};

	const rules = {
		required: 'Заполните это поле'
	};

	return (
		<Controller
			name={name}
			rules={rules}
			render={({ field }) => {
				// Безопасное значение
				const inputValue = field.value || '';

				return (
					<input
						{...field}
						type='tel'
						id={name}
						value={inputValue}
						placeholder={placeholder}
						autoComplete={FormItemAutocomplete.PHONE}
						className={classNames(
							styles.input,
							{
								[styles.hasError]: isError,
								[styles.disabled]: disabled
							},
							[parentInputClass]
						)}
						disabled={disabled}
						onFocus={() => {
							if (!field.value || field.value === '') {
								field.onChange('+7 ');
							}
						}}
						onChange={e => handleChange(e, field.onChange)}
						onBlur={field.onBlur}
					/>
				);
			}}
		/>
	);
}
