'use client';

import { useEditProfileMutation } from '@/entities/Profile/api/editProfile.api';
import { FormAuthItem, useSetAuthStep } from '@/features/auth';
import {
	Button,
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button';
import { Form } from '@/shared/ui/FormComponent';
import { Loader } from '@/shared/ui/Loader';
import {
	FontWeight,
	Text,
	TextColor,
	TextSize,
	TextType
} from '@/shared/ui/Text';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { RegisterForm } from '../..';
import { useLazySendNicknameQuery } from '../../api/registerApi';
import { registerFormItems } from '../../model/const/registerFormItems';
import { IRegister } from '../../model/types/types';
import styles from './RegisterForm.module.scss';

export function RegisterForm() {
	const [responseError, setResponseError] = useState('');
	const methods = useForm<RegisterForm>();
	const { control, setError, clearErrors } = methods;
	const values = useWatch({ control: control });
	const name = values.name;
	const nickname = values.nickname;
	const [sendNickname, { data: nicknameResponse, error }] =
		useLazySendNicknameQuery();
	const setStep = useSetAuthStep();
	const debounceRef = useRef<NodeJS.Timeout>(null);
	const isNicknameFree =
		nicknameResponse?.messages === 'Этот nickname свободен';
	const [editProfile, { isLoading, data }] = useEditProfileMutation();

	const disabledSubmit = useMemo(() => {
		if (!name || !nickname || !isNicknameFree) {
			return true;
		}

		if (name.length < 3 || nickname.length < 5) {
			return true;
		}

		return false;
	}, [name, nickname, isNicknameFree]);

	// console.log('error', error);
	// console.log(error && (error.originalStatus === 404 || error.status === 500));
	// console.log(nicknameResponse, 'nicknameResponse');
	// console.log(responseError, 'responseError');

	useEffect(() => {
		if (!nickname || nickname.length < 5) {
			return;
		}

		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = setTimeout(() => {
			sendNickname(nickname);
		}, 500);

		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
		};
	}, [nickname, sendNickname]);

	useEffect(() => {
		setResponseError('');

		if (isNicknameFree) {
			clearErrors(['name', 'nickname']);
		} else if (
			error &&
			(error.originalStatus === 404 || error.status === 500)
		) {
			console.log('да есть ошибка');
			setResponseError('Ошибка соединения с сервером. Попробуйте позже.');
		} else if (error && error.data) {
			Object.entries(error.data).forEach(([key, messages]) => {
				const message = Array.isArray(messages)
					? messages.join(', ')
					: messages;
				console.log(key, message, 'key message');
				if (key === 'nickname' || key === 'name') {
					setError(key as keyof IRegister, { type: 'server', message });
				} else {
					setResponseError(message);
				}
			});
		}
	}, [setStep, setError, clearErrors, error, isNicknameFree]);

	const onSubmit: SubmitHandler<IRegister> = async data => {
		console.log(data);

		const newData = {
			first_name: data.name,
			nickname: data.nickname
		};

		try {
			const result = await editProfile(newData).unwrap();
			console.log('result', result);

			if (result) {
				setStep('finish-register');
			} else {
				const error = result.error;
				if (
					error &&
					typeof error === 'object' &&
					'status' in error &&
					'data' in error
				) {
					const serverErrors = error.data as Record<string, string[]>;

					Object.entries(serverErrors).forEach(([field, messages]) => {
						setError(field as keyof IRegister, {
							type: 'server',
							message: messages.join(' ')
						});
					});
				} else {
					setResponseError('Произошла непредвиденная ошибка');
				}
			}
		} catch (e) {
			setResponseError('Произошла непредвиденная ошибка');
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
				{responseError && (
					<Text
						color={TextColor.ERROR}
						type={TextType.TEXT}
						fontSize={TextSize.M}
					>
						{responseError}
					</Text>
				)}

				<Button
					btnType={ButtonType.SUBMIT}
					disabled={disabledSubmit}
					theme={ButtonTheme.BACKGROUND}
					color={ButtonColor.PRIMARY}
				>
					{isLoading ? (
						<Loader width='22px' height='22px' />
					) : (
						'Зарегистрироваться'
					)}
				</Button>
			</Form>
		</>
	);
}
