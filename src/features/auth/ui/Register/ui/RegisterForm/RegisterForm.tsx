'use client';

import { FormAuthItem } from '@/features/auth';
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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RegisterForm } from '../..';
import { registerFormItems } from '../../model/const/registerFormItems';
import styles from './RegisterForm.module.scss';

export function RegisterForm() {
	const [disabled, setDisabled] = useState(true);
	const methods = useForm<RegisterForm>();
	// const {
	// 	register,
	// 	handleSubmit,
	// 	formState: { errors }
	// } = useForm();
	// const onSubmit = (data: any) => {
	// 	console.log(data);
	// };

	const onSubmit = () => {
		console.log('submit');
	};

	return (
		<>
			<Form<RegisterForm>
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
							// disabled={disabled}
							classNameParentInput={styles.codeInput}
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
