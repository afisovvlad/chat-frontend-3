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
	FormItemNames,
	FormItemType
} from '@/shared/ui/Form/FormItems/model/types';
import { Text } from '@/shared/ui/Text';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import styles from './page.module.scss';

interface SupportForm {
	email: string;
	message: string;
}

export default function SupportPage() {
	// const [disabled, setDisabled] = useState(true);
	const methods = useForm<SupportForm>();

	const email = useWatch({
		control: methods.control,
		name: 'email'
	});
	const message = useWatch({
		control: methods.control,
		name: 'message'
	});
	const disabled = !(email?.length > 4 && message?.length > 10);

	const formItem = [
		{
			type: FormItemType.EMAIL,
			name: FormItemNames.EMAIL,
			label: 'Укажите Ваш e-mail',
			placeholder: 'e-mail',
			rules: {
				required: 'Заполните это поле',
				pattern: {
					value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
					message: 'Некорректный e-mail'
				}
			}
		},
		{
			type: FormItemType.TEXTAREA,
			name: FormItemNames.MESSAGE,
			label: 'Опишите Вашу проблему'
		}
	];

	useEffect(() => {
		methods.setFocus('email');
	}, [methods]);

	// useEffect(() => {
	// 	if (email?.length > 4 && message?.length > 10) {
	// 		console.log(email?.length > 4 && message?.length > 10);
	// 		setDisabled(false);
	// 	} else {
	// 		setDisabled(true);
	// 	}
	// }, [email, message]);

	const onSubmit: SubmitHandler<SupportForm> = data => {
		console.log(data);
	};

	return (
		<div className={styles.support}>
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
						// disabled={item.disabled}
						rules={item.rules || undefined}
						classNameParentInput={styles.formItem}
					/>
				))}
				<Text className={styles.faqText}>
					Ознакомьтесь со 
					<Link href='/support/faq' className={styles.faqLink}>
						списком известных проблем и их решениями.
					</Link>
				</Text>
				<Button
					btnType={ButtonType.SUBMIT}
					disabled={disabled}
					theme={ButtonTheme.BACKGROUND}
					color={ButtonColor.PRIMARY}
				>
					Отправить
				</Button>
			</Form>
		</div>
	);
}
