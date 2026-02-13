'use client';

import { useEditProfileMutation } from '@/entities/Profile/api/editProfile.api';
import { FormAuthItem, useSetAuthStep } from '@/features/auth';
import { useDebounce } from '@/shared/lib/hooks/useDebounce/useDebounce';
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useSendNicknameMutation } from '../../api/registerApi';
import { registerFormItems } from '../../model/const/registerFormItems';
import { IRegister, RegisterFormType } from '../../model/types/types';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import styles from './RegisterForm.module.scss';

export function RegisterForm() {
	const [responseError, setResponseError] = useState<string | null>(null);
	const methods = useForm<RegisterFormType>();
	const { control, setError, clearErrors } = methods;
	const values = useWatch({ control: control });
	const name = values.name;
	const nickname = values.nickname;
	const [
		sendNickname,
		{ data: nicknameResponse, isLoading: nicknameLoading, error: nicknameError }
	] = useSendNicknameMutation();
	const handleSendNickname = useCallback(
		(value: string) => {
			setResponseError('');
			sendNickname(value);
		},
		[sendNickname]
	);
	const debouncedSendNickname = useDebounce(handleSendNickname, 400);
	const setStep = useSetAuthStep();
	const isNicknameFree =
		nicknameResponse?.messages === 'Этот nickname свободен';
	const [editProfile, { isLoading }] = useEditProfileMutation();
	const errorMessage = isLoading || nicknameLoading ? null : responseError;

	const disabledSubmit = useMemo(() => {
		if (!name || !nickname || !isNicknameFree) {
			return true;
		}

		if (name.length < 3 || nickname.length < 5) {
			return true;
		}

		return false;
	}, [name, nickname, isNicknameFree]);

	useEffect(() => {
		if (!nickname || nickname.length < 5) {
			return;
		}
		clearErrors(['nickname']);
		debouncedSendNickname(nickname);
	}, [nickname, debouncedSendNickname, clearErrors]);

	useEffect(() => {
		if (isNicknameFree) {
			clearErrors(['name', 'nickname']);
		}
	}, [isNicknameFree, clearErrors]);

	useEffect(() => {
		if (!nicknameError) {
			return;
		}

		if ('data' in nicknameError && nicknameError.data) {
			const errorData = nicknameError.data as Record<string, unknown>;

			Object.entries(errorData).forEach(([key, messages]) => {
				setError('nickname', {
					type: 'server',
					message: Array.isArray(messages)
						? messages.join(', ')
						: String(messages)
				});
			});
		}
	}, [nicknameError, setError]);

	const onSubmit: SubmitHandler<IRegister> = async data => {
		setResponseError('');

		const newData = {
			first_name: data.name,
			nickname: data.nickname
		};

		try {
			const result = await editProfile(newData).unwrap();

			if (result) {
				setStep('finish-register');
			}
		} catch (error: unknown) {
			const err = error as FetchBaseQueryError | SerializedError;

			if ('originalStatus' in err && err?.originalStatus === 404) {
				setResponseError('Запрашиваемая страница не найдена.');
			} else if ('status' in err && err.status === 500) {
				setResponseError('Ошибка соединения с сервером. Попробуйте позже.');
			} else if ('data' in err && err.data) {
				const errorData = err.data as Record<string, unknown>;
				Object.entries(errorData).forEach(([key, messages]) => {
					const message = Array.isArray(messages)
						? messages.join(', ')
						: String(messages);

					if (key === 'name') {
						setError('name', {
							type: 'server',
							message
						});
					} else if (key === 'detail' || key === 'nickname') {
						setError('nickname', {
							type: 'server',
							message
						});
					}
				});
			} else {
				setResponseError('Произошла непредвиденная ошибка. Попробуйте позже.');
			}
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
				{errorMessage && (
					<Text
						color={TextColor.ERROR}
						type={TextType.TEXT}
						fontSize={TextSize.M}
					>
						{errorMessage}
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
