'use client';

import {
	Button,
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button';
import { Form } from '@/shared/ui/Form/Form';
import FormItem from '@/shared/ui/FormItem/FormItem';
import { Back, Logo } from '@icons/index';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import styles from './LoginPhone.module.scss';

interface LoginPhoneForm {
	phone: string;
}

export const LoginPhone = () => {
	const [disabled, setDisabled] = useState(true);
	const router = useRouter();
	const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>(
		[]
	);
	const methods = useForm<LoginPhoneForm>({
		defaultValues: {
			phone: '' // обязательно пустая строка
		}
	});

	const phone = useWatch({
		control: methods.control,
		name: 'phone',
		defaultValue: ''
	});

	useEffect(() => {
		setDisabled(phone.length !== 16);
	}, [phone]);

	const formItem = [
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
					value: /^\+7 \d{3} \d{3} \d{2} \d{2}$/,
					message: 'Допускаются только цифры'
				}
			}
		}
	];

	const setRef = (
		index: number,
		el: HTMLInputElement | HTMLTextAreaElement | null
	) => {
		inputRefs.current[index] = el;
	};

	// ⬅️ Фокус в РОДИТЕЛЕ, а не внутри FormItem
	useEffect(() => {
		const firstEmpty = inputRefs.current.find(el => el && el.value === '');
		firstEmpty?.focus();
	}, []);

	const onSubmit: SubmitHandler<LoginPhoneForm> = data => {
		console.log(data);
		// console.log(data.phone);
		// сохраняем phone в store
		//отправляем телефон на сервер
		router.push('/login/code');
	};

	return (
		<div className={styles.loginPhone}>
			<Logo style={{ fontSize: '70px' }} className={styles.logo} />
			<Link href='/login' title='Назад' className={styles.linkBack}>
				<Back style={{ fontSize: '20px' }} className={styles.back} />
			</Link>
			<h1 className={styles.title}>Вход/регистрация</h1>
			<Form<LoginPhoneForm>
				methods={methods}
				onSubmit={onSubmit}
				className={styles.form}
			>
				{formItem.map((item, index) => (
					<FormItem
						index={index}
						key={item.name}
						type={item.type}
						itemName={item.name}
						label={item.label}
						placeholder={item.placeholder}
						autocomplete={item.autocomplete}
						disabled={item.disabled}
						isRequired={item.isRequired}
						rules={item.rules}
						classNamesInput={styles.formItem}
						setRef={setRef}
					/>
				))}
				<Button
					btnType={ButtonType.SUBMIT}
					disabled={disabled}
					theme={ButtonTheme.BACKGROUND}
					color={ButtonColor.PRIMARY}
				>
					Далее
				</Button>
			</Form>
		</div>
	);
};

// 'use client';

// import { Back, Logo } from '@icons/index';
// import {
// 	Button,
// 	ButtonColor,
// 	ButtonTheme,
// 	ButtonType
// } from '@/shared/ui/Button';
// import { Form } from '@/shared/ui/Form/Form';
// import FormItem from '@/shared/ui/FormItem/FormItem';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
// import styles from './LoginPhone.module.scss';

// interface LoginPhoneForm {
// 	phone: string;
// }

// export const LoginPhone = () => {
// 	const [disabled, setDisabled] = useState(true);
// 	const router = useRouter();
// 	const methods = useForm<LoginPhoneForm>({
// 		defaultValues: {
// 			phone: '' // обязательно пустая строка
// 		}
// 	});

// 	const phone = useWatch({
// 		control: methods.control,
// 		name: 'phone',
// 		defaultValue: ''
// 	});

// 	useEffect(() => {
// 		setDisabled(phone.length !== 16);
// 	}, [phone]);

// 	const formItem = [
// 		// {
// 		// 	type: 'text',
// 		// 	name: 'name',
// 		// 	label: 'Имя',
// 		// 	placeholder: 'Иван',
// 		// 	autocomplete: 'given-name', // необходимое свойство для автозаполнения, чему равно - посмотреть в интернете
// 		// 	disabled: false,
// 		// 	isRequired: false,
// 		// 	rules: {
// 		// 		required: 'Заполните это поле',
// 		// 		minLength: {
// 		// 			value: 3,
// 		// 			message: 'Минимум 3 буквы'
// 		// 		},
// 		// 		pattern: {
// 		// 			value: /^[a-zA-Zа-яёА-ЯЁ]+$/,
// 		// 			message: 'Допускаются только буквы'
// 		// 		}
// 		// 	}
// 		// },
// 		// {
// 		// 	type: 'text',
// 		// 	name: 'nickName',
// 		// 	label: 'Введите никнейм',
// 		// 	placeholder: 'alex',
// 		// 	autocomplete: 'family-name',
// 		// 	disabled: false,
// 		// 	isRequired: false,
// 		// 	rules: {
// 		// 		required: 'Заполните это поле',
// 		// 		minLength: {
// 		// 			value: 3,
// 		// 			message: 'Минимум 3 буквы'
// 		// 		},
// 		// 		pattern: {
// 		// 			value: /^[a-zA-Zа-яёА-ЯЁ]+$/,
// 		// 			message: 'Допускаются только буквы'
// 		// 		}
// 		// 	}
// 		// },
// 		{
// 			type: 'tel',
// 			name: 'phone',
// 			label: 'Введите номер телефона',
// 			placeholder: '+ 7 900 000 00 00',
// 			autocomplete: 'tel',
// 			disabled: false,
// 			isRequired: false,
// 			rules: {
// 				required: 'Заполните это поле',
// 				minLength: {
// 					value: 12,
// 					message: 'Минимум 12 знаков'
// 				},
// 				pattern: {
// 					value: /^\+7 \d{3} \d{3} \d{2} \d{2}$/,
// 					message: 'Допускаются только цифры'
// 				}
// 			}
// 		}
// 		// {
// 		// 	type: 'code',
// 		// 	name: 'code',
// 		// 	label: null,
// 		// 	placeholder: '11111',
// 		// 	autocomplete: 'one-time-code',
// 		// 	disabled: false,
// 		// 	isRequired: false,
// 		// 	rules: {
// 		// 		required: 'Заполните это поле',
// 		// 		minLength: {
// 		// 			value: 5,
// 		// 			message: 'Минимум 5 знаков'
// 		// 		}
// 		// 	}
// 		// }
// 	];

// 	const onSubmit: SubmitHandler<LoginPhoneForm> = data => {
// 		console.log(data);
// 		// console.log(data.phone);
// 		// сохраняем phone в store
// 		//отправляем телефон на сервер
// 		router.push('/login/code');
// 	};

// 	return (
// 		<div className={styles.loginPhone}>
// 			<Logo style={{ fontSize: '70px' }} className={styles.logo} />
// 			<Link href='/login' title='Назад' className={styles.linkBack}>
// 				<Back style={{ fontSize: '20px' }} className={styles.back} />
// 			</Link>
// 			<h1 className={styles.title}>Вход/регистрация</h1>
// 			<Form<LoginPhoneForm>
// 				methods={methods}
// 				onSubmit={onSubmit}
// 				className={styles.form}
// 			>
// 				{formItem.map(item => (
// 					<FormItem
// 						key={item.name}
// 						type={item.type}
// 						itemName={item.name}
// 						label={item.label}
// 						placeholder={item.placeholder}
// 						autocomplete={item.autocomplete}
// 						disabled={item.disabled}
// 						isRequired={item.isRequired}
// 						rules={item.rules}
// 						classNamesInput={styles.formItem}
// 					/>
// 				))}
// 				<Button
// 					btnType={ButtonType.SUBMIT}
// 					disabled={disabled}
// 					theme={ButtonTheme.BACKGROUND}
// 					color={ButtonColor.PRIMARY}
// 				>
// 					Далее
// 				</Button>
// 			</Form>
// 		</div>
// 	);
// };
