'use client';

import { fetchPhone } from '@/entities/Auth/model/authSlice';
import { useSetAuthStep } from '@/entities/Auth/model/useSetAuthStep';
import { FormAuthItem } from '@/entities/Auth';
import { formatPhone } from '@/shared/lib/formatPhone/formatPhone';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector/useAppSelector';
import {
	Button,
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button';
import {
	FormItemNames,
	FormItemType
} from '@/shared/ui/Form/FormItems/model/types';
import { Form } from '@/shared/ui/Form/FormProvider/ui/Form';
import { Modal } from '@/shared/ui/Modal';
import {
	FontWeight,
	Text,
	TextColor,
	TextSize,
	TextType
} from '@/shared/ui/Text';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import styles from './EnterPhoneForm.module.scss';
import { useSendPhoneMutation } from '../model/api/authApi';

interface LoginPhoneForm {
	phone_number: string;
}

export const EnterPhoneForm = () => {
	const { isDisabledCodeAttempts, phone_number: phone } = useAppSelector(
		state => state.auth
	);
	const [sendPhone, { isLoading }] = useSendPhoneMutation();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const confirmBtnRef = useRef<HTMLButtonElement>(null);
	const setStep = useSetAuthStep();
	const formattedPhone = formatPhone(phone);

	const methods = useForm<LoginPhoneForm>({
		defaultValues: {
			phone_number: formattedPhone || ''
		}
	});
	const dispatch = useAppDispatch();
	const phone_number = useWatch({
		control: methods.control,
		name: 'phone_number'
	});
	const disabled = isDisabledCodeAttempts || phone_number.length !== 16;
	console.log(phone_number); // показывается при каждом нажатии клавиши
	useEffect(() => {
		methods.setFocus('phone_number');
	}, [methods]);

	useEffect(() => {
		if (isModalOpen && confirmBtnRef.current) {
			confirmBtnRef?.current.focus();
		}
	}, [isModalOpen]);

	const formItem = [
		{
			type: FormItemType.TEL,
			name: FormItemNames.PHONE_NUMBER,
			label: 'Введите номер телефона',
			placeholder: '+ 7 900 000 00 00',
			disabled: false,
			isRequired: false
		}
	];

	const onModalClose = () => {
		setIsModalOpen(false);
	};
	const onConfirm = () => {
		// сохраняем phone и step в store и отправляем телефон на сервер

		const formattedPhone = phone_number.replace(/[^\d+]/g, '');
		sendPhone({ phone_number: formattedPhone });
		// dispatch(fetchPhone(formattedPhone));
		setStep('code');
		setIsModalOpen(false);
	};

	const onSubmit: SubmitHandler<LoginPhoneForm> = () => {
		setIsModalOpen(true);
	};

	return (
		<>
			<Form<LoginPhoneForm>
				methods={methods}
				onSubmit={onSubmit}
				className={styles.form}
			>
				{formItem.map(item => (
					<FormAuthItem
						key={item.name}
						type={item.type}
						name={item.name}
						label={item.label}
						placeholder={item.placeholder}
						autoComplete={undefined}
						disabled={item.disabled}
						isRequired={item.isRequired}
						rules={undefined}
						classNameParentInput={styles.formItem}
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

			<Modal
				size='wide'
				isOpen={isModalOpen}
				onClose={onModalClose}
				className={styles.modal}
			>
				<Text
					type={TextType.TEXT}
					fontSize={TextSize.L}
					fontWeight={FontWeight.MEDIUM}
					color={TextColor.BLACK}
					className={styles.modalPhone}
				>
					{phone_number}
				</Text>
				<Text
					type={TextType.TEXT}
					fontSize={TextSize.M}
					fontWeight={FontWeight.REGULAR}
					color={TextColor.GRAY}
					className={styles.modalText}
				>
					Номер телефона указан верно?
				</Text>

				<Modal.Actions className={styles.actions}>
					<Button
						color={ButtonColor.PRIMARY}
						onClick={onModalClose}
						className={styles.btnCancel}
						theme={ButtonTheme.CLEAR}
					>
						Изменить
					</Button>
					<Button
						color={ButtonColor.PRIMARY}
						onClick={onConfirm}
						className={styles.btnConfirm}
						btnRef={confirmBtnRef}
					>
						Верно
					</Button>
				</Modal.Actions>
			</Modal>
		</>
	);
};
