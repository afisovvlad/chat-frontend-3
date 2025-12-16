'use client';

import { Form } from '@/shared/ui/Form/Form';
import FormItem from '@/shared/ui/FormItem/FormItem';
import { Back, Logo } from '@icons/index';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { LoginCodeForm } from '../types';
import styles from './LoginCode.module.scss';

export const LoginCode = () => {
	const methods = useForm<LoginCodeForm>();
	const code = useWatch({
		control: methods.control,
		name: 'code',
		defaultValue: ''
	});
	const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>(
		[]
	);

	const formItem = [
		{
			type: 'code',
			name: 'code',
			label: '',
			placeholder: '11111',
			autocomplete: 'one-time-code',
			disabled: false,
			length: 5,
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

	useEffect(() => {
		methods.setError('code', {
			message: 'Неправильный код.Осталось 4 попытки'
		});
	}, []);

	const onSubmit: SubmitHandler<LoginCodeForm> = data => {
		// console.log(data);
		if (code.length === formItem.length) {
			// получаем телефон из store
			// отправляем код и телефон  на сервер
		}
	};

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
			>
				{formItem.map((item, index) => (
					<FormItem
						index={index}
						key={item.name}
						type={item.type}
						name={item.name}
						label={item.label}
						placeholder={item.placeholder}
						autocomplete={item.autocomplete}
						disabled={item.disabled}
						isRequired={item.isRequired}
						rules={item.rules}
						setRef={setRef}
					/>
				))}
			</Form>

			<p>Отправить новый код через 0:56</p>

			<Link href='/'>Не приходит код?</Link>
		</div>
	);
};

// 'use client';

// import { Form } from '@/shared/ui/Form/Form';
// import FormItem from '@/shared/ui/FormItem/FormItem';
// import { Back, Logo } from '@icons/index';
// import Link from 'next/link';
// import { useEffect } from 'react';
// import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
// import { LoginCodeForm } from '../types';
// import styles from './LoginCode.module.scss';

// export const LoginCode = () => {
// 	const methods = useForm<LoginCodeForm>();
// 	const code = useWatch({
// 		control: methods.control,
// 		name: 'code',
// 		defaultValue: ''
// 	});

// 	const formItem = [
// 		{
// 			type: 'code',
// 			name: 'code',
// 			label: '',
// 			placeholder: '11111',
// 			autocomplete: 'one-time-code',
// 			disabled: false,
// 			length: 5,
// 			isRequired: false,
// 			rules: {
// 				required: 'Заполните это поле',
// 				minLength: {
// 					value: 5,
// 					message: 'Минимум 5 знаков'
// 				}
// 			}
// 		}
// 	];

// 	useEffect(() => {
// 		methods.setError('code', {
// 			message: 'Неправильный код.Осталось 4 попытки'
// 		});
// 	}, []);

// 	const onSubmit: SubmitHandler<LoginCodeForm> = data => {
// 		// console.log(data);
// 		if (code.length === formItem.length) {
// 			// получаем телефон из store
// 			// отправляем код и телефон  на сервер
// 		}
// 	};

// 	return (
// 		<div className={styles.loginSlug}>
// 			<Logo style={{ fontSize: '70px' }} className={styles.logo} />
// 			<Link href='/login/phone' title='Назад' className={styles.linkBack}>
// 				<Back style={{ fontSize: '20px' }} className={styles.back} />
// 			</Link>
// 			<h1 className={styles.title}>Подтвердите код</h1>
// 			<p>Код подтверждения отправлен на следующий номер:</p>
// 			<p>+7 915 325 14 89</p>
// 			<p>Введите код</p>
// 			<Form<LoginCodeForm>
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
// 					/>
// 				))}
// 			</Form>

// 			<p>Отправить новый код через 0:56</p>

// 			<Link href='/'>Не приходит код?</Link>
// 		</div>
// 	);
// };
