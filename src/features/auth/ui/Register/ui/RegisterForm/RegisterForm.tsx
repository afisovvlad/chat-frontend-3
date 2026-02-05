'use client';

import { FormAuthItem, useSetAuthStep } from '@/features/auth';
import {
	Button,
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button';
import { Form } from '@/shared/ui/FormComponent';
import {
	FontWeight,
	Text,
	TextColor,
	TextSize,
	TextType
} from '@/shared/ui/Text';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { RegisterForm } from '../..';
import { useLazySendNicknameQuery } from '../../api/registerApi';
import { registerFormItems } from '../../model/const/registerFormItems';
import { IRegister } from '../../model/types/types';
import styles from './RegisterForm.module.scss';

export function RegisterForm() {
	const [disabled, setDisabled] = useState(true);
	const [responseError, setResponseError] = useState('');
	const methods = useForm<RegisterForm>();
	const { control, setError } = methods;
	const values = useWatch({ control: control });
	const name = values.name;
	const nickname = values.nickname;
	const [sendNickname, { data, isLoading, error }] = useLazySendNicknameQuery();
	const setStep = useSetAuthStep();

	console.log(data);

	useEffect(() => {
		if (name?.length >= 3 && nickname.length >= 3) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [name, nickname]);

	useEffect(() => {
		if (data?.messages === 'Этот nickname свободен') {
			setResponseError('');
			setStep('finish-register');
		} else if (
			data?.messages === 'Пользователь с таким ником уже существует.'
		) {
			setError('nickname', {
				message: 'Пользователь с таким ником уже существует.'
			});
			setResponseError('Пользователь с таким ником уже существует.');
		}
	}, [data, setStep]);

	const onSubmit: SubmitHandler<IRegister> = async data => {
		try {
			await sendNickname(data.nickname);
		} catch (_) {
			setResponseError('При отправке произошла ошибка. Попробуйте позже');
		}
	};

	return (
		<>
			<Form<IRegister>
				methods={methods}
				onSubmit={onSubmit}
				className={styles.form}
			>
				<div className={styles.inputsWrapper}>
					{registerFormItems.map(item => (
						<FormAuthItem
							key={item.name}
							type={item.type}
							name={item.name}
							label={item.label}
							rules={item.rules}
							// disabled={disabled}
						/>
					))}
				</div>
				<Text
					type={TextType.TEXT}
					fontSize={TextSize.S}
					color={TextColor.GRAY}
					fontWeight={FontWeight.MEDIUM}
					className={styles.text}
				>
					Нажимая на «Зарегистрироваться», вы соглашаетесь с 
					<Link href='/' className={styles.link}>
						Пользовательским соглашением
					</Link>
				</Text>

				<Button
					btnType={ButtonType.SUBMIT}
					disabled={disabled}
					theme={ButtonTheme.BACKGROUND}
					color={ButtonColor.PRIMARY}
				>
					Зарегистрироваться
				</Button>
			</Form>

			{/* <form onSubmit={handleSubmit(data => console.log(data))}>
				<label htmlFor='firstName'>Введите имя</label>
				<input {...register('firstName', { required: true })} />	
				{errors.firstName && <p style={{color: 'red'}}>Name is required.</p>}

				<label htmlFor='lastName'>Введите фамилию</label>
				<input {...register('lastName', { required: true })} />
				{errors.lastName && <p style={{color: 'red'}}>Last name is required.</p>}

				<label htmlFor='age'>Введите возраст</label>
				<input {...register('age', { pattern: /\d+/ })} />
				{errors.age && <p style={{color: 'red'}}>Please enter number for age.</p>}

				<input type='submit' />
			</form> */}
		</>
	);
}
