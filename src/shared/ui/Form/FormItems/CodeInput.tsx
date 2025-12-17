import clsx from 'clsx';
import { useRef, useState, useEffect } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import styles from './styles.module.scss';

interface CodeInputProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	length: number;
	isError?: boolean;
	disabled?: boolean;
	placeholder?: string;
	classNamesCode?: string;
	control: Control<TFormValues>;
	onComplete: (pin: string) => void;
}

export default function CodeInput<TFormValues extends FieldValues>({
	name,
	length = 5,
	onComplete,
	classNamesCode,
	isError,
	disabled,
	control
}: CodeInputProps<TFormValues>) {
	const inputRef = useRef<(HTMLInputElement | null)[]>([]);
	const [OTP, setOTP] = useState<string[]>(Array(length).fill(''));

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
			// setOTP(initialOTP);
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

		// Вызов onComplete если все заполнено
		// if (newPin.every(d => d !== '')) {
		// 	onComplete(combinedValue);
		// }
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
				required: 'Code is required',
				minLength: {
					value: length,
					message: `Please enter all ${length} digits`
				}
			}}
			render={({ field, fieldState }) => {
				return (
					<div
						className={clsx(styles.codeContainer, classNamesCode, {
							[styles.hasError]: isError || fieldState?.error,
							[styles.disabled]: disabled
						})}
					>
						{Array.from({ length }).map((_, index) => (
							<input
								key={index}
								type='text'
								inputMode='numeric'
								maxLength={1}
								value={OTP[index] || ''}
								onChange={e =>
									handleTextChange(e.target.value, index, field.onChange)
								}
								onKeyDown={e => handleKeyDown(index, e, field.onChange)}
								ref={ref => {
									inputRef.current[index] = ref;
								}}
								disabled={disabled}
								className={clsx(styles.cell, {
									[styles.filled]: OTP[index] !== ''
								})}
								onFocus={e => e.target.select()}
							/>
						))}
					</div>
				);
			}}
		/>
	);
}

// **deepseek 1 *
// import clsx from 'clsx';
// import { useRef, useState } from 'react';
// import { Control, Controller, FieldValues, Path } from 'react-hook-form';
// import styles from './styles.module.scss';

// interface CodeInputProps<TFormValues extends FieldValues> {
// 	name: Path<TFormValues>;
// 	length: number;
// 	isError?: boolean;
// 	disabled?: boolean;
// 	placeholder?: string;
// 	classNamesCode?: string;
// 	control: Control<TFormValues>;
// 	onComplete: (pin: string) => void;
// }

// export default function CodeInput<TFormValues extends FieldValues>({
// 	name,
// 	length = 5,
// 	onComplete,
// 	classNamesCode,
// 	isError,
// 	disabled,
// 	control
// }: CodeInputProps<TFormValues>) {
// 	const inputRef = useRef<(HTMLInputElement | null)[]>([]);
// 	const [OTP, setOTP] = useState<string[]>(Array(length).fill(''));

// 	// Обработчик изменения значения
// 	const handleTextChange = (input: string, index: number) => {
// 		const newPin = [...OTP];
// 		newPin[index] = input;
// 		setOTP(newPin);

// 		// Фокус на следующее поле при вводе
// 		if (input.length === 1 && index < length - 1) {
// 			inputRef.current[index + 1]?.focus();
// 		}

// 		// Фокус на предыдущее поле при удалении
// 		// if (input.length === 0 && index > 0) {
// 		// 	inputRef.current[index - 1]?.focus();
// 		// }

// 		// Если все поля заполнены
// 		if (newPin.every(digit => digit !== '')) {
// 			console.log('ok');
// 			// onComplete(newPin.join(''));
// 		}
// 	};

// 	return (
// 		<Controller
// 			name={name}
// 			control={control}
// 			rules={{ required: 'Code is required', minLength: length }}
// 			render={({ field, fieldState }) => {
// 				const value = field.value || '';

// 				return (
// 					<div
// 						className={clsx(styles.codeContainer, classNamesCode, {
// 							[styles.hasError]: isError || fieldState?.error,
// 							[styles.disabled]: disabled
// 						})}
// 					>
// 						{Array.from({ length }).map((_, index) => (
// 							<input
// 								key={index}
// 								type='text'
// 								maxLength={1}
// 								value={OTP[index] || ''} // Используем OTP state
// 								// onChange={e => handleTextChange(e.target.value, index)}
// 								onChange={e =>
// 									field?.onChange(handleTextChange(e.target.value, index))
// 								}
// 								ref={ref => {
// 									inputRef.current[index] = ref;
// 								}}
// 								disabled={disabled}
// 								className={clsx(styles.cell)}
// 							/>
// 						))}
// 					</div>
// 				);
// 			}}
// 		/>
// 	);
// }

// *********** Internet
// import clsx from 'clsx';
// import { useRef, useState } from 'react';
// import { Control, Controller, FieldValues, Path } from 'react-hook-form';
// import styles from './styles.module.scss';

// interface CodeInputProps<TFormValues extends FieldValues> {
// 	name: Path<TFormValues>;
// 	length: number;
// 	isError?: boolean;
// 	disabled?: boolean;
// 	placeholder?: string;
// 	classNamesCode?: string;
// 	control: Control<TFormValues>;
// 	onComplete: (pin: string) => void;
// }

// export default function CodeInput<TFormValues extends FieldValues>({
// 	name,
// 	length = 5,
// 	onComplete,
// 	classNamesCode,
// 	isError,
// 	disabled,
// 	control
// }: CodeInputProps<TFormValues>) {
// 	const inputRef = useRef<HTMLInputElement[]>(Array(length).fill(null));
// 	const [OTP, setOTP] = useState<string[]>(Array(length).fill(''));

// <Controller
// 	name={name}
// 	control={control}
// 	rules={{ required: 'Code is required', minLength: length }}
// 	render={({ field, fieldState }) => {
// 		const value = field.value || '';

// 		const handleTextChange = (input: string, index: number) => {
// 			const newPin = [...OTP];
// 			newPin[index] = input;
// 			setOTP(newPin);

// 			// check if the user has entered the first digit, if yes, automatically focus on the next input field and so on.

// 			if (input.length === 1 && index < length - 1) {
// 				inputRef.current[index + 1]?.focus();
// 			}

// 			if (input.length === 0 && index > 0) {
// 				inputRef.current[index - 1]?.focus();
// 			}

// 			// if the user has entered all the digits, grab the digits and set as an argument to the onComplete function.

// 			if (newPin.every(digit => digit !== '')) {
// 				onComplete(newPin.join(''));
// 			}
// 		};

// 		return (
// 			<div
// 				className={clsx(styles.codeContainer, classNamesCode, {
// 					[styles.hasError]: isError || fieldState?.error,
// 					[styles.disabled]: disabled
// 				})}
// 			>
// 				{Array.from({ length }).map((_, index) => (
// 					<input
// 						key={index}
// 						type='text'
// 						maxLength={1}
// 						value={value[index] || ''}
// 						onChange={e => handleTextChange(e.target.value, index)}
// 						ref={ref => (inputRef.current[index] = ref as HTMLInputElement)}
// 						disabled={disabled}
// 						className={clsx(styles.cell)}
// 					/>
// 				))}
// 			</div>
// 		);
// 	}}
// />;
// }

// *************deepseek

// import clsx from 'clsx';
// import { useEffect, useRef, useState, useCallback } from 'react';
// import { Control, Controller, FieldValues, Path } from 'react-hook-form';
// import styles from './styles.module.scss';

// interface CodeInputProps<TFormValues extends FieldValues> {
// 	name: Path<TFormValues>;
// 	length: number;
// 	isError?: boolean;
// 	disabled?: boolean;
// 	placeholder?: string;
// 	classNamesCode?: string;
// 	control: Control<TFormValues>;
// 	onComplete?: (code: string) => void; // Колбэк при заполнении всех полей
// }

// export default function CodeInput<TFormValues extends FieldValues>({
// 	name,
// 	length,
// 	isError,
// 	control,
// 	disabled,
// 	classNamesCode,
// 	onComplete
// }: CodeInputProps<TFormValues>) {
// 	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
// 	const [values, setValues] = useState<string[]>(Array(length).fill(''));

// 	const rules = {
// 		required: 'Заполните это поле',
// 		validate: (value: string) =>
// 			value.length === length || `Введите ${length} цифр`
// 	};

// 	// Инициализация refs
// 	useEffect(() => {
// 		inputRefs.current = inputRefs.current.slice(0, length);
// 	}, [length]);

// 	// Фокус на первый input при загрузке
// 	useEffect(() => {
// 		if (!disabled && inputRefs.current[0]) {
// 			const timer = setTimeout(() => {
// 				inputRefs.current[0]?.focus();
// 			}, 0);
// 			return () => clearTimeout(timer);
// 		}
// 	}, [disabled]);

// 	// Обновление значений при изменении field.value
// 	useEffect(() => {
// 		const fieldValue = (control._formValues[name] as string) || '';
// 		if (fieldValue.length <= length) {
// 			const newValues = Array.from({ length }, (_, i) => fieldValue[i] || '');
// 			setValues(newValues);
// 		}
// 	}, [control._formValues, name, length]);

// 	// Обработка изменения значения в конкретном input
// 	const handleInputChange = useCallback(
// 		(index: number, value: string) => {
// 			if (disabled) return;

// 			// Оставляем только цифры
// 			const numericValue = value.replace(/\D/g, '');

// 			// Если введено несколько цифр (например, при вставке)
// 			if (numericValue.length > 1) {
// 				const digits = numericValue.split('').slice(0, length - index);

// 				const newValues = [...values];
// 				digits.forEach((digit, i) => {
// 					const pos = index + i;
// 					if (pos < length) {
// 						newValues[pos] = digit;
// 					}
// 				});

// 				setValues(newValues);

// 				// Обновляем значение в react-hook-form
// 				const combinedValue = newValues.join('');
// 				control._updateField(name, {
// 					value: combinedValue,
// 					shouldDirty: true,
// 					shouldTouch: true,
// 					shouldValidate: true
// 				});

// 				// Фокус на последний заполненный input
// 				const lastFilledIndex = Math.min(index + digits.length, length - 1);
// 				setTimeout(() => {
// 					inputRefs.current[lastFilledIndex]?.focus();
// 				}, 0);

// 				// Проверяем, заполнены ли все поля
// 				if (newValues.every(v => v !== '') && onComplete) {
// 					onComplete(combinedValue);
// 				}

// 				return;
// 			}

// 			// Одиночная цифра
// 			const newValues = [...values];
// 			newValues[index] = numericValue;
// 			setValues(newValues);

// 			// Обновляем значение в react-hook-form
// 			const combinedValue = newValues.join('');
// 			control._updateField(name, {
// 				value: combinedValue,
// 				shouldDirty: true,
// 				shouldTouch: true,
// 				shouldValidate: true
// 			});

// 			// Перемещаем фокус на следующий input, если ввели цифру
// 			if (numericValue && index < length - 1) {
// 				setTimeout(() => {
// 					inputRefs.current[index + 1]?.focus();
// 				}, 0);
// 			}

// 			// Проверяем, заполнены ли все поля
// 			if (newValues.every(v => v !== '') && onComplete) {
// 				onComplete(combinedValue);
// 			}
// 		},
// 		[values, length, disabled, name, control, onComplete]
// 	);

// 	// Обработка нажатия клавиш
// 	const handleKeyDown = useCallback(
// 		(index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
// 			if (disabled) return;

// 			switch (e.key) {
// 				case 'Backspace':
// 					e.preventDefault();
// 					if (!values[index] && index > 0) {
// 						// Если текущий input пустой, удаляем предыдущий и фокусируем его
// 						const newValues = [...values];
// 						newValues[index - 1] = '';
// 						setValues(newValues);

// 						const combinedValue = newValues.join('');
// 						control._updateField(name, {
// 							value: combinedValue,
// 							shouldDirty: true,
// 							shouldTouch: true,
// 							shouldValidate: true
// 						});

// 						setTimeout(() => {
// 							inputRefs.current[index - 1]?.focus();
// 						}, 0);
// 					} else if (values[index]) {
// 						// Если в текущем input есть значение, очищаем его
// 						const newValues = [...values];
// 						newValues[index] = '';
// 						setValues(newValues);

// 						const combinedValue = newValues.join('');
// 						control._updateField(name, {
// 							value: combinedValue,
// 							shouldDirty: true,
// 							shouldTouch: true,
// 							shouldValidate: true
// 						});

// 						// Остаемся на том же input
// 						setTimeout(() => {
// 							inputRefs.current[index]?.focus();
// 						}, 0);
// 					}
// 					break;

// 				case 'ArrowLeft':
// 					e.preventDefault();
// 					if (index > 0) {
// 						inputRefs.current[index - 1]?.focus();
// 					}
// 					break;

// 				case 'ArrowRight':
// 					e.preventDefault();
// 					if (index < length - 1) {
// 						inputRefs.current[index + 1]?.focus();
// 					}
// 					break;

// 				case 'ArrowUp':
// 				case 'ArrowDown':
// 					e.preventDefault();
// 					break;

// 				case 'Tab':
// 					// Позволяем Tab работать нормально
// 					break;

// 				default:
// 					// Разрешаем только цифры
// 					if (
// 						!/^\d$/.test(e.key) &&
// 						!['Home', 'End', 'PageUp', 'PageDown'].includes(e.key)
// 					) {
// 						e.preventDefault();
// 					}
// 					break;
// 			}
// 		},
// 		[values, length, disabled, name, control]
// 	);

// 	// Обработка вставки
// 	const handlePaste = useCallback(
// 		(e: React.ClipboardEvent<HTMLInputElement>) => {
// 			if (disabled) return;

// 			e.preventDefault();
// 			const pastedData = e.clipboardData.getData('text');
// 			const numericData = pastedData.replace(/\D/g, '').slice(0, length);

// 			if (numericData) {
// 				const digits = numericData.split('');
// 				const newValues = Array(length).fill('');

// 				digits.forEach((digit, i) => {
// 					if (i < length) {
// 						newValues[i] = digit;
// 					}
// 				});

// 				setValues(newValues);

// 				const combinedValue = newValues.join('');
// 				control._updateField(name, {
// 					value: combinedValue,
// 					shouldDirty: true,
// 					shouldTouch: true,
// 					shouldValidate: true
// 				});

// 				// Фокус на последний заполненный input
// 				const lastFilledIndex = Math.min(digits.length - 1, length - 1);
// 				setTimeout(() => {
// 					inputRefs.current[lastFilledIndex]?.focus();
// 				}, 0);

// 				// Проверяем, заполнены ли все поля
// 				if (newValues.every(v => v !== '') && onComplete) {
// 					onComplete(combinedValue);
// 				}
// 			}
// 		},
// 		[length, disabled, name, control, onComplete]
// 	);

// 	return (
// 		<Controller
// 			name={name}
// 			control={control}
// 			rules={rules}
// 			render={({ field, fieldState }) => {
// 				return (
// 					<div
// 						className={clsx(styles.codeContainer, {
// 							[styles.hasError]: isError || fieldState.error,
// 							[styles.disabled]: disabled
// 						})}
// 					>
// 						<div className={styles.inputs}>
// 							{values.map((value, index) => (
// 								<input
// 									key={index}
// 									ref={el => (inputRefs.current[index] = el)}
// 									type='text'
// 									inputMode='numeric'
// 									maxLength={1}
// 									value={value}
// 									disabled={disabled}
// 									className={clsx(styles.input, classNamesCode, {
// 										[styles.filled]: value !== '',
// 										[styles.error]: isError || fieldState.error
// 									})}
// 									onChange={e => handleInputChange(index, e.target.value)}
// 									onKeyDown={e => handleKeyDown(index, e)}
// 									onPaste={handlePaste}
// 									onFocus={e => {
// 										// Выделяем текст при фокусе
// 										e.target.select();
// 									}}
// 									aria-label={`Цифра ${index + 1} из ${length}`}
// 								/>
// 							))}
// 						</div>
// 						{/* Скрытое поле для react-hook-form */}
// 						<input {...field} type='hidden' value={field.value || ''} />
// 						{(isError || fieldState.error) && (
// 							<div className={styles.errorMessage}>
// 								{fieldState.error?.message || 'Ошибка ввода'}
// 							</div>
// 						)}
// 					</div>
// 				);
// 			}}
// 		/>
// 	);
// }

// *************  deepseek 2-q вариант *******
// import clsx from 'clsx';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import { Control, Controller, FieldValues, Path } from 'react-hook-form';
// import styles from './styles.module.scss';

// interface CodeInputProps<TFormValues extends FieldValues> {
// 	name: Path<TFormValues>;
// 	length: number;
// 	isError?: boolean;
// 	disabled?: boolean;
// 	placeholder?: string;
// 	classNamesCode?: string;
// 	control: Control<TFormValues>;
// }

// export default function CodeInput<TFormValues extends FieldValues>({
// 	name,
// 	length,
// 	isError,
// 	control,
// 	disabled,
// 	classNamesCode
// }: CodeInputProps<TFormValues>) {
// 	const inputRef = useRef<HTMLInputElement | null>(null);
// 	const containerRef = useRef<HTMLDivElement>(null);
// 	const [focusedIndex, setFocusedIndex] = useState<number>(0);
// 	const [isComposing, setIsComposing] = useState(false); // Для IME input

// 	const rules = {
// 		required: 'Заполните это поле'
// 	};

// 	// Фокус на первый div при первой загрузке
// 	useEffect(() => {
// 		if (containerRef.current && !disabled) {
// 			const firstCell = containerRef.current.querySelector(
// 				'.cell-0'
// 			) as HTMLElement;
// 			if (firstCell) {
// 				const timer = setTimeout(() => {
// 					firstCell.focus();
// 				}, 0);

// 				return () => clearTimeout(timer);
// 			}
// 		}
// 	}, [disabled]);

// 	const handleCellClick = useCallback(
// 		(index: number) => {
// 			if (disabled) {
// 				return;
// 			}
// 			setFocusedIndex(index);

// 			// Фокусируем скрытый input и устанавливаем курсор
// 			setTimeout(() => {
// 				if (inputRef.current) {
// 					inputRef.current.focus();
// 					const currentValue = inputRef.current.value || '';
// 					const cursorPosition = Math.min(index, currentValue.length);
// 					inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
// 				}
// 			}, 0);
// 		},
// 		[disabled]
// 	);

// 	const handleCellKeyDown = useCallback(
// 		(index: number, e: React.KeyboardEvent) => {
// 			if (disabled) {
// 				return;
// 			}

// 			switch (e.key) {
// 				case 'ArrowLeft':
// 					e.preventDefault();
// 					if (index > 0) {
// 						handleCellClick(index - 1);
// 					}
// 					break;
// 				case 'ArrowRight':
// 					e.preventDefault();
// 					if (index < length - 1) {
// 						handleCellClick(index + 1);
// 					}
// 					break;
// 				case 'Backspace':
// 					e.preventDefault();
// 					handleCellClick(index); // Фокусируем текущую ячейку
// 					break;
// 				case 'Delete':
// 					e.preventDefault();
// 					handleCellClick(index); // Фокусируем текущую ячейку
// 					break;
// 				case 'Tab':
// 					break;
// 				default:
// 					if (/^\d$/.test(e.key)) {
// 						handleCellClick(index); // Фокусируем ячейку перед вводом
// 					}
// 					break;
// 			}
// 		},
// 		[disabled, length, handleCellClick]
// 	);

// 	// Основной обработчик ввода
// 	const handleInputChange = useCallback(
// 		(
// 			e: React.ChangeEvent<HTMLInputElement>,
// 			onChange: (value: string) => void
// 		) => {
// 			if (isComposing) {
// 				return;
// 			} // Пропускаем во время композиции (для IME)

// 			const newValue = e.target.value.replace(/\D/g, '').slice(0, length);
// 			const oldValue = inputRef.current?.value || '';

// 			// Обновляем значение
// 			onChange(newValue);

// 			// Определяем позицию для фокуса
// 			let newFocusedIndex = focusedIndex;

// 			if (newValue.length > oldValue.length) {
// 				// Добавили символ
// 				if (focusedIndex < length - 1) {
// 					newFocusedIndex = Math.min(focusedIndex + 1, length - 1);
// 				}
// 			} else if (newValue.length < oldValue.length && newValue.length > 0) {
// 				// Удалили символ (но не все)
// 				newFocusedIndex = Math.max(newValue.length - 1, 0);
// 			} else if (newValue.length === 0) {
// 				// Удалили все
// 				newFocusedIndex = 0;
// 			}

// 			setFocusedIndex(newFocusedIndex);

// 			// Фокусируем ячейку после обновления
// 			setTimeout(() => {
// 				const cell = containerRef.current?.querySelector(
// 					`.cell-${newFocusedIndex}`
// 				) as HTMLElement;
// 				if (cell) {
// 					cell.focus();
// 				}
// 			}, 0);
// 		},
// 		[length, focusedIndex, isComposing]
// 	);

// 	// Обработка клавиш в скрытом input
// 	const handleInputKeyDown = useCallback(
// 		(e: React.KeyboardEvent<HTMLInputElement>) => {
// 			if (e.key === 'Backspace') {
// 				const currentValue = inputRef.current?.value || '';

// 				// Если значение пустое, переходим к предыдущей ячейке
// 				if (currentValue.length === 0 && focusedIndex > 0) {
// 					setFocusedIndex(focusedIndex - 1);

// 					setTimeout(() => {
// 						const prevCell = containerRef.current?.querySelector(
// 							`.cell-${focusedIndex - 1}`
// 						) as HTMLElement;
// 						if (prevCell) {
// 							prevCell.focus();
// 						}
// 					}, 0);
// 				}
// 			}
// 		},
// 		[focusedIndex]
// 	);

// 	// Для обработки IME (мобильные устройства, некоторые языки)
// 	const handleCompositionStart = useCallback(() => {
// 		setIsComposing(true);
// 	}, []);

// 	const handleCompositionEnd = useCallback(
// 		(
// 			e: React.CompositionEvent<HTMLInputElement>,
// 			onChange: (value: string) => void
// 		) => {
// 			setIsComposing(false);

// 			// Обрабатываем завершенный ввод IME
// 			const newValue = e.data.replace(/\D/g, '').slice(0, length);
// 			if (newValue) {
// 				const currentValue = inputRef.current?.value || '';
// 				const combinedValue = (currentValue + newValue).slice(0, length);
// 				onChange(combinedValue);

// 				const newFocusedIndex = Math.min(
// 					focusedIndex + newValue.length,
// 					length - 1
// 				);
// 				setFocusedIndex(newFocusedIndex);

// 				setTimeout(() => {
// 					const cell = containerRef.current?.querySelector(
// 						`.cell-${newFocusedIndex}`
// 					) as HTMLElement;
// 					if (cell) {
// 						cell.focus();
// 					}
// 				}, 0);
// 			}
// 		},
// 		[length, focusedIndex]
// 	);

// 	return (
// 		<Controller
// 			name={name}
// 			control={control}
// 			rules={rules}
// 			render={({ field }) => {
// 				const val = field.value ?? '';
// 				const cells = Array.from({ length }, (_, i) => val[i] ?? '');

// 				return (
// 					<div
// 						ref={containerRef}
// 						className={clsx(styles.codeContainer, {
// 							[styles.hasError]: isError,
// 							[styles.disabled]: disabled
// 						})}
// 					>
// 						<div className={styles.cells}>
// 							{cells.map((char, i) => (
// 								<div
// 									key={i}
// 									tabIndex={disabled ? -1 : 0}
// 									className={clsx(styles.cell, `cell-${i}`, classNamesCode, {
// 										[styles.active]: i === focusedIndex,
// 										[styles.focused]: i === focusedIndex,
// 										[styles.filled]: !!char
// 									})}
// 									onClick={() => handleCellClick(i)}
// 									onKeyDown={e => handleCellKeyDown(i, e)}
// 									onFocus={() => {
// 										setFocusedIndex(i);
// 										// При фокусе на ячейке фокусируем скрытый input
// 										setTimeout(() => {
// 											if (inputRef.current) {
// 												inputRef.current.focus();
// 												const currentValue = inputRef.current.value || '';
// 												const cursorPosition = Math.min(i, currentValue.length);
// 												inputRef.current.setSelectionRange(
// 													cursorPosition,
// 													cursorPosition
// 												);
// 											}
// 										}, 0);
// 									}}
// 								>
// 									{char ||
// 										(i === focusedIndex && !disabled && (
// 											<span className={styles.cursor}>|</span>
// 										))}
// 								</div>
// 							))}
// 						</div>
// 						<input
// 							{...field}
// 							ref={el => {
// 								inputRef.current = el;
// 								field.ref(el);
// 							}}
// 							id={name}
// 							name={name}
// 							type='text'
// 							inputMode='numeric'
// 							autoComplete='one-time-code'
// 							className={styles.hiddenInput}
// 							disabled={disabled}
// 							value={field.value ?? ''}
// 							onChange={e => handleInputChange(e, field.onChange)}
// 							onKeyDown={handleInputKeyDown}
// 							onCompositionStart={handleCompositionStart}
// 							onCompositionEnd={e => handleCompositionEnd(e, field.onChange)}
// 						/>
// 					</div>
// 				);
// 			}}
// 		/>
// 	);
// }

// ************************************ 1-q
//
// вариант Deep**********

// import clsx from 'clsx';
// import { useEffect, useRef, useState } from 'react';
// import { Control, Controller, FieldValues, Path } from 'react-hook-form';
// import styles from './styles.module.scss';

// interface CodeInputProps<TFormValues extends FieldValues> {
// 	name: Path<TFormValues>;
// 	length: number;
// 	isError?: boolean;
// 	disabled?: boolean;
// 	placeholder?: string;
// 	classNamesCode?: string;
// 	control: Control<TFormValues>;
// }

// export default function CodeInput<TFormValues extends FieldValues>({
// 	name,
// 	length,
// 	isError,
// 	control,
// 	disabled,
// 	classNamesCode
// }: CodeInputProps<TFormValues>) {
// 	const inputRef = useRef<HTMLInputElement | null>(null);
// 	const containerRef = useRef<HTMLDivElement>(null);
// 	const [focusedIndex, setFocusedIndex] = useState<number>(0);

// 	const rules = {
// 		required: 'Заполните это поле'
// 	};

// 	// Фокус на первый div при первой загрузке
// 	useEffect(() => {
// 		if (containerRef.current && !disabled) {
// 			// Просто устанавливаем фокус, не обновляем состояние
// 			const firstCell = containerRef.current.querySelector(
// 				'.cell-0'
// 			) as HTMLElement;
// 			if (firstCell) {
// 				firstCell.focus();
// 			}
// 		}
// 	}, [disabled]);

// 	// Фокус на скрытый input при клике на любой div
// 	const handleCellClick = (index: number) => {
// 		if (disabled) {
// 			return;
// 		}
// 		setFocusedIndex(index);
// 		inputRef.current?.focus();

// 		// Устанавливаем курсор в правильную позицию
// 		setTimeout(() => {
// 			if (inputRef.current) {
// 				const currentValue = inputRef.current.value || '';
// 				const cursorPosition = Math.min(index, currentValue.length);
// 				inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
// 			}
// 		}, 0);
// 	};

// 	// Обработка клавиш навигации
// 	const handleCellKeyDown = (index: number, e: React.KeyboardEvent) => {
// 		if (disabled) {
// 			return;
// 		}

// 		switch (e.key) {
// 			case 'ArrowLeft':
// 				e.preventDefault();
// 				if (index > 0) {
// 					handleCellClick(index - 1);
// 				}
// 				break;
// 			case 'ArrowRight':
// 				e.preventDefault();
// 				if (index < length - 1) {
// 					handleCellClick(index + 1);
// 				}
// 				break;
// 			case 'Backspace':
// 				e.preventDefault();
// 				if (inputRef.current) {
// 					const currentValue = inputRef.current.value || '';
// 					const newValue = currentValue.split('');

// 					if (currentValue.length > index) {
// 						// Удаляем символ в текущей позиции
// 						newValue.splice(index, 1);
// 					} else if (index > 0 && currentValue.length === index) {
// 						// Удаляем последний символ
// 						newValue.splice(index - 1, 1);
// 						handleCellClick(index - 1);
// 					}

// 					const newValueStr = newValue.join('');
// 					inputRef.current.value = newValueStr;
// 					inputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
// 				}
// 				break;
// 			case 'Delete':
// 				e.preventDefault();
// 				if (inputRef.current) {
// 					const currentValue = inputRef.current.value || '';
// 					if (index < currentValue.length) {
// 						const newValue = currentValue.split('');
// 						newValue.splice(index, 1);
// 						const newValueStr = newValue.join('');
// 						inputRef.current.value = newValueStr;
// 						inputRef.current.dispatchEvent(
// 							new Event('input', { bubbles: true })
// 						);
// 					}
// 				}
// 				break;
// 			case 'Tab':
// 				// Позволяем Tab работать нормально
// 				break;
// 			default:
// 				// Фокусируем input для ввода цифр
// 				if (/^\d$/.test(e.key)) {
// 					handleCellClick(index);
// 				}
// 				break;
// 		}
// 	};

// 	return (
// 		<Controller
// 			name={name}
// 			control={control}
// 			rules={rules}
// 			render={({ field }) => {
// 				const val = field.value ?? '';
// 				const cells = Array.from({ length }, (_, i) => val[i] ?? '');

// 				return (
// 					<div
// 						ref={containerRef}
// 						className={clsx(styles.codeContainer, {
// 							[styles.hasError]: isError,
// 							[styles.disabled]: disabled
// 						})}
// 					>
// 						<div className={styles.cells}>
// 							{cells.map((char, i) => (
// 								<div
// 									key={i}
// 									tabIndex={disabled ? -1 : 0}
// 									className={clsx(styles.cell, `cell-${i}`, classNamesCode, {
// 										[styles.active]: i === focusedIndex,
// 										[styles.focused]: i === focusedIndex,
// 										[styles.filled]: !!char
// 									})}
// 									onClick={() => handleCellClick(i)}
// 									onKeyDown={e => handleCellKeyDown(i, e)}
// 									onFocus={() => setFocusedIndex(i)}
// 								>
// 									{char ||
// 										(i === focusedIndex && !disabled && (
// 											<span className={styles.cursor}>|</span>
// 										))}
// 								</div>
// 							))}
// 						</div>
// 						<input
// 							{...field}
// 							ref={el => {
// 								inputRef.current = el;
// 								// Подключаем ref react-hook-form
// 								field.ref(el);
// 							}}
// 							id={name}
// 							name={name}
// 							type='text'
// 							inputMode='numeric'
// 							autoComplete='one-time-code'
// 							className={styles.hiddenInput}
// 							disabled={disabled}
// 							value={field.value ?? ''}
// 							onChange={e => {
// 								const newValue = e.target.value
// 									.replace(/\D/g, '')
// 									.slice(0, length);
// 								field.onChange(newValue);

// 								// Автоматически перемещаем фокус
// 								if (newValue.length < length && newValue.length >= 0) {
// 									setFocusedIndex(newValue.length);
// 								}
// 							}}
// 							onKeyDown={e => {
// 								// Обработка Backspace для пустого поля
// 								if (e.key === 'Backspace' && inputRef.current) {
// 									const currentValue = inputRef.current.value || '';
// 									if (currentValue.length === 0 && focusedIndex > 0) {
// 										setFocusedIndex(focusedIndex - 1);
// 									}
// 								}
// 							}}
// 						/>
// 					</div>
// 				);
// 			}}
// 		/>
// 	);
// }

// *************************************   старый код
// import clsx from 'clsx';
// import { useRef } from 'react';
// import { Control, Controller, FieldValues, Path } from 'react-hook-form';
// import styles from './styles.module.scss';

// interface CodeInputProps<TFormValues extends FieldValues> {
// 	name: Path<TFormValues>;
// 	length: number;
// 	isError?: boolean;
// 	disabled?: boolean;
// 	placeholder?: string;
// 	classNamesCode?: string;
// 	control: Control<TFormValues>;
// }

// export default function CodeInput<TFormValues extends FieldValues>({
// 	name,
// 	length,
// 	isError,
// 	control,
// 	disabled,
// 	classNamesCode
// }: CodeInputProps<TFormValues>) {
// 	const inputRef = useRef<HTMLInputElement | null>(null);
// 	const rules = {
// 		required: 'Заполните это поле'
// 	};

// 	return (
// 		<Controller
// 			name={name}
// 			control={control}
// 			rules={rules}
// 			render={({ field }) => {
// 				const val = field.value ?? '';
// 				const cells = Array.from({ length }, (_, i) => val[i] ?? '');

// 				return (
// 					<div
// 						className={clsx(styles.codeContainer, {
// 							[styles.hasError]: isError,
// 							[styles.disabled]: disabled
// 						})}
// 						onClick={() => inputRef.current?.focus()}
// 					>
// 						<div className={styles.cells}>
// 							{cells.map((char, i) => (
// 								<span
// 									key={i}
// 									className={clsx(styles.cell, classNamesCode, {
// 										[styles.active]: i === val.length,
// 										[styles.filled]: !!char
// 									})}
// 								>
// 									{char}
// 								</span>
// 							))}
// 						</div>
// 						<input
// 							{...field}
// 							ref={inputRef}
// 							id={name}
// 							name={name}
// 							type='text'
// 							inputMode='numeric'
// 							autoComplete='one-time-code'
// 							className={styles.hiddenInput}
// 							disabled={disabled}
// 							value={field.value ?? ''} // never undefined
// 							onChange={e =>
// 								field?.onChange(
// 									e.target.value.replace(/\D/g, '').slice(0, length)
// 								)
// 							}
// 						/>
// 					</div>
// 				);
// 			}}
// 		/>
// 	);
// }
