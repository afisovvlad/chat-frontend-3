'use client';

import { FormSettingsItem } from '@/entities/FormSettingsItem';
import { useSendSupportMessageMutation } from '@/shared/api/support/supportApi';
import { Button } from '@/shared/ui/Button';
import {
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button/model/type';
import { Form } from '@/shared/ui/Form';
import {
	FormItemNames,
	FormItemType
} from '@/shared/ui/Form/FormItems/model/types';
import { SuccessBlock } from '@/shared/ui/SuccessBlock';
import {
	FontWeight,
	Text,
	TextAlign,
	TextColor,
	TextSize,
	TextTag,
	TextType
} from '@/shared/ui/Text';
import Link from 'next/link';
import { useEffect } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import styles from './SupportForm.module.scss';

interface SupportForm {
	email: string;
	message: string;
}

export function SupportForm() {
	const [sendSupportMessage, { isLoading, isError, error, isSuccess, reset }] =
		useSendSupportMessageMutation();
	const methods = useForm<SupportForm>();

	const email = useWatch({
		control: methods.control,
		name: 'email'
	});
	const message = useWatch({
		control: methods.control,
		name: 'message'
	});
	const disabled = !(email?.length > 4 && message?.length > 10);

	const formItem = [
		{
			type: FormItemType.EMAIL,
			name: FormItemNames.EMAIL,
			label: 'Укажите Ваш e-mail',
			placeholder: 'e-mail',
			rules: {
				required: 'Заполните это поле',
				pattern: {
					value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
					message: 'Некорректный e-mail'
				}
			}
		},
		{
			type: FormItemType.TEXTAREA,
			name: FormItemNames.MESSAGE,
			label: 'Опишите Вашу проблему'
		}
	];

	useEffect(() => {
		methods.setFocus('email');
	}, [methods]);

	const onSubmit: SubmitHandler<SupportForm> = async data => {
		try {
			const response = await sendSupportMessage({
				email: data.email,
				text: data.message
			}).unwrap();
			console.log(response);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div className={styles.support}>
			{isError ? (
				<div className={styles.errorBlock}>
					<Text
						type={TextType.TEXT}
						tag={TextTag.P}
						fontSize={TextSize.L}
						fontWeight={FontWeight.REGULAR}
						textAlign={TextAlign.CENTER}
						color={TextColor.ERROR}
						className={styles.errorText}
					>
						При отправке произошла ошибка. Попробуйте позже
					</Text>
				</div>
			) : isSuccess ? (
				<SuccessBlock marginTop='341px' />
			) : (
				<Form<SupportForm>
					methods={methods}
					onSubmit={onSubmit}
					className={styles.form}
				>
					{formItem.map(item => (
						<FormSettingsItem
							key={item.name}
							type={item.type}
							name={item.name}
							label={item.label}
							placeholder={item.placeholder}
							autoComplete={undefined}
							rules={item.rules || undefined}
							classNameParentInput={styles.formItem}
						/>
					))}
					<Text className={styles.faqText}>
						Ознакомьтесь со 
						<Link href='/support/faq' className={styles.faqLink}>
							списком известных проблем и их решениями.
						</Link>
					</Text>
					<Button
						btnType={ButtonType.SUBMIT}
						disabled={disabled}
						theme={ButtonTheme.BACKGROUND}
						color={ButtonColor.PRIMARY}
					>
						{isLoading ? 'Отправка...' : 'Отправить'}
					</Button>
				</Form>
			)}
		</div>
	);
}
