'use client';

import { FormAuthItem, useSetAuthStep } from '@/features/auth';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector/useAppSelector';
import { Button } from '@/shared/ui/Button';
import { ButtonColor, ButtonTheme } from '@/shared/ui/Button/model/type';
import { Form } from '@/shared/ui/FormComponent/Form/ui/Form';
import { Modal } from '@/shared/ui/Modal';
import {
	FontWeight,
	Text,
	TextColor,
	TextSize,
	TextType
} from '@/shared/ui/Text';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import {
	handleErrorResponse,
	handleSuccessResponse,
	LoginCodeForm,
	submitCodeRequest
	// useSuccessResponse
} from '../..';
import { codeFormItems } from '../../model/const/codeFormItems';
import styles from './EnterCodeForm.module.scss';

interface EnterCodeFormProps {
	setTime: React.Dispatch<React.SetStateAction<number>>;
	phone_number?: string;
	code_len?: number;
	is_filled: boolean;
	disabled: boolean;
	finishedTime: boolean;
	// setAttemptCounter: React.Dispatch<React.SetStateAction<number>>;
}

export const EnterCodeForm = ({
	setTime,
	phone_number,
	code_len,
	// is_filled,
	disabled,
	finishedTime
	// setAttemptCounter
}: EnterCodeFormProps) => {
	const [attemptsNumber, setAttemptsNumber] = useState(5);
	// const [attemptCounter, setAttemptCounter] = useState(0);
	const { attemptCounter } = useAppSelector(state => state.auth);
	const [isModalOpen, setIsModalOpen] = useState(attemptCounter > 0);
	const setStep = useSetAuthStep();
	const dispatch = useAppDispatch();
	const router = useRouter();
	const methods = useForm<LoginCodeForm>();
	const { handleSubmit, setError, clearErrors, reset } = methods;
	const code = useWatch({
		control: methods.control,
		name: 'code'
	});
	// const isModalOpen = attemptCounter > 0;
	const modalTitle = attemptCounter > 1 ? 'Лимит исчерпан' : '';
	const modalText = attemptCounter > 1 ? 'Попробуйте позднее' : '';
	const submittedRef = useRef(false);
	console.log('attemptsNumber in EnterCodeForm', attemptsNumber);
	console.log('attemptCounter in EnterCodeForm', attemptCounter);
	// console.log('is_filled', is_filled);

	const onSubmit = useCallback<SubmitHandler<LoginCodeForm>>(
		async ({ code }) => {
			try {
				if (!phone_number) {
					return;
				}
				const res = await submitCodeRequest({ phone_number, code });

				console.log(res);
				console.log(res.errors);

				if (res?.success) {
					handleSuccessResponse(
						res.is_filled,
						setStep,
						router,
						dispatch
						// setAttemptCounter
					);
				} else if (!!res.errors) {
					await handleErrorResponse(
						attemptsNumber,
						attemptCounter,
						setAttemptsNumber,
						// setAttemptCounter,
						setTime,
						dispatch,
						setError
					);
				} else {
					setError('code', {
						message: 'Произошла непредвиденная ошибка'
					});
				}
			} catch (_) {
				setError('code', {
					message: 'Ошибка сети. Попробуйте позже.'
				});
			}
		},
		[
			phone_number,
			setStep,
			setTime,
			router,
			setError,
			attemptsNumber,
			dispatch,
			// setAttemptCounter,
			attemptCounter
		]
	);

	useEffect(() => {
		if (attemptCounter > 1) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setIsModalOpen(true);
		}
	}, [attemptCounter]);

	useEffect(() => {
		if (finishedTime) {
			clearErrors('code');
			reset({});
		}
	}, [finishedTime, setError]);

	useEffect(() => {
		if (!code_len) {
			return;
		}

		if (code?.length === code_len && !submittedRef.current) {
			submittedRef.current = true;
			handleSubmit(onSubmit)();
		}

		if (code?.length !== code_len) {
			submittedRef.current = false;
		}
	}, [code, handleSubmit, onSubmit, code_len]);

	// useEffect(() => {
	// 	if (attemptCounter > 0) {
	// 		setModalText('Лимит исчерпан');
	// 		setModalText('Попробуйте позднее');
	// 	}
	// }, [attemptCounter]);

	const onModalClose = () => {
		setIsModalOpen(false);
		// setAttemptCounter(0);
	};

	const handleClickSupport = () => {
		setStep('support');
		// setAttemptCounter(0);
	};

	return (
		<>
			<Form<LoginCodeForm>
				methods={methods}
				onSubmit={onSubmit}
				className={styles.form}
			>
				{codeFormItems.map(item => (
					<FormAuthItem
						key={item.name}
						type={item.type}
						name={item.name}
						label={item.label}
						length={code_len}
						disabled={disabled}
						classNameParentInput={styles.codeInput}
					/>
				))}
			</Form>

			<Modal
				size='wide'
				isOpen={isModalOpen}
				onClose={onModalClose}
				className={styles.modal}
			>
				<Text
					type={TextType.TITLE}
					fontSize={TextSize.XL}
					fontWeight={FontWeight.MEDIUM}
					color={TextColor.BLACK}
					className={styles.modalTitle}
				>
					{modalTitle}
				</Text>
				<Text
					type={TextType.TEXT}
					fontSize={TextSize.L}
					fontWeight={FontWeight.REGULAR}
					color={TextColor.GRAY}
					className={styles.modalText}
				>
					{modalText}
				</Text>

				<Modal.Actions className={styles.actions}>
					<Button
						color={ButtonColor.PRIMARY}
						onClick={handleClickSupport}
						className={styles.btn}
						// btnRef={confirmBtnRef}
					>
						Обратиться в поддержку
					</Button>

					<Button
						color={ButtonColor.PRIMARY}
						onClick={onModalClose}
						className={styles.btn}
						theme={ButtonTheme.OUTLINE}
					>
						Назад
					</Button>
				</Modal.Actions>
			</Modal>
		</>
	);
};

// const onSubmit = useCallback<SubmitHandler<LoginCodeForm>>(
// 	async ({ code }) => {
// 		const response = await fetch('/api/auth/setTokens', {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json'
// 			},
// 			body: JSON.stringify({ phone_number, code })
// 		});
// 		const res = await response.json();

// 		if (res.success) {
// 			if (res.is_filled) {
// 				setStep('greeting');
// 				router.push('/');
// 			} else {
// 			  setStep('register');
// 			}
// 		} else if (res.errors) {
// 			if (attemptsNumber === 1) {
// 				dispatch(authActions.disabledCodeAttempts(true));
// 				 setTimeout(() => {
// 					dispatch(authActions.disabledCodeAttempts(false));
// 				}, minutesBlock * 1000);
// 				setTime(minutesBlock); // 2 минут
// 				setError('code', {
// 					message: res.errors.message || 'Слишком много неверных попыток.'
// 				});
// 			} else {
// 				setAttemptsNumber(prev => prev - 1);
// 				setError('code', {
// 					message:
// 						res.errors.message ||
// 						`Код введен неверно. Осталось ${attemptsNumber - 1} попытки`
// 				});
// 			}
// 		} else {
// 			setError('code', {
// 				message: `Неизвестная ошибка`
// 			});
// 		}
// 	},
// 	[phone_number, setStep, setTime, router, setError, attemptsNumber, dispatch]
// );

// const onSubmit = useCallback<SubmitHandler<LoginCodeForm>>(
// 	async ({ code }) => {
// 		try {
// 			const res = await submitCode({ phone_number, code });
// 			console.log('res in LoginCode', res);

// 			if (res.success) {
// 				setStep(res.is_filled ? 'greeting' : 'register');
// 				router.push('/');
// 				return;
// 			}

// 			if (res.errors) {
// 				console.log(res.errors, 'res.errors');
// 				console.log('attemptsNumber', attemptsNumber);

// 				if (attemptsNumber === 1) {
// 					dispatch(authActions.disabledCodeAttempts(true));
// 					setTimeout(() => {
// 						dispatch(authActions.disabledCodeAttempts(false));
// 					}, minutesBlock * 1000);
// 					setTime(minutesBlock); // 10 минут
// 					setError('code', {
// 						message: res.errors.message || 'Слишком много неверных попыток.'
// 					});
// 				} else if (attemptsNumber > 1) {
// 					setAttemptsNumber(prev => prev - 1);
// 					setError('code', {
// 						message:
// 							res.errors.message ||
// 							`Код введен неверно. Осталось попыток: ${attemptsNumber - 1} `
// 					});
// 				} else {
// 					dispatch(authActions.disabledCodeAttempts(true));
// 					setTimeout(() => {
// 						dispatch(authActions.disabledCodeAttempts(false));
// 					}, res.errors?.block_duration_seconds * 1000);
// 					setTime(res.errors?.block_duration_seconds); // цифра с сервера

// 					setError('code', {
// 						message: res.errors.message || 'Слишком много неверных попыток'
// 					});
// 				}
// 				// handleAttemptsError(
// 				// 	res.errors.message,
// 				// 	attemptsNumber === 1
// 				// 		? minutesBlock
// 				// 		: attemptsNumber < 1
// 				// 			? res.errors?.block_duration_seconds
// 				// 			: secondsBlock
// 				// );
// 				startUnblockTimer(
// 					attemptsNumber === 1
// 						? minutesBlock
// 						: attemptsNumber < 1
// 							? res.errors?.block_duration_seconds
// 							: secondsBlock
// 				);
// 				return;
// 			}

// 			setError('code', { message: 'Неизвестная ошибка' });
// 		} catch (e) {
// 			setError('code', { message: 'Ошибка сети. Попробуйте позже' });
// 		}
// 	},
// 	// async ({ code }) => {
// 	// 	try {
// 	// 		const response = await fetch('/api/auth/setTokens', {
// 	// 			method: 'POST',
// 	// 			headers: {
// 	// 				'Content-Type': 'application/json'
// 	// 			},
// 	// 			body: JSON.stringify({ phone_number, code })
// 	// 		});
// 	// 		const res = await response.json();
// 	// 		console.log('res in LoginCode', res);
// 	// 		if (res.success) {
// 	// 			if (res.is_filled) {
// 	// 				setStep('greeting');
// 	// 				router.push('/');
// 	// 			} else {
// 	// 				router.push('/'); // поменять на setStep('register'), когда сделаю регистрацию
// 	// 				// setStep('register');
// 	// 			}
// 	// 		} else if (res.errors) {
// 	// 			console.log('res.errors.message');
// 	// 			console.log(res.errors);
// 	// 			if (attemptsNumber === 1) {
// 	// 				dispatch(authActions.disabledCodeAttempts(true));
// 	// 				const timer = setTimeout(
// 	// 					() => {
// 	// 						dispatch(authActions.disabledCodeAttempts(false));
// 	// 					},
// 	// 					2 * 60 * 1000
// 	// 				);
// 	// 				setTime(120); // 2 минут
// 	// 				// setTime(600); // 10 минут
// 	// 				setError('code', {
// 	// 					message: res.errors || 'Слишком много неверных попыток.'
// 	// 				});
// 	// 			} else {
// 	// 				setAttemptsNumber(prev => prev - 1);
// 	// 				setError('code', {
// 	// 					message:
// 	// 						res.errors ||
// 	// 						`Код введен неверно. Осталось ${attemptsNumber - 1} попытки`
// 	// 				});
// 	// 			}
// 	// 		}
// 	// 	} catch (_) {
// 	// 		setError('code', {
// 	// 			message: `Неизвестная ошибка`
// 	// 		});
// 	// 	}
// 	// },
// 	[
// 		phone_number,
// 		setStep,
// 		setError,
// 		router,
// 		startUnblockTimer,
// 		attemptsNumber,
// 		dispatch,
// 		setTime
// 	]
// );
