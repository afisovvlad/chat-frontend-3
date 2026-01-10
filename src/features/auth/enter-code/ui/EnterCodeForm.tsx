'use client';

import FormAuthItem from '@/entities/Auth/ui/FormAuthItem/FormAuthItem';
import { authActions } from '@/entities/Auth/model/authSlice';
import { useSetAuthStep } from '@/entities/Auth/model/useSetAuthStep';
import { formatPhone } from '@/shared/lib/formatPhone/formatPhone';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector/useAppSelector';
import { Button } from '@/shared/ui/Button';
import {
	ButtonColor,
	ButtonFontSize,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button/model/type';
import {
	FormItemNames,
	FormItemType
} from '@/shared/ui/Form/FormItems/model/types';
import { Form } from '@/shared/ui/Form/FormProvider/ui/Form';
import {
	FontWeight,
	Text,
	TextAlign,
	TextColor,
	TextSize,
	TextTag,
	TextType
} from '@/shared/ui/Text';
import { InfoCircle } from '@icons/index';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';

import styles from './EnterCodeForm.module.scss';
import { classNames } from '@/shared/lib/classNames/classNames';
import { LoginCodeForm } from '@/pages/LoginCode/types';

export const EnterCodeForm = () => {
	const [attemptsNumber, setAttemptsNumber] = useState(5);
	const [timeLeft, setTimeLeft] = useState(60);
	const [submitted, setSubmitted] = useState(false);
	const {
		phone_number,
		code_len,
		is_filled,
		isDisabledCodeAttempts: disabled
	} = useAppSelector(state => state.auth);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const setStep = useSetAuthStep();
	const methods = useForm<LoginCodeForm>();
	const { handleSubmit, setError } = methods;
	const code = useWatch({
		control: methods.control,
		name: 'code'
	});
	const formattedPhone = formatPhone(phone_number);

	const formItem = [
		{
			type: FormItemType.CODE,
			name: FormItemNames.CODE,
			label: '',
			isRequired: false
		}
	];

	console.log('is_filled', is_filled);

	const onSubmit = useCallback<SubmitHandler<LoginCodeForm>>(async () => {
		// отправляем код и телефон  на сервер
		const response = await fetch('/api/auth/setTokens', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ phone_number, code })
		});
		const res = await response.json();
		console.log('res in LoginCode', res);
		if (res.success) {
			if (res.is_filled) {
				router.push('/');
			} else {
				router.push('/registration');
			}
		} else if (res.errors) {
			if (attemptsNumber === 1) {
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
			<Text
				type={TextType.TEXT}
				tag={TextTag.P}
				fontSize={TextSize.L}
				fontWeight={FontWeight.REGULAR}
				textAlign={TextAlign.CENTER}
				color={TextColor.BLACK}
				className={styles.messageText}
			>
				Код подтверждения отправлен на следующий номер:
			</Text>
			<Text
				type={TextType.TEXT}
				tag={TextTag.P}
				fontSize={TextSize.L}
				fontWeight={FontWeight.MEDIUM}
				textAlign={TextAlign.CENTER}
				color={TextColor.BLACK}
				className={classNames(`${styles.phoneText} ${styles.boldText}`, {}, [])}
			>
				{formattedPhone}
			</Text>
			<div className={styles.infoWrapper}>
				<Text
					type={TextType.TEXT}
					tag={TextTag.P}
					fontSize={TextSize.L}
					fontWeight={FontWeight.MEDIUM}
					textAlign={TextAlign.CENTER}
					color={TextColor.BLACK}
					className={classNames(
						`${styles.infoText} ${styles.boldText}`,
						{},
						[]
					)}
				>
					Введите код
				</Text>
				<InfoCircle width={24} height={24} className={styles.infoIcon} />
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
						length={code_len}
						disabled={disabled}
						isRequired={item.isRequired}
						classNameParentInput={styles.codeInput}
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

			<Button
				onClick={() => {
					setStep('support');
				}}
				btnType={ButtonType.BUTTON}
				theme={ButtonTheme.CLEAR}
				color={ButtonColor.PRIMARY}
				fontSize={ButtonFontSize.M}
				className={styles.btn}
			>
				Не приходит код?
			</Button>
		</div>
	);
};
