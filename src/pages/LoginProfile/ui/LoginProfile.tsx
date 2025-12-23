'use client';
import FormAuthItem from '@/entities/Auth/ui/FormAuthItem/FormAuthItem';
import { Button, ButtonType } from '@/shared/ui/Button';
import { ButtonColor, ButtonTheme } from '@/shared/ui/Button/model/type';
import { Form } from '@/shared/ui/Form';
import {
	FormAuthItemAutocomplete,
	FormAuthItemNames,
	FormAuthItemType
} from '@/shared/ui/Form/FormItems/model/types';
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
import { Back, Logo } from '@icons/index';
import Link from 'next/link';
import { useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { LoginProfileForm } from '../types';
import styles from './LoginProfile.module.scss';

export function LoginProfile() {
	const [disabled, setDisabled] = useState(true);
	const methods = useForm<LoginProfileForm>();
	const { setError } = methods;
	const name = useWatch({
		control: methods.control,
		name: 'name'
	});

	const formItem = [
		{
			type: FormAuthItemType.TEXT,
			name: FormAuthItemNames.NAME,
			label: 'Введите имя',
			placeholder: '',
			autocomplete: FormAuthItemAutocomplete.NAME,
			disabled: false,
			isRequired: false,
			rules: {
				required: 'Заполните это поле',
				minLength: {
					value: 3,
					message: 'Минимум 3 буквы'
				},
				pattern: {
					value: /^[a-zA-Zа-яёА-ЯЁ]+$/,
					message: 'Допускаются только буквы'
				}
			}
		},
		{
			type: FormAuthItemType.TEXT,
			name: FormAuthItemNames.NICKNAME,
			label: 'Введите никнейм',
			placeholder: '',
			autocomplete: FormAuthItemAutocomplete.NICKNAME,
			disabled: false,
			isRequired: false,
			rules: {
				required: 'Заполните это поле',
				minLength: {
					value: 3,
					message: 'Минимум 3 буквы'
				}
			}
		}
	];

	const onSubmit: SubmitHandler<LoginProfileForm> = data => {
		console.log(data);
	};

	return (
		<div className={styles.loginProfile}>
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
				Личная информация
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
				Пожалуйста, заполните данные
			</Text>

			<Form<LoginProfileForm>
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
					Зарегистрироваться
				</Button>
			</Form>

			<Text
				type={TextType.TEXT}
				tag={TextTag.P}
				fontSize={TextSize.S}
				fontWeight={FontWeight.REGULAR}
				// textAlign={TextAlign.CENTER}
				color={TextColor.GRAY}
				className={styles.text}
			>
				Нажимая на «Зарегистрироваться», вы соглашаетесь с 
				<Link href='/user-agreement'>Пользовательским соглашением</Link>
			</Text>
		</div>
	);
}
