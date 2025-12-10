'use client';

import { Form } from '@/shared/ui/Form/Form';
import FormItem from '@/shared/ui/FormItem/FormItem';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LoginCodeForm } from '../types';
import styles from './LoginCode.module.scss';

export const LoginCode = () => {
	const methods = useForm<LoginCodeForm>();
	const onSubmit: SubmitHandler<LoginCodeForm> = data => console.log(data);

	const formItem = [
		{
			type: 'code',
			name: 'code',
			label: '',
			placeholder: '11111',
			autocomplete: 'one-time-code',
			disabled: false,
			isRequired: false,
			rules: {
				required: 'Заполните это поле',
				minLength: {
					value: 5,
					message: 'Минимум 5 знаков'
				}
			}
		}
	];

	return (
		<div className={styles.loginSlug}>
			<Link href='/login/phone'>Назад</Link>
			<h1 className={styles.title}>Подтвердите код</h1>
			<p>Код подтверждения отправлен на следующий номер:</p>
			<p>+7 915 325 14 89</p>
			<p>Введите код</p>
			<Form<LoginCodeForm>
				methods={methods}
				onSubmit={onSubmit}
				className={styles.form}
			>
				{formItem.map(item => (
					<FormItem
						key={item.name}
						type={item.type}
						itemName={item.name}
						label={item.label}
						placeholder={item.placeholder}
						autocomplete={item.autocomplete}
						disabled={item.disabled}
						// error={item.error}
						isRequired={item.isRequired}
						rules={item.rules}
					/>
				))}
			</Form>

			<p>Отправить новый код через 0:56</p>

			<Link href='/'>Не приходит код?</Link>
		</div>
	);
};
