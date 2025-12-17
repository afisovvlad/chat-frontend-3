import clsx from 'clsx';
import {
	Controller,
	FieldValues,
	Path,
	RegisterOptions
} from 'react-hook-form';
import styles from './styles.module.scss';

interface PhoneInputInternalProps<TFormValues extends FieldValues> {
	name: string;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	placeholder?: string;
	autoComplete?: string;
	isError?: boolean;
	classNamesPhone?: string;
	disabled?: boolean;
}

export default function PhoneInput(
	props: PhoneInputInternalProps<FieldValues>
) {
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
			name={props.name}
			rules={rules}
			render={({ field }) => {
				// Безопасное значение
				const inputValue = field.value || '';

				return (
					<input
						{...field}
						type='tel'
						id={props.name}
						value={inputValue}
						placeholder={props.placeholder}
						autoComplete=''
						className={clsx(styles.input, props.classNamesPhone, {
							[styles.hasError]: props.isError,
							[styles.disabled]: props.disabled
						})}
						disabled={props.disabled}
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

// <input
// 	{...field}
// 	type='tel'
// 	id={props.name}
// 	placeholder={props.placeholder}
// 	autoComplete={props.autoComplete}
// 	className={clsx(styles.input, props.classNamesInput, {
// 		[styles.hasError]: props.errorMessage,
// 		[styles.disabled]: props.disabled
// 	})}
// 	onFocus={() => {
// 		if (!field.value) {
// 			field.onChange('+7 ');
// 		}
// 	}}
// 	onChange={e => {
// 		const raw = e.target.value?.replace(/\D/g, '') || ''; // только цифры
// 		let formatted = '+7 ';

// 		// удаляем код страны (+7) из raw
// 		const digits = raw.startsWith('7') ? raw.slice(1) : raw;

// 		if (digits?.length > 10) {
// 			return;
// 		} // ограничение на 10 цифр

// 		if (digits?.length > 0) {
// 			formatted += digits.substring(0, 3);
// 		}
// 		if (digits?.length > 3) {
// 			formatted += ' ' + digits.substring(3, 6);
// 		}
// 		if (digits?.length > 6) {
// 			formatted += ' ' + digits.substring(6, 8);
// 		}
// 		if (digits?.length > 8) {
// 			formatted += ' ' + digits.substring(8, 10);
// 		}

// 		field.onChange(formatted);
// 	}}
// />
