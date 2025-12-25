import styles from './styles.module.scss';
import clsx from 'clsx';
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormAuthItemAutocomplete } from '../model/types';

interface PhoneInputProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	placeholder?: string;
	classNameInput?: string;
	disabled?: boolean;
}

export function PhoneInput<TFormValues extends FieldValues>({
	name,
	placeholder,
	classNameInput,
	disabled
}: PhoneInputProps<TFormValues>) {
	const {
		formState: { errors }
	} = useFormContext<TFormValues>();
	const isError = Boolean(errors?.[name]?.message as string | undefined);
	const formatPhone = (value: string | undefined | null): string => {
		// Безопасная проверка
		if (!value && value !== '') {
			return '';
		}

		// Приводим к строке
		const strValue = String(value || '');

		// Убираем все нецифры
		const digits = strValue.replace(/\D/g, '');

		// Если нет цифр, возвращаем пустую строку
		if (!digits || digits === '') {
			return '';
		}

		// Убираем код страны если он есть - безопасно
		const cleanDigits = digits.startsWith('7')
			? digits.length > 1
				? digits.slice(1)
				: ''
			: digits;

		// Если после удаления кода страны ничего не осталось
		if (!cleanDigits) {
			return '+7';
		}

		// Форматируем с проверками
		let formatted = '+7';

		if (cleanDigits.length > 0) {
			formatted += ` ${cleanDigits.slice(0, Math.min(3, cleanDigits.length))}`;
		}
		if (cleanDigits.length > 3) {
			formatted += ` ${cleanDigits.slice(3, Math.min(6, cleanDigits.length))}`;
		}
		if (cleanDigits.length > 6) {
			formatted += ` ${cleanDigits.slice(6, Math.min(8, cleanDigits.length))}`;
		}
		if (cleanDigits.length > 8) {
			formatted += ` ${cleanDigits.slice(8, Math.min(10, cleanDigits.length))}`;
		}

		return formatted;
	};

	// Функция обработки изменения ВНЕ render
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		onChange: (value: string) => void
	) => {
		const inputValue = e.target?.value || '';
		const formatted = formatPhone(inputValue);
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
						autoComplete={FormAuthItemAutocomplete.PHONE}
						className={clsx(styles.input, classNameInput, {
							[styles.hasError]: isError,
							[styles.disabled]: disabled
						})}
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
