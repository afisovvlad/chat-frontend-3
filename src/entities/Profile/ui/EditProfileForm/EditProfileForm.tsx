'use client';

import { FormSettingsItem } from '@/entities/FormSettingsItem';
import { Form } from '@/shared/ui/Form';
import {
	FormItemAutocomplete,
	FormItemNames,
	FormItemType
} from '@/shared/ui/Form/FormItems/model/types';
import { SubmitHandler, useForm } from 'react-hook-form';
import styles from './EditProfileForm.module.scss';
import { Button, ButtonType } from '@/shared/ui/Button';

interface SupportForm {
	name: string;
	lastName: string;
	nickname: string;
	message: string;
}

export function EditProfileForm() {
	const methods = useForm<SupportForm>();

	const formItem = [
		{
			type: FormItemType.TEXT,
			name: FormItemNames.NAME,
			label: 'Изменить имя',
			placeholder: 'Иван',
			autocomplete: FormItemAutocomplete.NAME,
			disabled: false,
			isRequired: false,
			rules: {
				required: 'Заполните это поле',
				minLength: {
					value: 3,
					message: 'Минимум 3 буквы'
				},
				pattern: {
					value: /^[a-zA-Zа-яёА-ЯЁ]+$/,
					message: 'Допускаются только буквы'
				}
			}
		},
		{
			type: FormItemType.TEXT,
			name: FormItemNames.LAST_NAME,
			label: 'Изменить фамилию',
			placeholder: 'Иванов',
			autocomplete: FormItemAutocomplete.LAST_NAME,
			disabled: false,
			isRequired: false,
			rules: {
				required: 'Заполните это поле',
				minLength: {
					value: 3,
					message: 'Минимум 3 буквы'
				},
				pattern: {
					value: /^[a-zA-Zа-яёА-ЯЁ]+$/,
					message: 'Допускаются только буквы'
				}
			}
		},
		{
			type: FormItemType.TEXT,
			name: FormItemNames.NICKNAME,
			label: 'Изменить никнейм',
			placeholder: 'ivan',
			autocomplete: FormItemAutocomplete.NICKNAME,
			disabled: false,
			isRequired: false,
			rules: {
				required: 'Заполните это поле',
				minLength: {
					value: 3,
					message: 'Минимум 3 буквы'
				},
				pattern: {
					value: /^[a-zA-Zа-яёА-ЯЁ]+$/,
					message: 'Допускаются только буквы'
				}
			}
		},
		{
			type: FormItemType.TEXTAREA,
			name: FormItemNames.MESSAGE,
			label: 'Напишите пару слов о себе',
			rules: {
				required: 'Заполните это поле'
			}
		}
	];

	const onSubmit: SubmitHandler<SupportForm> = data => {
		console.log(data);
	};

	return (
		<Form<SupportForm>
			methods={methods}
			onSubmit={onSubmit}
			className={styles.form}
		>
			{formItem.map(item => (
				<FormSettingsItem
					key={item.name}
					type={item.type}
					name={item.name}
					label={item.label}
					placeholder={item.placeholder}
					autoComplete={undefined}
					rules={item.rules || undefined}
					classNameParentInput={styles.formItem}
					textareaHeight={'56px'}
				/>
			))}
			<Button btnType={ButtonType.SUBMIT}>Сохранить</Button>
		</Form>
	);
}
