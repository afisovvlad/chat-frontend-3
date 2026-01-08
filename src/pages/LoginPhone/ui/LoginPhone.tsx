'use client';

import FormAuthItem from '@/entities/Auth/ui/FormAuthItem/FormAuthItem';
import { fetchPhone } from '@/features/auth/model/slices/authSlice';
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
	TextAlign,
	TextColor,
	TextSize,
	TextType,
	TitleTag
} from '@/shared/ui/Text';
import { Back, Logo } from '@icons/index';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import styles from './LoginPhone.module.scss';

interface LoginPhoneForm {
	phone_number: string;
}

export const LoginPhone = () => {
	const { isDisabledCodeAttempts, phone_number: phone } = useAppSelector(
		state => state.auth
	);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const confirmBtnRef = useRef<HTMLButtonElement>(null);
	const router = useRouter();
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
		// сохраняем phone в store и отправляем телефон на сервер

		const formattedPhone = phone_number.replace(/[^\d+]/g, '');
		dispatch(fetchPhone(formattedPhone));

		router.push('/login/code');
		setIsModalOpen(false);
	};

	const onSubmit: SubmitHandler<LoginPhoneForm> = () => {
		setIsModalOpen(true);
	};

	return (
		<div className={styles.loginPhone}>
			<Logo style={{ fontSize: '70px' }} className={styles.logo} />
			<Link href='/login' title='Назад' className={styles.linkBack}>
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
				Вход/регистрация
			</Text>

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
		</div>
	);
};
