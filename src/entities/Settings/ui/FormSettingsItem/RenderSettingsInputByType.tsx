import { FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { classNames } from '@/shared/lib/classNames/classNames';
import { Input, SelectItem, Textarea } from '@/shared/ui/Form';
import {
	FormItemAutocomplete,
	FormItemType
} from '@/shared/ui/Form/FormItems/model/types';
import styles from './FormSettingsItem.module.scss';

interface RenderSettingsInputByTypeProps<TFormValues extends FieldValues> {
	name: Path<TFormValues>;
	type: FormItemType;
	placeholder?: string;
	autoComplete?: FormItemAutocomplete;
	disabled?: boolean;
	isRequired?: boolean;
	isError: boolean;
	rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
	classNameParentInput?: string;
	classNameParentSelect?: string;
	isMessageShort?: boolean;
	textareaHeight?: string | undefined;
	options?: { value: string; label: string }[] | [];
}

export function RenderSettingsInputByType<TFormValues extends FieldValues>({
	name,
	type,
	placeholder,
	disabled,
	isError,
	rules,
	classNameParentInput,
	classNameParentSelect,
	isMessageShort,
	textareaHeight,
	options = []
}: RenderSettingsInputByTypeProps<TFormValues>) {
	switch (type) {
		case FormItemType.TEXTAREA:
			return (
				<Textarea
					name={name}
					placeholder={placeholder}
					disabled={disabled}
					classNameTextarea={classNames(
						styles.textarea,
						{
							[styles.error]: isError,
							[styles.messageShort]: isMessageShort
						},
						[classNameParentInput]
					)}
					rules={rules}
					height={textareaHeight}
				/>
			);

		case FormItemType.SELECT:
			return (
				<SelectItem
					options={options}
					name={name}
					disabled={disabled}
					parentSelectClass={classNames(
						styles.select,
						{ [styles.error]: isError },
						[classNameParentSelect]
					)}
				/>
			);
		case FormItemType.EMAIL:
			return (
				<Input
					name={name}
					placeholder={placeholder}
					disabled={disabled}
					rules={rules}
					type={FormItemType.EMAIL}
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
