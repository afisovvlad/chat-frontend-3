import { classNames } from '@/shared/lib/classNames/classNames';
import {
	FieldValues,
	Path,
	PathValue,
	RegisterOptions,
	useController,
	useFormContext
} from 'react-hook-form';
import { FormItemAutocomplete, FormItemType } from '../model/types';
import styles from './styles.module.scss';
import { forbiddenChars } from '../const/forbiddenChars';

interface InputProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>> | undefined;
	type: FormItemType | string;
	placeholder?: string;
	disabled?: boolean;
	autoComplete?: FormItemAutocomplete;
	parentInputClass?: string;
}

export function Input<TFormValues extends FieldValues>({
	name,
	rules = {
		required: 'Заполните это поле'
	},
	type = 'text',
	placeholder = '',
	disabled,
	autoComplete,
	parentInputClass
}: InputProps<TFormValues>) {
	const { register, setValue } = useFormContext<TFormValues>();
	const { fieldState, field } = useController({ name });
	const isError = !!fieldState.error;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value;

		// если это поле nickname, удаляем запрещённые символы
		if (name === 'nickname') {
			value = value.replace(forbiddenChars, '');
		}

		setValue(name, value as PathValue<TFormValues, Path<TFormValues>>, {
			shouldValidate: true
		});
	};

	return (
		<input
			{...register(name, rules)}
			type={type}
			id={name}
			name={name}
			placeholder={placeholder}
			disabled={disabled}
			autoComplete={autoComplete || FormItemAutocomplete.ON}
			className={classNames(
				styles.input,
				{
					[styles.hasError]: isError,
					[styles.disabled]: disabled
				},
				[parentInputClass]
			)}
			onChange={handleChange} // <-- фильтрация символов
			value={field.value || ''} // <-- управляемое значение
		/>
	);
}
