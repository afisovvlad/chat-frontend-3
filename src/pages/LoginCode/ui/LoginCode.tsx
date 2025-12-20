'use client';

import FormAuthItem from '@/entities/Auth/ui/FormAuthItem/FormAuthItem';
import { Button } from '@/shared/ui/Button';
import {
	ButtonColor,
	ButtonFontSize,
	ButtonSize,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button/model/type';
import {
	FormAuthItemNames,
	FormAuthItemType
} from '@/shared/ui/Form/FormItems/model/types';
import { Form } from '@/shared/ui/Form/FormProvider/ui/Form';
import {
	FontWeight,
	Text,
	TextAlign,
	TextColor,
	TextSize,
	TextTag,
	TextType,
	TitleTag
} from '@/shared/ui/Text';
import Tooltip from '@/shared/ui/Tooltip/ui/Tooltip';
import { Back, InfoCircle, Logo } from '@icons/index';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { LoginCodeForm } from '../types';
import styles from './LoginCode.module.scss';

export const LoginCode = () => {
	const [isTooltipVisible, setIsTooltipVisible] = useState(false);
	const [timeLeft, setTimeLeft] = useState(60);
	const [submitted, setSubmitted] = useState(false);
	const router = useRouter();
	const length = 5; // получаем из state
	const methods = useForm<LoginCodeForm>();
	const { handleSubmit } = methods;
	const code = useWatch({
		control: methods.control,
		name: 'code'
	});

	const formItem = [
		{
			type: FormAuthItemType.CODE,
			name: FormAuthItemNames.CODE,
			label: '',
			placeholder: '11111',
			disabled: false,
			isRequired: false
		}
	];

	const onSubmit = useCallback<SubmitHandler<LoginCodeForm>>(
		data => {
			console.log(data);
			router.push('/');
			// получаем телефон из store
			// отправляем код и телефон  на сервер
		},
		[router]
	);

	useEffect(() => {
		if (code?.length === length && !submitted) {
			handleSubmit(onSubmit)();
			setTimeout(() => setSubmitted(true), 0); // отложенный setState
		}
	}, [code, submitted, handleSubmit, onSubmit, length]);

	useEffect(() => {
		const timer = setInterval(() => {
			if (timeLeft > 0) {
				setTimeLeft(prev => prev - 1);
			} else {
				setTimeLeft(0);
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft]);

	return (
		<div className={styles.loginCode}>
			<Logo style={{ fontSize: '70px' }} className={styles.logo} />
			<Link href='/login/phone' title='Назад' className={styles.linkBack}>
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
				Подтвердите вход
			</Text>
			<Text
				type={TextType.TEXT}
				tag={TextTag.P}
				fontSize={TextSize.L}
				fontWeight={FontWeight.REGULAR}
				textAlign={TextAlign.CENTER}
				color={TextColor.BLACK}
				className={styles.text}
			>
				Код подтверждения отправлен на следующий номер:
			</Text>
			<Text
				type={TextType.TEXT}
				tag={TextTag.P}
				fontSize={TextSize.L}
				fontWeight={FontWeight.MEDIUM}
				textAlign={TextAlign.CENTER}
				color={TextColor.BLACK}
				className={styles.boldText}
			>
				+7 962 888 54 36
			</Text>
			<div className={styles.infoWrapper}>
				<Text
					type={TextType.TEXT}
					tag={TextTag.P}
					fontSize={TextSize.L}
					fontWeight={FontWeight.MEDIUM}
					textAlign={TextAlign.CENTER}
					color={TextColor.BLACK}
					className={clsx(styles.infoText, styles.boldText)}
				>
					Введите код
				</Text>
				<div className={styles.info}>
					<InfoCircle width={24} height={24} className={styles.infoIcon} />
					<Tooltip classNameParent={styles.tooltip} />
				</div>
				{/* {isTooltipVisible && <Tooltip classNameParent={styles.tooltip} />} */}
			</div>

			<Form<LoginCodeForm>
				methods={methods}
				onSubmit={onSubmit}
				className={styles.form}
				shouldSubmit={code?.length === length}
			>
				{formItem.map(item => (
					<FormAuthItem
						key={item.name}
						type={item.type}
						name={item.name}
						label={item.label}
						placeholder={item.placeholder}
						length={length}
						disabled={item.disabled}
						isRequired={item.isRequired}
					/>
				))}
			</Form>
			{timeLeft > 0 ? (
				<Text
					type={TextType.TEXT}
					tag={TextTag.P}
					fontSize={TextSize.L}
					fontWeight={FontWeight.MEDIUM}
					textAlign={TextAlign.CENTER}
					color={TextColor.GRAY}
					className={styles.timer}
				>
					Отправить новый код через 0:
					{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
				</Text>
			) : (
				<Button
					btnType={ButtonType.BUTTON}
					size={ButtonSize.S}
					fontSize={ButtonFontSize.M}
					disabled={false}
					theme={ButtonTheme.CLEAR}
					color={ButtonColor.PRIMARY}
					className={styles.newCode}
					onClick={() => {
						setTimeLeft(60);
					}}
				>
					Отправить новый код
				</Button>
			)}

			<Link href='/' className={styles.link}>
				Не приходит код?
			</Link>
		</div>
	);
};
