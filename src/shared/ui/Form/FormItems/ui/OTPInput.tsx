'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import { useEffect, useRef, useState } from 'react';
import {
	Control,
	Controller,
	FieldValues,
	Path,
	useFormContext
} from 'react-hook-form';
import { FormItemAutocomplete, FormItemType } from '../model/types';
import styles from './styles.module.scss';

interface OTPInputProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	length: number;
	disabled?: boolean;
	placeholder?: string;
	classNameInput?: string;
	control: Control<TFormValues>;
}

export function OTPInput<TFormValues extends FieldValues>({
	name,
	length = 5,
	placeholder = '',
	classNameInput,
	disabled,
	control
}: OTPInputProps<TFormValues>) {
	const inputRef = useRef<(HTMLInputElement | null)[]>([]);
	const [OTP, setOTP] = useState<string[]>(Array(length).fill(''));
	const {
		formState: { errors }
	} = useFormContext<TFormValues>();
	const isError = Boolean(errors?.[name]?.message as string | undefined);

	// автофокус на первом input
	useEffect(() => {
		inputRef.current[0]?.focus();
	}, []);

	// Синхронизируем OTP с начальным значением из формы
	useEffect(() => {
		const initialValue = (control._formValues[name] as string) || '';
		if (initialValue.length <= length) {
			const initialOTP = Array.from(
				{ length },
				(_, i) => initialValue[i] || ''
			);

			setTimeout(() => {
				setOTP(initialOTP);
			}, 0);
		}
	}, [name, control._formValues, length]);

	// Обработчик изменения значения
	const handleTextChange = (
		inputValue: string,
		index: number,
		onChange: (value: string) => void
	) => {
		// Оставляем только одну цифру
		const digit = inputValue.replace(/\D/g, '').slice(0, 1);

		// Обновляем локальное состояние
		const newPin = [...OTP];
		newPin[index] = digit;
		setOTP(newPin);

		// Объединяем все значения в одну строку
		const combinedValue = newPin.join('');

		// Передаем объединенное значение в react-hook-form
		onChange(combinedValue);

		// Автоматический фокус
		if (digit && index < length - 1) {
			setTimeout(() => {
				inputRef.current[index + 1]?.focus();
			}, 0);
		}
	};

	// Обработка клавиши Backspace
	const handleKeyDown = (
		index: number,
		e: React.KeyboardEvent<HTMLInputElement>,
		onChange: (value: string) => void
	) => {
		if (e.key === 'Backspace' && !OTP[index] && index > 0) {
			e.preventDefault();

			// Удаляем предыдущее значение
			const newPin = [...OTP];
			newPin[index - 1] = '';
			setOTP(newPin);

			// Обновляем форму
			const combinedValue = newPin.join('');
			onChange(combinedValue);

			// Перемещаем фокус
			setTimeout(() => {
				inputRef.current[index - 1]?.focus();
			}, 0);
		}
	};

	return (
		<Controller
			name={name}
			control={control}
			rules={{
				required: 'Заполните это поле',
				minLength: {
					value: length,
					message: `Пожалуйста, введите все  цифры`
				}
			}}
			render={({ field, fieldState }) => {
				return (
					<div
						className={classNames(
							styles.cells,
							{
								[styles.hasError]: isError || !!fieldState?.error,
								[styles.disabled]: disabled
							},
							[]
						)}
					>
						{Array.from({ length }).map((_, index) => (
							<input
								key={index}
								type={FormItemType.TEXT}
								inputMode='numeric'
								id={index === 0 ? name : ''}
								name={name}
								maxLength={1}
								placeholder={placeholder}
								autoComplete={FormItemAutocomplete.CODE}
								value={OTP[index] || ''}
								onChange={e =>
									handleTextChange(e.target.value, index, field.onChange)
								}
								onKeyDown={e => handleKeyDown(index, e, field.onChange)}
								ref={ref => {
									inputRef.current[index] = ref;
								}}
								disabled={disabled}
								className={classNames(
									`${styles.cell} ${styles.input}`,
									{
										[styles.hasError]: isError || !!fieldState?.error,
										[styles.disabled]: disabled
									},
									[classNameInput]
								)}
							/>
						))}
					</div>
				);
			}}
		/>
	);
}
