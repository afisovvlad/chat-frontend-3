import { classNames } from '@/shared/lib/classNames/classNames';
import { Input, OTPInput, PhoneInput, Textarea } from '@/shared/ui/Form';
import { FormItemType } from '@/shared/ui/Form/FormItems/model/types';
import { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import styles from './FormAuthItem.module.scss';

interface RenderAuthInputProps<TFormValues extends FieldValues> {
	type: FormItemType;
	name: Path<TFormValues>;
	placeholder?: string;
	disabled?: boolean;
	isError: boolean;
	length: number;
	control: Control<TFormValues>;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	classNameParentInput?: string;
}

export function RenderAuthInputByType<TFormValues extends FieldValues>({
	type,
	name,
	placeholder,
	disabled,
	isError,
	length,
	control,
	rules,
	classNameParentInput
}: RenderAuthInputProps<TFormValues>) {
	switch (type) {
		case FormItemType.TEXTAREA:
			return (
				<Textarea
					name={name}
					placeholder={placeholder}
					disabled={disabled}
					classNameTextarea={classNames(
						styles.textarea,
						{ [styles.error]: isError },
						[classNameParentInput]
					)}
					rules={rules}
				/>
			);

		case FormItemType.CODE:
			return (
				<OTPInput
					name={name}
					placeholder={placeholder}
					disabled={disabled}
					length={length}
					control={control}
					classNameInput={classNames(
						styles.input,
						{ [styles.error]: isError },
						[classNameParentInput]
					)}
				/>
			);

		case FormItemType.TEL:
			return (
				<PhoneInput
					name={name}
					placeholder={placeholder}
					disabled={disabled}
					classNameInput={classNames(
						styles.input,
						{ [styles.error]: isError },
						[classNameParentInput]
					)}
				/>
			);

		default:
			return (
				<Input
					name={name}
					placeholder={placeholder}
					disabled={disabled}
					rules={rules}
					type={FormItemType.TEXT}
					classNameInput={classNames(
						styles.input,
						{ [styles.error]: isError },
						[classNameParentInput]
					)}
				/>
			);
	}
}
