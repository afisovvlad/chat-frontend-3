'use client';

import FormSettingsItem from '@/entities/Settings/ui/FormSettingsItem/FormSettingsItem';
import { Button } from '@/shared/ui/Button';
import {
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button/model/type';
import { Form } from '@/shared/ui/Form';
import {
	FormAuthItemNames,
	FormAuthItemType
} from '@/shared/ui/Form/FormItems/model/types';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import styles from './page.module.scss';

interface SupportForm {
	email: string;
	message: string;
}

export default function SupportPage() {
	const [disabled, setDisabled] = useState(true);
	const methods = useForm<SupportForm>();

	const formItem = [
		{
			type: FormAuthItemType.EMAIL,
			name: FormAuthItemNames.EMAIL,
			label: 'Укажите Ваш e-mail',
			placeholder: 'e-mail',
			disabled: false
		},
		{
			type: FormAuthItemType.TEXTAREA,
			name: FormAuthItemNames.MESSAGE,
			label: 'Опишите Вашу проблему',
			placeholder: '',
			disabled: false
		}
	];

	const onSubmit: SubmitHandler<SupportForm> = data => {
		console.log(data);
	};

	return (
		<Form<SupportForm>
			methods={methods}
			onSubmit={onSubmit}
			// className={styles.form}
		>
			{formItem.map(item => (
				<FormSettingsItem
					key={item.name}
					type={item.type}
					name={item.name}
					label={item.label}
					placeholder={item.placeholder}
					autoComplete={undefined}
					disabled={item.disabled}
					rules={undefined}
					classNameParentInput={styles.formItem}
				/>
			))}
			<Button
				btnType={ButtonType.SUBMIT}
				disabled={disabled}
				theme={ButtonTheme.BACKGROUND}
				color={ButtonColor.PRIMARY}
			>
				Отправить
			</Button>
		</Form>
	);
}
