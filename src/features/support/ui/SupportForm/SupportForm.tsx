'use client';

import { FormSettingsItem } from '@/entities/FormSettingsItem';
import { useSendSupportMessageMutation } from '@/shared/api/support/supportApi';
import { Button } from '@/shared/ui/Button';
import {
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button/model/type';
import { ErrorComponent } from '@/shared/ui/ErrorComponent';
import { Form } from '@/shared/ui/Form';
import {
	FormItemNames,
	FormItemType
} from '@/shared/ui/Form/FormItems/model/types';
import { Loader } from '@/shared/ui/Loader';
import { SuccessBlock } from '@/shared/ui/SuccessBlock';
import { Text } from '@/shared/ui/Text';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import styles from './SupportForm.module.scss';

interface SupportForm {
	email: string;
	message: string;
}

export function SupportForm({ parentClass }: { parentClass?: string }) {
	const [sendSupportMessage, { isLoading, isError, isSuccess }] =
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
			await sendSupportMessage({
				email: data.email,
				text: data.message
			}).unwrap();
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div className={clsx(styles.support, parentClass)}>
			{isError ? (
				<ErrorComponent>
					При отправке произошла ошибка. Попробуйте позже
				</ErrorComponent>
			) : isSuccess ? (
				<SuccessBlock
					marginTop='341px'
					title={' Обращение отправлено!'}
					text={
						'В ближайшее время Вы получите ответ на электронную почту, указанную в обращении'
					}
				/>
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
						{isLoading ? <Loader width='22px' height='22px' /> : 'Отправить'}
					</Button>
				</Form>
			)}
		</div>
	);
}
