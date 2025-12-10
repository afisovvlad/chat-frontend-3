'use client';

import { Form } from '@/shared/ui/Form/Form';
import FormItem from '@/shared/ui/FormItem/FormItem';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { InputsTypes } from '../types';
import styles from './LoginPhone.module.scss';

export const LoginPhone = () => {
	const router = useRouter();

	const formItem = [
		// {
		// 	type: 'text',
		// 	name: 'name',
		// 	label: 'Имя',
		// 	placeholder: 'Иван',
		// 	autocomplete: 'given-name', // необходимое свойство для автозаполнения, чему равно - посмотреть в интернете
		// 	disabled: false,
		// 	isRequired: false,
		// 	rules: {
		// 		required: 'Заполните это поле',
		// 		minLength: {
		// 			value: 3,
		// 			message: 'Минимум 3 буквы'
		// 		},
		// 		pattern: {
		// 			value: /^[a-zA-Zа-яёА-ЯЁ]+$/,
		// 			message: 'Допускаются только буквы'
		// 		}
		// 	}
		// },
		// {
		// 	type: 'text',
		// 	name: 'nickName',
		// 	label: 'Введите никнейм',
		// 	placeholder: 'alex',
		// 	autocomplete: 'family-name',
		// 	disabled: false,
		// 	isRequired: false,
		// 	rules: {
		// 		required: 'Заполните это поле',
		// 		minLength: {
		// 			value: 3,
		// 			message: 'Минимум 3 буквы'
		// 		},
		// 		pattern: {
		// 			value: /^[a-zA-Zа-яёА-ЯЁ]+$/,
		// 			message: 'Допускаются только буквы'
		// 		}
		// 	}
		// },
		{
			type: 'tel',
			name: 'phone',
			label: 'Введите номер телефона',
			placeholder: '+ 7 900 000 00 00',
			autocomplete: 'tel',
			disabled: false,
			isRequired: false,
			rules: {
				required: 'Заполните это поле',
				minLength: {
					value: 12,
					message: 'Минимум 12 знаков'
				},
				pattern: {
					value: /^\+[0-9]+$/,
					message: 'Допускаются только цифры'
				}
			}
		}
		// {
		// 	type: 'code',
		// 	name: 'code',
		// 	label: null,
		// 	placeholder: '11111',
		// 	autocomplete: 'one-time-code',
		// 	disabled: false,
		// 	isRequired: false,
		// 	rules: {
		// 		required: 'Заполните это поле',
		// 		minLength: {
		// 			value: 5,
		// 			message: 'Минимум 5 знаков'
		// 		}
		// 	}
		// }
	];

	const onSubmit: SubmitHandler<InputsTypes> = data => {
		console.log(data);
		router.push('/login/code');
	};

	return (
		<div className={styles.loginSlug}>
			<Link href='/login'>Назад</Link>
			<h1 className={styles.title}>Вход/регистрация</h1>
			<Form onSubmit={onSubmit}>
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
				<button type='submit'>Далее</button>
			</Form>
		</div>
	);
};

// import Link from 'next/link';
// import styles from './LoginPhone.module.scss';

// export const LoginPhone = () => {
// 	return (
// 		<div className={styles.loginSlug}>
// 			<Link href='/login'>Назад</Link>
// 			<h1 className={styles.title}>Вход/регистрация</h1>
// 			<form action=''>
// 				<label htmlFor='phone'>Введите номер телефона</label>
// 				<input type='text' id='phone' />
// 			</form>

// 			<Link href='/login/code'>Далее</Link>
// 		</div>
// 	);
// };
