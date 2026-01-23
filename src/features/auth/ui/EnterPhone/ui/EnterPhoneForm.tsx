'use client';

import { FormAuthItem, useSetAuthStep } from '@/features/auth';
import { formatPhone } from '@/shared/lib/formatPhone/formatPhone';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector/useAppSelector';
import {
	Button,
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button';
import { Form } from '@/shared/ui/FormComponent/Form/ui/Form';
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
import { useSendPhoneMutation } from '../model/api/authApi';
import { formItems } from '../model/const/formItems';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery'; // ваш хук
import styles from './EnterPhoneForm.module.scss';

interface LoginPhoneForm {
	phone_number: string;
}

export const EnterPhoneForm = ({
	containerRef
}: {
	containerRef?: React.RefObject<HTMLDivElement | null>;
}) => {
	const { isDisabledCodeAttempts, phone_number: phone } = useAppSelector(
		state => state.auth
	);
	const [sendPhone] = useSendPhoneMutation();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const confirmBtnRef = useRef<HTMLButtonElement>(null);
	const setStep = useSetAuthStep();
	const formattedPhone = formatPhone(phone);

	const isMobile = useMediaQuery();
	const overlayMode = isMobile ? 'full' : 'container';
	const borderRadius = isMobile ? '8px' : '16px';
	const methods = useForm<LoginPhoneForm>({
		defaultValues: {
			phone_number: formattedPhone || ''
		}
	});
	const { setFocus } = methods;
	const phone_number = useWatch({
		control: methods.control,
		name: 'phone_number'
	});
	const disabled = isDisabledCodeAttempts || phone_number.length !== 16;

	useEffect(() => {
		setFocus('phone_number');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (isModalOpen && confirmBtnRef.current) {
			confirmBtnRef?.current.focus();
		}
	}, [isModalOpen]);

	const onModalClose = () => {
		setIsModalOpen(false);
	};
	const onConfirm = async () => {
		const formattedPhone = phone_number.replace(/[^\d+]/g, '');
		await sendPhone({ phone_number: formattedPhone });
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
				{formItems.map(item => (
					<FormAuthItem
						key={item.name}
						type={item.type}
						name={item.name}
						label={item.label}
						placeholder={item.placeholder}
						autoComplete={undefined}
						disabled={item.disabled}
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
				overlayMode={overlayMode}
				containerRef={containerRef}
				borderRadius={borderRadius}
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
