'use client';

import { FormSettingsItem } from '@/entities/Settings';

import { classNames } from '@/shared/lib/classNames/classNames';
import {
	Button,
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button';
import { ErrorComponent } from '@/shared/ui/ErrorComponent';
import { Form } from '@/shared/ui/Form';
import { Loader } from '@/shared/ui/Loader';
import { SuccessBlock } from '@/shared/ui/SuccessBlock';
import { Text } from '@/shared/ui/Text';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useSendSupportMessageMutation } from '../../api/supportApi';
import { formItems } from '../../model/lib/formItems';
import { ISupportForm } from '../../model/types';
import styles from './SupportForm.module.scss';

// interface SupportForm {
// 	email: string;
// 	message: string;
// }

export function SupportForm({ parentClass }: { parentClass?: string }) {
	const [responseError, setResponseError] = useState('');
	const [sendSupportMessage, { isLoading, isError, isSuccess }] =
		useSendSupportMessageMutation();
	const methods = useForm<ISupportForm>({
		mode: 'onChange'
	});
	const { setFocus } = methods;

	const email = useWatch({
		control: methods.control,
		name: 'email'
	});
	const message = useWatch({
		control: methods.control,
		name: 'message'
	});
	const disabled = !(email?.length > 4 && message?.length > 10);

	// console.log('Support Form');

	useEffect(() => {
		setFocus('email');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit: SubmitHandler<ISupportForm> = async data => {
		try {
			await sendSupportMessage({
				email: data.email,
				text: data.message
			}).unwrap();
		} catch (e) {
			setResponseError('При отправке произошла ошибка. Попробуйте позже');
		}
	};

	return (
		<div className={classNames(styles.support, {}, [parentClass])}>
			{isError ? (
				<ErrorComponent>{responseError}</ErrorComponent>
			) : isSuccess ? (
				<>
					<SuccessBlock
						marginTop='341px'
						title={' Обращение отправлено!'}
						text={
							'В ближайшее время Вы получите ответ на электронную почту, указанную в обращении'
						}
					/>
					<Link href='/' className={styles.homeLink}>
						На главную
					</Link>
				</>
			) : (
				<Form<ISupportForm>
					methods={methods}
					onSubmit={onSubmit}
					className={styles.form}
				>
					{formItems.map(item => (
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
