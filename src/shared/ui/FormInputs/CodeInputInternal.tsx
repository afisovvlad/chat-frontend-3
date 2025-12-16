import clsx from 'clsx';
import { useRef } from 'react';
import {
	Control,
	Controller,
	FieldValues,
	Path,
	RegisterOptions
} from 'react-hook-form';
import styles from './InputInternal.module.scss';

interface CodeInputInternalProps<TFormValues extends FieldValues> {
	name: string;
	rules: RegisterOptions<TFormValues, Path<TFormValues>>;
	length: number;
	errorMessage?: string;
	disabled?: boolean;
	placeholder?: string;
	autoComplete?: string;
	control: Control<TFormValues>;
}

export function CodeInputInternal<TFormValues extends FieldValues>({
	name,
	rules,
	length,
	errorMessage,
	control,
	disabled,
	autoComplete = 'one-time-code'
}: CodeInputInternalProps<TFormValues>) {
	const inputRef = useRef<HTMLInputElement | null>(null);

	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field }) => {
				const val = field.value ?? '';
				const cells = Array.from({ length }, (_, i) => val[i] ?? '');
				// const inputRef = useRef<HTMLInputElement | null>(null);

				return (
					<div
						className={clsx(styles.codeContainer, {
							[styles.hasError]: errorMessage,
							[styles.disabled]: disabled
						})}
						onClick={() => inputRef.current?.focus()}
					>
						<div className={styles.cells}>
							{cells.map((char, i) => (
								<span
									key={i}
									className={clsx(styles.cell, {
										[styles.active]: i === val.length,
										[styles.filled]: !!char
									})}
								>
									{char}
								</span>
							))}
						</div>
						<input
							{...field}
							ref={inputRef}
							type='text'
							inputMode='numeric'
							autoComplete={autoComplete}
							className={styles.hiddenInput}
							disabled={disabled}
							value={field.value ?? ''} // never undefined
							onChange={e =>
								field?.onChange(
									e.target.value.replace(/\D/g, '').slice(0, length)
								)
							}
						/>
					</div>
				);
			}}
		/>
	);
}
