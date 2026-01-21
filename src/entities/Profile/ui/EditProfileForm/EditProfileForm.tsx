'use client';

import { useEditProfileMutation } from '@/entities/Profile/api/editProfile.api';
import { FormSettingsItem } from '@/entities/Settings';
import { classNames } from '@/shared/lib/classNames/classNames';
import { convertDateToNumber } from '@/shared/lib/convertDateToNumber/convertDateToNumber';
import { convertNumberToDate } from '@/shared/lib/convertNumberToDate/convertNumberToDate';
import {
	Button,
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button';
import { ErrorComponent } from '@/shared/ui/ErrorComponent';
import { Form, SelectItem } from '@/shared/ui/FormComponent';
import { DateOption } from '@/shared/ui/FormComponent/FormItems/model/selectTypes';
import {
	FormItemNames,
	FormItemType
} from '@/shared/ui/FormComponent/FormItems/model/types';
import { Loader } from '@/shared/ui/Loader';
import { SuccessBlock } from '@/shared/ui/SuccessBlock';
import {
	getDaysInMonth,
	getDaysOptions,
	getMonthsOptions,
	getYearsOptions
} from '@/shared/utils/dateOptions';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ProfileSchema } from '../..';
import { formItems } from '../../model/const/formItems';
import { createCustomStyles } from '../../model/lib/createCustomStyles';
import { AvatarUploader } from '@/shared/ui/AvatarEditor';
import { AvatarUploaderRef } from '@/shared/ui/AvatarEditor/ui/AvatarUpLoader/AvatarUpLoader';
import styles from './EditProfileForm.module.scss';

interface EditBirthdayForm {
	day: DateOption | undefined;
	month: DateOption | undefined;
	year: DateOption | undefined;
}

interface EditProfileForm extends EditBirthdayForm, ProfileSchema {}

interface EditProfileFormProps {
	parentClass?: string;
}

export function EditProfileForm({ parentClass }: EditProfileFormProps) {
	const [isSuccess, setIsSuccess] = useState(false);
	const [serverErrorMessage, setServerErrorMessage] = useState('');
	const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);
	const [editProfile, { isLoading }] = useEditProfileMutation();
	const avatarUploaderRef = useRef<AvatarUploaderRef>(null);
	const methods = useForm<EditProfileForm>({
		defaultValues: {
			nickname: '',
			first_name: '',
			last_name: '',
			additional_information: '',
			birthday: 0
		}
	});
	const { watch, setValue, setError, formState, reset } = methods;
	const day = watch('day')?.value;
	const month = watch('month')?.value;
	const year = watch('year')?.value;
	const dayOptions = getDaysOptions(month, year);
	const hasError = formState.isSubmitted && (!day || !month || !year);

	const fetchProfile = useCallback(async () => {
		const response = await editProfile({});
		if (response.data) {
			const data = response.data;

			if (data && data.birthday) {
				const { enteredDay, enteredMonth, enteredYear } = convertNumberToDate(
					data.birthday
				);

				reset({
					nickname: data.nickname || '',
					first_name: data.first_name || '',
					last_name: data.last_name || '',
					additional_information: data.additional_information || '',
					day: { label: String(enteredDay), value: String(enteredDay) },
					month: { label: String(enteredMonth), value: String(enteredMonth) },
					year: { label: String(enteredYear), value: String(enteredYear) }
				});
			}
		}
	}, [reset, editProfile]);

	//  Синхронизация дней при смене месяца / года, - 28, 29, 30 или 31
	useEffect(() => {
		if (!day || !month || !year) {
			return;
		}

		const maxDay = getDaysInMonth(Number(month), Number(year));

		if (Number(day) > maxDay) {
			setValue('day', { label: String(maxDay), value: String(maxDay) });
		}
	}, [day, month, year, setValue]);

	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

	// Логика загрузки аватара — просто вывод в консоль
	const handleAvatarChange = (dataUrl: string) => {
		console.log('Новый аватар:', dataUrl);
		setCurrentAvatar(dataUrl);
	};

	const onSubmit: SubmitHandler<EditProfileForm> = async data => {
		setServerErrorMessage('');
		const newBirthday =
			day && month && year && convertDateToNumber({ day, month, year });

		const newData = {
			nickname: data.nickname,
			first_name: data.first_name,
			last_name: data.last_name,
			birthday: newBirthday || 0,
			additional_information: data.additional_information
		};

		try {
			const result = await editProfile(newData);

			if ('data' in result) {
				// console.log('success', data);
				setIsSuccess(true);
			} else {
				const error = result.error;
				// console.log('error', error);
				if (
					error &&
					typeof error === 'object' &&
					'status' in error &&
					'data' in error
				) {
					const serverErrors = error.data as Record<string, string[]>;

					Object.entries(serverErrors).forEach(([field, messages]) => {
						setError(field as keyof EditProfileForm, {
							type: 'server',
							message: messages.join(' ')
						});
					});
				} else {
					setServerErrorMessage('Произошла непредвиденная ошибка');
				}
			}
		} catch (e) {
			setServerErrorMessage('Произошла непредвиденная ошибка');
		}
	};

	if (isSuccess) {
		return (
			<SuccessBlock marginTop='100px' title={' Ваш профиль успешно изменен'} />
		);
	}

	if (serverErrorMessage) {
		return <ErrorComponent>{serverErrorMessage}</ErrorComponent>;
	}

	return (
		<>
			<AvatarUploader
				ref={avatarUploaderRef}
				onAvatarChange={handleAvatarChange}
			/>
			<Button
				theme={ButtonTheme.CLEAR}
				color={ButtonColor.TRANSPARENT}
				btnType={ButtonType.BUTTON}
				onClick={() => {
					console.log(
						'[Avatar Debug] Текущие данные аватара:',
						currentAvatar || 'не выбран'
					);

					// Открываем выбор файла
					avatarUploaderRef.current?.openFilePicker();
				}}
			>
				Выбрать фотографию
			</Button>
			<Form<EditProfileForm>
				methods={methods}
				onSubmit={onSubmit}
				className={classNames(styles.form, {}, [parentClass])}
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

				<fieldset>
					{hasError ? (
						<legend
							className={classNames(
								`${styles.birthday} ${styles.birthdayError}`,
								{},
								[]
							)}
						>
							Пожалуйста, заполните дату рождения
						</legend>
					) : (
						<legend className={styles.birthday}>
							Введите дату своего рождения
						</legend>
					)}
					<div className={styles.selectContainer}>
						<SelectItem<EditProfileForm, DateOption>
							options={dayOptions}
							name={'day'}
							parentSelectWrapperClass={styles.selectWrapper}
							parentSelectControlClass={styles.selectDay}
							parentSelectMenuClass={styles.selectMenu}
							createCustomStyles={createCustomStyles}
							ariaLabel='Выбор дня месяца'
							hasError={hasError}
						/>
						<SelectItem<EditProfileForm, DateOption>
							options={getMonthsOptions()}
							name={'month'}
							parentSelectControlClass={styles.selectMonth}
							parentSelectMenuClass={styles.selectMenu}
							createCustomStyles={createCustomStyles}
							ariaLabel='Выбор месяца'
							hasError={hasError}
						/>
						<SelectItem
							options={getYearsOptions()}
							name={'year'}
							parentSelectControlClass={styles.selectYear}
							parentSelectMenuClass={styles.selectMenu}
							createCustomStyles={createCustomStyles}
							ariaLabel='Выбор года'
							hasError={hasError}
						/>
					</div>
				</fieldset>
				<FormSettingsItem
					key={FormItemNames.ADDITIONAL_INFORMATION}
					type={FormItemType.TEXTAREA}
					name={FormItemNames.ADDITIONAL_INFORMATION}
					label={'Напишите пару слов о себе'}
					rules={{ required: 'Заполните это поле' }}
					classNameParentInput={styles.formItem}
					textareaHeight={'56px'}
				/>
				<Button btnType={ButtonType.SUBMIT}>
					{isLoading ? <Loader width='22px' height='22px' /> : 'Сохранить'}
				</Button>
			</Form>
		</>
	);
}
