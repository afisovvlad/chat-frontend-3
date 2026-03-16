'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import { useEffect, useRef, useState } from 'react';
import {
	Control,
	Controller,
	FieldValues,
	Path,
	useController
} from 'react-hook-form';
import { FormItemAutocomplete, FormItemType } from '../model/types';
import styles from './styles.module.scss';

interface OTPInputProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	disabled?: boolean;
	placeholder?: string;
	parentInputClass?: string;
	control: Control<TFormValues>;
}

export function OTPInput<TFormValues extends FieldValues>({
	name,
	placeholder = '',
	parentInputClass,
	disabled,
	control
}: OTPInputProps<TFormValues>) {
	const inputRef = useRef<(HTMLInputElement | null)[]>([]);
	const [OTP, setOTP] = useState<string[]>(Array(length).fill(''));
	const { fieldState } = useController({ name });
	const isError = !!fieldState.error;

	// автофокус на первом input
	useEffect(() => {
		inputRef.current[0]?.focus();
	}, []);

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
		if (digit && index < 4) {
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
					value: 5,
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
						{Array.from([1, 1, 1, 1, 1]).map((_, index) => (
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
									[parentInputClass]
								)}
							/>
						))}
					</div>
				);
			}}
		/>
	);
}
