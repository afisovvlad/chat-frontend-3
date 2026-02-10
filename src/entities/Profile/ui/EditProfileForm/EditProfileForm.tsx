'use client';

import {
	useEditProfileMutation
	// useGetProfileQuery
} from '@/entities/Profile/api/editProfile.api';
import { FormSettingsItem } from '@/entities/Settings';
import { classNames } from '@/shared/lib/classNames/classNames';
import { convertDateToNumber } from '@/shared/lib/convertDateToNumber/convertDateToNumber';
import { convertNumberToDate } from '@/shared/lib/convertNumberToDate/convertNumberToDate';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector/useAppSelector';
import { Button, ButtonType } from '@/shared/ui/Button';
// import {
// 	Button,
// 	ButtonColor,
// 	ButtonTheme,
// 	ButtonType
// } from '@/shared/ui/Button';
// import { Text, TextSize, TextTag, TextType, TitleTag } from '@/shared/ui/Text';
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
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ProfileSchema } from '../..';
import { formItems } from '../../model/const/formItems';
import { createCustomStyles } from '../../model/lib/createCustomStyles';
import cls from './EditProfileForm.module.scss';

// ==================== ТИПЫ ====================

interface EditBirthdayForm {
	day: DateOption | undefined;
	month: DateOption | undefined;
	year: DateOption | undefined;
}

interface EditProfileForm extends EditBirthdayForm, ProfileSchema {}

interface EditProfileFormProps {
	parentClass?: string;
}

// ==================== КОМПОНЕНТ ====================
export function EditProfileForm({ parentClass }: EditProfileFormProps) {
	const [isSuccess, setIsSuccess] = useState(false);
	// const [serverErrorMessage, setServerErrorMessage] = useState('');
	const [serverError, setServerError] = useState<string | null>(null);
	const [editProfile, { isLoading, data }] = useEditProfileMutation();

	// ==================== RTK QUERY ====================
	// const [editProfile, { isLoading: isSaving }] = useEditProfileMutation();
	// const {
	// 	data: profileData,
	// 	isLoading: isProfileLoading,
	// 	error: profileError,
	// 	refetch: refetchProfile
	// } = useGetProfileQuery();

	// ==================== FORM ====================

	const methods = useForm<EditProfileForm>({
		defaultValues: {
			nickname: '',
			first_name: '',
			last_name: '',
			additional_information: '',
			birthday: 0
		},
		mode: 'onChange'
	});

	const { watch, setValue, setError: setFormError, formState, reset } = methods;
	const day = watch('day')?.value;
	const month = watch('month')?.value;
	const year = watch('year')?.value;
	const dayOptions = getDaysOptions(month, year);
	const hasError = formState.isSubmitted && (!day || !month || !year);
	const profile = useAppSelector(state => state.profile);

	console.log('profile', profile);

	// ==================== ЭФФЕКТЫ ====================
	// Загрузка данных профиля в форму
	useEffect(() => {
		if (profile && profile.birthday) {
			const { enteredDay, enteredMonth, enteredYear } = convertNumberToDate(
				profile.birthday
			);

			reset({
				nickname: profile.nickname || '',
				first_name: profile.first_name || '',
				last_name: profile.last_name || '',
				additional_information: profile.additional_information || '',
				day: { label: String(enteredDay), value: String(enteredDay) },
				month: { label: String(enteredMonth), value: String(enteredMonth) },
				year: { label: String(enteredYear), value: String(enteredYear) }
			});
		}
	}, [profile, reset]);

	// Синхронизация дней при смене месяца/года
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
		if (!profile) {
			return;
		}

		const { enteredDay, enteredMonth, enteredYear } = convertNumberToDate(
			profile.birthday
		);

		reset({
			nickname: profile.nickname || '',
			first_name: profile.first_name || '',
			last_name: profile.last_name || '',
			additional_information: profile.additional_information || '',
			day: { label: String(enteredDay), value: String(enteredDay) },
			month: { label: String(enteredMonth), value: String(enteredMonth) },
			year: { label: String(enteredYear), value: String(enteredYear) }
		});
	}, [profile, reset]);

	// ==================== ОТПРАВКА ФОРМЫ ====================
	const onSubmit: SubmitHandler<EditProfileForm> = useCallback(
		async data => {
			setServerError(null);

			try {
				const newBirthday =
					day && month && year ? convertDateToNumber({ day, month, year }) : 0;

				const newData = {
					nickname: data.nickname,
					first_name: data.first_name,
					last_name: data.last_name,
					birthday: newBirthday,
					additional_information: data.additional_information
				};

				const result = await editProfile(newData).unwrap();

				if (result) {
					setIsSuccess(true);
					// await refetchProfile();
				}
			} catch (error) {
				console.error('❌ Ошибка сохранения профиля:', error);

				if (error && typeof error === 'object' && 'data' in error) {
					const serverErrors = error.data as Record<string, string[]>;

					Object.entries(serverErrors).forEach(([field, messages]) => {
						setFormError(field as keyof EditProfileForm, {
							type: 'server',
							message: messages.join(' ')
						});
					});
				} else {
					// showErrorModal('Произошла непредвиденная ошибка при сохранении');
				}
			}

			// } catch (_) {
			// 	setServerErrorMessage('Произошла непредвиденная ошибка');
			// }
		},

		[day, month, year, editProfile, setFormError]
	);

	// ==================== РЕНДЕРИНГ ====================
	if (isSuccess) {
		return (
			<SuccessBlock marginTop='100px' title='Ваш профиль успешно изменен' />
		);
	}

	if (serverError) {
		return <ErrorComponent>{serverError}</ErrorComponent>;
	}

	return (
		<>
			{/* Форма */}
			<Form<EditProfileForm>
				methods={methods}
				onSubmit={onSubmit}
				className={classNames(cls.form, {}, [parentClass])}
			>
				{formItems.map(item => (
					<FormSettingsItem
						key={item.name}
						type={item.type}
						name={item.name}
						label={item.label}
						placeholder={item.placeholder}
						autoComplete={undefined}
						rules={item.rules}
						classNameParentInput={cls.formItem}
					/>
				))}

				{/* Дата рождения */}
				<fieldset>
					<legend
						className={classNames(
							cls.birthday,
							{ [cls.birthdayError]: hasError },
							[]
						)}
					>
						{hasError
							? 'Пожалуйста, заполните дату рождения'
							: 'Введите дату своего рождения'}
					</legend>

					<div className={cls.selectContainer}>
						<SelectItem<EditProfileForm, DateOption>
							options={dayOptions}
							name='day'
							parentSelectWrapperClass={cls.selectWrapper}
							parentSelectControlClass={cls.selectDay}
							parentSelectMenuClass={cls.selectMenu}
							createCustomStyles={createCustomStyles}
							ariaLabel='Выбор дня месяца'
							hasError={hasError}
						/>

						<SelectItem<EditProfileForm, DateOption>
							options={getMonthsOptions()}
							name='month'
							parentSelectControlClass={cls.selectMonth}
							parentSelectMenuClass={cls.selectMenu}
							createCustomStyles={createCustomStyles}
							ariaLabel='Выбор месяца'
							hasError={hasError}
						/>

						<SelectItem
							options={getYearsOptions()}
							name='year'
							parentSelectControlClass={cls.selectYear}
							parentSelectMenuClass={cls.selectMenu}
							createCustomStyles={createCustomStyles}
							ariaLabel='Выбор года'
							hasError={hasError}
						/>
					</div>
				</fieldset>

				{/* Дополнительная информация */}
				<FormSettingsItem
					key={FormItemNames.ADDITIONAL_INFORMATION}
					type={FormItemType.TEXTAREA}
					name={FormItemNames.ADDITIONAL_INFORMATION}
					label='Напишите пару слов о себе'
					rules={{ required: 'Заполните это поле' }}
					classNameParentInput={cls.formItem}
					textareaHeight='56px'
				/>

				{/* Кнопка сохранения */}
				<Button
					btnType={ButtonType.SUBMIT}
					disabled={false}
					// disabled={isUploading}
					className={cls.submitButton}
				>
					{isLoading ? (
						<>
							<Loader width='22px' height='22px' />
						</>
					) : (
						'Сохранить'
					)}
				</Button>
			</Form>
		</>
	);
}
