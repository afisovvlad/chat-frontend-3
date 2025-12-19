'use client';

import FormAuthItem from '@/entities/Auth/ui/FormAuthItem/FormAuthItem';
import {
	FormAuthItemNames,
	FormAuthItemType
} from '@/shared/ui/Form/FormItems/model/types';
import { Form } from '@/shared/ui/Form/FormProvider/ui/Form';
import { Back, Logo } from '@icons/index';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { LoginCodeForm } from '../types';
import styles from './LoginCode.module.scss';

export const LoginCode = () => {
	const length = 5; // получаем из state
	const methods = useForm<LoginCodeForm>();
	const { handleSubmit } = methods;
	const code = useWatch({
		control: methods.control,
		name: 'code'
	});

	const formItem = [
		{
			type: FormAuthItemType.CODE,
			name: FormAuthItemNames.CODE,
			label: '',
			placeholder: '11111',
			disabled: false,
			isRequired: false
		}
	];

	const [submitted, setSubmitted] = useState(false);

	const onSubmit = useCallback<SubmitHandler<LoginCodeForm>>(data => {
		console.log(data);
		// получаем телефон из store
		// отправляем код и телефон  на сервер
	}, []);

	useEffect(() => {
		if (code?.length === length && !submitted) {
			handleSubmit(onSubmit)();
			setTimeout(() => setSubmitted(true), 0); // отложенный setState
		}
	}, [code, submitted, handleSubmit, onSubmit, length]);

	return (
		<div className={styles.loginSlug}>
			<Logo style={{ fontSize: '70px' }} className={styles.logo} />
			<Link href='/login/phone' title='Назад' className={styles.linkBack}>
				<Back style={{ fontSize: '20px' }} className={styles.back} />
			</Link>
			<h1 className={styles.title}>Подтвердите код</h1>
			<p>Код подтверждения отправлен на следующий номер:</p>
			<p>+7 915 325 14 89</p>
			<p>Введите код</p>
			<Form<LoginCodeForm>
				methods={methods}
				onSubmit={onSubmit}
				className={styles.form}
				shouldSubmit={code?.length === length}
			>
				{formItem.map(item => (
					<FormAuthItem
						key={item.name}
						type={item.type}
						name={item.name}
						label={item.label}
						placeholder={item.placeholder}
						length={length}
						disabled={item.disabled}
						isRequired={item.isRequired}
					/>
				))}
			</Form>

			<p>Отправить новый код через 0:56</p>

			<Link href='/'>Не приходит код?</Link>
		</div>
	);
};
