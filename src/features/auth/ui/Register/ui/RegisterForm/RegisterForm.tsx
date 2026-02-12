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
import { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useSendNicknameMutation } from '../../api/registerApi';
import { registerFormItems } from '../../model/const/registerFormItems';
import { IRegister, RegisterFormType } from '../../model/types/types';
import styles from './RegisterForm.module.scss';

export function RegisterForm() {
	const [responseError, setResponseError] = useState('');
	const methods = useForm<RegisterFormType>();
	const { control, setError, clearErrors } = methods;
	const values = useWatch({ control: control });
	const name = values.name;
	const nickname = values.nickname;
	const [sendNickname, { data: nicknameResponse, error: nicknameError }] =
		useSendNicknameMutation();
	const debouncedSendNickname = useDebounce(sendNickname, 400);
	const setStep = useSetAuthStep();
	const isNicknameFree =
		nicknameResponse?.messages === 'Этот nickname свободен';
	const [
		editProfile,
		{ data: registerResult, isLoading, error: registerError }
	] = useEditProfileMutation();

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
		if (!nicknameError?.data) {
			return;
		}

		Object.entries(nicknameError.data).forEach(([key, messages]) => {
			setError('nickname', {
				type: 'server',
				message: Array.isArray(messages) ? messages.join(', ') : messages
			});
		});
	}, [nicknameError, setError]);

	const onSubmit: SubmitHandler<IRegister> = async data => {
		setResponseError('');

		const newData = {
			first_name: data.name,
			nickname: data.nickname
		};

		try {
			await editProfile(newData);

			if (registerResult) {
				setStep('finish-register');
			} else if (registerError && registerError.data) {
				Object.entries(registerError.data).forEach(([key, messages]) => {
					const message = Array.isArray(messages)
						? messages.join(', ')
						: messages;

					if (key === 'name') {
						setError(key as keyof IRegister, { type: 'server', message });
					} else if (key === 'detail' || key === 'nickname') {
						setError('nickname', { type: 'server', message });
					}
				});
			}
		} catch (_) {
			setResponseError('Ошибка соединения с сервером. Попробуйте позже.');
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
