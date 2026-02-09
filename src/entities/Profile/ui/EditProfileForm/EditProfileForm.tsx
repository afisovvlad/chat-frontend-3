'use client';

import {
	useEditProfileMutation,
	useGetProfileQuery
} from '@/entities/Profile/api/editProfile.api';
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
import { Text, TextSize, TextTag, TextType, TitleTag } from '@/shared/ui/Text';
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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ProfileSchema } from '../..';
import { formItems } from '../../model/const/formItems';
import { createCustomStyles } from '../../model/lib/createCustomStyles';
import { AvatarUploader } from '@/shared/ui/AvatarEditor';
import { AvatarUploaderRef } from '@/shared/ui/AvatarEditor/ui/AvatarUpLoader/AvatarUpLoader';
import { Avatar } from '@/shared/ui/Avatar';
import { Modal } from '@/shared/ui/Modal';
import { useAvatarUpload } from '@/shared/ui/AvatarEditor/model/lib/hooks/useAvatarUpload/useAvatarUpload';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
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
	// ==================== СОСТОЯНИЯ ====================
	const [isSuccess, setIsSuccess] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

	const avatarUploaderRef = useRef<AvatarUploaderRef>(null);

	// ==================== RTK QUERY ====================
	const [editProfile, { isLoading: isSaving }] = useEditProfileMutation();
	const {
		data: profileData,
		isLoading: isProfileLoading,
		error: profileError,
		refetch: refetchProfile
	} = useGetProfileQuery();

	const isMobile = useMediaQuery();
	const avatarSize = isMobile ? 200 : 180; // Размер аватара для мобильной версии
	const avatarVariant = isMobile ? 'full' : 'card';
	// ==================== ХУК ЗАГРУЗКИ АВАТАРА ====================
	// Используем хук для загрузки аватара
	// После успешной загрузки обновляем профиль
	const {
		upload: uploadAvatarFile, // Функция загрузки
		isUploading: isAvatarUploading, // Статус загрузки
		error: avatarError, // Ошибка
		clearError: clearAvatarError, // Очистка ошибки
		avatarUrl // URL загруженного аватара
	} = useAvatarUpload(() => {
		// Callback после успешной загрузки
		refetchProfile();
	});

	// ==================== ПРОИЗВОДНОЕ СОСТОЯНИЕ ====================
	const currentAvatar = useMemo(() => {
		// Приоритет: 1. preview (после загрузки), 2. из профиля
		return avatarPreviewUrl || profileData?.avatar_url || null;
	}, [avatarPreviewUrl, profileData?.avatar_url]);

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

	// ==================== ХЕНДЛЕРЫ ====================
	const showErrorModal = useCallback((message: string) => {
		setServerError(message);
		setIsErrorModalOpen(true);
	}, []);

	const handleCloseErrorModal = useCallback(() => {
		setServerError(null);
		setIsErrorModalOpen(false);
		clearAvatarError();
	}, [clearAvatarError]);

	// Обработчик изменения аватара
	const handleAvatarChange = useCallback(
		async (file: File) => {
			try {
				// Используем функцию из хука
				await uploadAvatarFile(file);

				// Если хук вернул URL, устанавливаем превью
				// (это произойдет автоматически через эффект ниже)
			} catch (error) {
				// Ошибка уже обработана в хуке, не нужно ничего делать
				// Модальное окно покажется через эффект ниже
			}
		},
		[uploadAvatarFile]
	);

	// ==================== ЭФФЕКТЫ ====================
	// Загрузка данных профиля в форму
	useEffect(() => {
		if (profileData && profileData.birthday) {
			const { enteredDay, enteredMonth, enteredYear } = convertNumberToDate(
				profileData.birthday
			);

			reset({
				nickname: profileData.nickname || '',
				first_name: profileData.first_name || '',
				last_name: profileData.last_name || '',
				additional_information: profileData.additional_information || '',
				day: { label: String(enteredDay), value: String(enteredDay) },
				month: { label: String(enteredMonth), value: String(enteredMonth) },
				year: { label: String(enteredYear), value: String(enteredYear) }
			});
		}
	}, [profileData, reset]);

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

	// Установка превью после успешной загрузки
	useEffect(() => {
		if (avatarUrl) {
			setAvatarPreviewUrl(avatarUrl);
		}
	}, [avatarUrl]);

	// Показ ошибки загрузки аватара
	useEffect(() => {
		if (avatarError) {
			showErrorModal(avatarError);
		}
	}, [avatarError, showErrorModal]);

	// Показ ошибки загрузки профиля
	useEffect(() => {
		if (profileError) {
			const message =
				profileError instanceof Error
					? profileError.message
					: 'Ошибка загрузки данных профиля';
			showErrorModal(message);
		}
	}, [profileError, showErrorModal]);

	// Очистка preview URL при изменении профиля
	useEffect(() => {
		if (profileData?.avatar_url) {
			setAvatarPreviewUrl(null);
		}
	}, [profileData?.avatar_url]);

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
					await refetchProfile();
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
					showErrorModal('Произошла непредвиденная ошибка при сохранении');
				}
			}
		},
		[
			day,
			month,
			year,
			editProfile,
			refetchProfile,
			setFormError,
			showErrorModal
		]
	);

	// ==================== РЕНДЕРИНГ ====================
	if (isSuccess) {
		return (
			<SuccessBlock marginTop='100px' title='Ваш профиль успешно изменен' />
		);
	}

	if (serverError && !isErrorModalOpen) {
		return <ErrorComponent>{serverError}</ErrorComponent>;
	}

	if (isProfileLoading && !profileData) {
		return (
			<div className={cls.loading}>
				<Loader width='40px' height='40px' />
				<Text
					tag={TextTag.SPAN}
					fontSize={TextSize.M}
					className={cls.loadingText}
				>
					Загрузка профиля...
				</Text>
			</div>
		);
	}

	if (profileError) {
		return (
			<ErrorComponent>
				Не удалось загрузить данные профиля. Попробуйте обновить страницу.
			</ErrorComponent>
		);
	}

	const isUploading = isAvatarUploading || isSaving;

	return (
		<>
			{/* Аватар */}
			<div className={cls.avatarContainer}>
				<div className={cls.avatarWrapper}>
					{isUploading ? (
						<div className={cls.loading}>
							<Loader width='40px' height='40px' />
							<Text className={cls.loadingText}>
								{isAvatarUploading ? 'Загрузка аватара...' : 'Сохранение...'}
							</Text>
						</div>
					) : (
						<Avatar
							size={avatarSize}
							src={currentAvatar || undefined}
							variant={avatarVariant}
							alt='Аватар пользователя'
						/>
					)}
				</div>
				{/* Загрузчик аватара */}
				<div className={cls.btnWrapper}>
					<AvatarUploader
						ref={avatarUploaderRef}
						onAvatarChange={handleAvatarChange}
					/>
					{!isUploading && (
						<Button
							theme={ButtonTheme.CLEAR}
							color={ButtonColor.PRIMARY}
							btnType={ButtonType.BUTTON}
							onClick={() => avatarUploaderRef.current?.openFilePicker()}
							disabled={isUploading}
							className={classNames(cls.uploadButton, {
								[cls.mobileUploadButton]: isMobile
							})}
						>
							{isMobile ? 'Изменить фото' : 'Выбрать фотографию'}
						</Button>
					)}
				</div>
			</div>

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
					disabled={isUploading}
					className={cls.submitButton}
				>
					{isSaving ? (
						<>
							<Loader width='22px' height='22px' />
							<span>Сохранение...</span>
						</>
					) : (
						'Сохранить'
					)}
				</Button>
			</Form>

			{/* Модальное окно ошибки */}
			{isErrorModalOpen && (
				<Modal
					isOpen={isErrorModalOpen}
					onClose={handleCloseErrorModal}
					closeButton
					size='wide'
					borderRadius='8px'
				>
					<div className={cls.errorModalContent}>
						<Text type={TextType.TITLE} tag={TitleTag.H3} fontSize={TextSize.L}>
							Ошибка
						</Text>
						<Text type={TextType.TEXT} tag={TextTag.P} fontSize={TextSize.M}>
							{serverError || avatarError}
						</Text>
						<Button
							onClick={handleCloseErrorModal}
							color={ButtonColor.GREEN}
							className={cls.errorCloseBtn}
						>
							Закрыть
						</Button>
					</div>
				</Modal>
			)}
		</>
	);
}
