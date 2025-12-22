'use client';

import FormAuthItem from '@/entities/Auth/ui/FormAuthItem/FormAuthItem';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector/useAppSelector';
import { Button } from '@/shared/ui/Button';
import {
	ButtonColor,
	ButtonFontSize,
	ButtonSize,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button/model/type';
import {
	FormAuthItemNames,
	FormAuthItemType
} from '@/shared/ui/Form/FormItems/model/types';
import { Form } from '@/shared/ui/Form/FormProvider/ui/Form';
import {
	FontWeight,
	Text,
	TextAlign,
	TextColor,
	TextSize,
	TextTag,
	TextType,
	TitleTag
} from '@/shared/ui/Text';
import { Back, InfoCircle, Logo } from '@icons/index';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { LoginCodeForm } from '../types';
import styles from './LoginCode.module.scss';
import { authActions } from '@/features/auth';

export const LoginCode = () => {
	const [attemptsNumber, setAttemptsNumber] = useState(5);
	const [timeLeft, setTimeLeft] = useState(60);
	const [submitted, setSubmitted] = useState(false);
	const {
		phone_number,
		code_len,
		isDisabledCodeAttempts: disabled
	} = useAppSelector(state => state.auth);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const methods = useForm<LoginCodeForm>();
	const { handleSubmit, setError } = methods;
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
			isRequired: false
		}
	];

	console.log('attemptsNumber', attemptsNumber);
	console.log('disabled', disabled);

	const onSubmit = useCallback<SubmitHandler<LoginCodeForm>>(async () => {
		// отправляем код и телефон  на сервер
		const response = await fetch('/api/auth/setTokens', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ phone_number, code })
		});

		console.log('response in LoginCode', response);
		const res = await response.json();
		console.log('res in LoginCode', res);
		if (res.success) {
			router.push('/');
		} else if (res.errors) {
			if (attemptsNumber === 1) {
				// setDisabled(true);
				dispatch(authActions.disabledCodeAttempts(true));
				setTimeLeft(600);
				setError('code', {
					message: 'Слишком много неверных попыток.'
				});
			} else {
				setError('code', {
					message: `Код введен неверно. Осталось ${attemptsNumber - 1} попытки`
				});
			}
			setAttemptsNumber(prev => prev - 1);
		} else {
			setError('code', {
				message: `Неизвестная ошибка`
			});
		}
	}, [router, phone_number, code, setError, attemptsNumber, dispatch]);

	useEffect(() => {
		if (code?.length === code_len && !submitted) {
			handleSubmit(onSubmit)();
			setTimeout(() => setSubmitted(true), 0); // отложенный setState
		} else if (code?.length !== code_len && submitted) {
			setTimeout(() => setSubmitted(false), 0); // отложенный setState
		}
	}, [code, submitted, handleSubmit, onSubmit, code_len]);

	useEffect(() => {
		const timer = setInterval(() => {
			if (timeLeft > 0) {
				setTimeLeft(prev => prev - 1);
			} else {
				setTimeLeft(0);
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft]);

	useEffect(() => {
		if (attemptsNumber === 0 && disabled === true) {
			const timer = setTimeout(() => {
				dispatch(authActions.disabledCodeAttempts(false));
				setAttemptsNumber(5);
				setError('code', {
					message: ``
				});
			}, 25000); // 600000 - 10 минут
			return () => clearTimeout(timer);
		}
	}, [attemptsNumber, disabled, setError]);

	return (
		<div className={styles.loginCode}>
			<Logo style={{ fontSize: '70px' }} className={styles.logo} />
			<Link href='/login/phone' title='Назад' className={styles.linkBack}>
				<Back style={{ fontSize: '20px' }} className={styles.back} />
			</Link>
			<Text
				type={TextType.TITLE}
				tag={TitleTag.H1}
				fontSize={TextSize.XXL}
				fontWeight={FontWeight.SEMI_BOLD}
				textAlign={TextAlign.CENTER}
				className={styles.title}
			>
				Подтвердите вход
			</Text>
			<Text
				type={TextType.TEXT}
				tag={TextTag.P}
				fontSize={TextSize.L}
				fontWeight={FontWeight.REGULAR}
				textAlign={TextAlign.CENTER}
				color={TextColor.BLACK}
				className={styles.text}
			>
				Код подтверждения отправлен на следующий номер:
			</Text>
			<Text
				type={TextType.TEXT}
				tag={TextTag.P}
				fontSize={TextSize.L}
				fontWeight={FontWeight.MEDIUM}
				textAlign={TextAlign.CENTER}
				color={TextColor.BLACK}
				className={styles.boldText}
			>
				{phone_number}
			</Text>
			<div className={styles.infoWrapper}>
				<Text
					type={TextType.TEXT}
					tag={TextTag.P}
					fontSize={TextSize.L}
					fontWeight={FontWeight.MEDIUM}
					textAlign={TextAlign.CENTER}
					color={TextColor.BLACK}
					className={clsx(styles.infoText, styles.boldText)}
				>
					Введите код
				</Text>
				{/* <div className={styles.info}> */}
				<InfoCircle width={24} height={24} className={styles.infoIcon} />
				{/* <Tooltip classNameParent={styles.tooltip} /> */}
				{/* </div> */}
			</div>

			<Form<LoginCodeForm>
				methods={methods}
				onSubmit={onSubmit}
				className={styles.form}
				shouldSubmit={code?.length === code_len}
			>
				{formItem.map(item => (
					<FormAuthItem
						key={item.name}
						type={item.type}
						name={item.name}
						label={item.label}
						placeholder={item.placeholder}
						length={code_len}
						disabled={disabled}
						isRequired={item.isRequired}
					/>
				))}
			</Form>
			{timeLeft > 0 ? (
				<Text
					type={TextType.TEXT}
					tag={TextTag.P}
					fontSize={TextSize.L}
					fontWeight={FontWeight.MEDIUM}
					textAlign={TextAlign.CENTER}
					color={TextColor.GRAY}
					className={styles.timer}
				>
					Отправить новый код через 0:
					{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
				</Text>
			) : (
				<Button
					btnType={ButtonType.BUTTON}
					size={ButtonSize.S}
					fontSize={ButtonFontSize.M}
					disabled={false}
					theme={ButtonTheme.CLEAR}
					color={ButtonColor.PRIMARY}
					className={styles.newCode}
					onClick={() => {
						setTimeLeft(60);
					}}
				>
					Отправить новый код
				</Button>
			)}

			<Link href='/' className={styles.link}>
				Не приходит код?
			</Link>
		</div>
	);
};
