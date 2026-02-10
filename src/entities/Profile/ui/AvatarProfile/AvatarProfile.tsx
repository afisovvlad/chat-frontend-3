'use client';

import { classNames } from '@/shared/lib/classNames/classNames';
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector/useAppSelector';
import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
import { Avatar } from '@/shared/ui/Avatar';
import { AvatarUploader } from '@/shared/ui/AvatarEditor';
import { useAvatarUpload } from '@/shared/ui/AvatarEditor/model/lib/hooks/useAvatarUpload/useAvatarUpload';
import { AvatarUploaderRef } from '@/shared/ui/AvatarEditor/ui/AvatarUpLoader/AvatarUpLoader';
import {
	Button,
	ButtonColor,
	ButtonTheme,
	ButtonType
} from '@/shared/ui/Button';
import { Loader } from '@/shared/ui/Loader';
import { Modal } from '@/shared/ui/Modal';
import { Text, TextSize, TextTag, TextType, TitleTag } from '@/shared/ui/Text';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
	useEditProfileMutation
	// useGetProfileQuery
} from '../../api/editProfile.api';
import cls from './AvatarProfile.module.scss';

export function AvatarProfile() {
	const profile = useAppSelector(state => state.profile);
	const isMobile = useMediaQuery();
	const [serverError, setServerError] = useState<string | null>(null);
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(
		profile.avatar_url || null
	);
	const avatarUploaderRef = useRef<AvatarUploaderRef>(null);

	const avatarSize = isMobile ? 200 : 180; // Размер аватара для мобильной версии
	const avatarVariant = isMobile ? 'full' : 'card';
	// ==================== RTK QUERY ====================
	// const [editProfile, { isLoading: isSaving }] = useEditProfileMutation();
	// const {
	// 	data: profileData,
	// 	isLoading: isProfileLoading,
	// 	error: profileError,
	// 	refetch: refetchProfile
	// } = useGetProfileQuery();

	// ==================== ХУК ЗАГРУЗКИ АВАТАРА ====================
	// Используем хук для загрузки аватара
	// После успешной загрузки обновляем профиль
	// const {
	// 	upload: uploadAvatarFile, // Функция загрузки
	// 	isUploading: isAvatarUploading, // Статус загрузки
	// 	error: avatarError, // Ошибка
	// 	clearError: clearAvatarError, // Очистка ошибки
	// 	avatarUrl // URL загруженного аватара
	// } = useAvatarUpload(() => {
	// 	// Callback после успешной загрузки
	// 	refetchProfile();
	// });

	// ==================== ПРОИЗВОДНОЕ СОСТОЯНИЕ ====================
	// const currentAvatar = useMemo(() => {
	// 	// Приоритет: 1. preview (после загрузки), 2. из профиля
	// 	return avatarPreviewUrl || profileData?.avatar_url || null;
	// }, [avatarPreviewUrl, profileData?.avatar_url]);

	// ==================== ХЕНДЛЕРЫ ====================
	const showErrorModal = useCallback((message: string) => {
		setServerError(message);
		setIsErrorModalOpen(true);
	}, []);

	const handleCloseErrorModal = useCallback(() => {
		setServerError(null);
		setIsErrorModalOpen(false);
		// clearAvatarError();
	}, []);

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

	// useEffect(() => {
	// 	if (avatarUrl) {
	// 		setAvatarPreviewUrl(avatarUrl);
	// 	}
	// }, [avatarUrl]);

	// Показ ошибки загрузки аватара
	// useEffect(() => {
	// 	if (avatarError) {
	// 		showErrorModal(avatarError);
	// 	}
	// }, [avatarError, showErrorModal]);

	// Показ ошибки загрузки профиля
	// useEffect(() => {
	// 	if (profileError) {
	// 		const message =
	// 			profileError instanceof Error
	// 				? profileError.message
	// 				: 'Ошибка загрузки данных профиля';
	// 		showErrorModal(message);
	// 	}
	// }, [profileError, showErrorModal]);

	// Очистка preview URL при изменении профиля
	// useEffect(() => {
	// 	if (profileData?.avatar_url) {
	// 		setAvatarPreviewUrl(null);
	// 	}
	// }, [profileData?.avatar_url]);

	const isUploading = isAvatarUploading || isSaving;

	return (
		<>
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

// *********************
// 'use client';

// import { classNames } from '@/shared/lib/classNames/classNames';
// import { useMediaQuery } from '@/shared/lib/hooks/useMediaQuery/useMediaQuery';
// import { Avatar } from '@/shared/ui/Avatar';
// import { AvatarUploader } from '@/shared/ui/AvatarEditor';
// import { useAvatarUpload } from '@/shared/ui/AvatarEditor/model/lib/hooks/useAvatarUpload/useAvatarUpload';
// import { AvatarUploaderRef } from '@/shared/ui/AvatarEditor/ui/AvatarUpLoader/AvatarUpLoader';
// import {
// 	Button,
// 	ButtonColor,
// 	ButtonTheme,
// 	ButtonType
// } from '@/shared/ui/Button';
// import { Loader } from '@/shared/ui/Loader';
// import { Modal } from '@/shared/ui/Modal';
// import { Text, TextSize, TextTag, TextType, TitleTag } from '@/shared/ui/Text';
// import { useCallback, useMemo, useRef, useState } from 'react';
// import {
// 	useEditProfileMutation,
// 	useGetProfileQuery
// } from '../../api/editProfile.api';
// import cls from './AvatarProfile.module.scss';
// import { useAppSelector } from '@/shared/lib/hooks/useAppSelector/useAppSelector';

// export function AvatarProfile() {
// 	const profile = useAppSelector(state => state.profile);
// 	const [serverError, setServerError] = useState<string | null>(
// 		profile.avatar_url || null
// 	);
// 	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
// 	const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
// 	const avatarUploaderRef = useRef<AvatarUploaderRef>(null);
// 	const isMobile = useMediaQuery();
// 	const avatarSize = isMobile ? 200 : 180; // Размер аватара для мобильной версии
// 	const avatarVariant = isMobile ? 'full' : 'card';
// 	// ==================== RTK QUERY ====================
// 	const [editProfile, { isLoading: isSaving }] = useEditProfileMutation();
// 	const {
// 		data: profileData,
// 		isLoading: isProfileLoading,
// 		error: profileError,
// 		refetch: refetchProfile
// 	} = useGetProfileQuery();

// 	// ==================== ХУК ЗАГРУЗКИ АВАТАРА ====================
// 	// Используем хук для загрузки аватара
// 	// После успешной загрузки обновляем профиль
// 	const {
// 		upload: uploadAvatarFile, // Функция загрузки
// 		isUploading: isAvatarUploading, // Статус загрузки
// 		error: avatarError, // Ошибка
// 		clearError: clearAvatarError, // Очистка ошибки
// 		avatarUrl // URL загруженного аватара
// 	} = useAvatarUpload(() => {
// 		// Callback после успешной загрузки
// 		refetchProfile();
// 	});

// 	// ==================== ПРОИЗВОДНОЕ СОСТОЯНИЕ ====================
// 	const currentAvatar = useMemo(() => {
// 		// Приоритет: 1. preview (после загрузки), 2. из профиля
// 		return avatarPreviewUrl || profileData?.avatar_url || null;
// 	}, [avatarPreviewUrl, profileData?.avatar_url]);

// 	// ==================== ХЕНДЛЕРЫ ====================
// 	const showErrorModal = useCallback((message: string) => {
// 		setServerError(message);
// 		setIsErrorModalOpen(true);
// 	}, []);

// 	const handleCloseErrorModal = useCallback(() => {
// 		setServerError(null);
// 		setIsErrorModalOpen(false);
// 		clearAvatarError();
// 	}, [clearAvatarError]);

// 	// Обработчик изменения аватара
// 	const handleAvatarChange = useCallback(
// 		async (file: File) => {
// 			try {
// 				// Используем функцию из хука
// 				await uploadAvatarFile(file);

// 				// Если хук вернул URL, устанавливаем превью
// 				// (это произойдет автоматически через эффект ниже)
// 			} catch (error) {
// 				// Ошибка уже обработана в хуке, не нужно ничего делать
// 				// Модальное окно покажется через эффект ниже
// 			}
// 		},
// 		[uploadAvatarFile]
// 	);

// 	// useEffect(() => {
// 	// 	if (avatarUrl) {
// 	// 		setAvatarPreviewUrl(avatarUrl);
// 	// 	}
// 	// }, [avatarUrl]);

// 	// Показ ошибки загрузки аватара
// 	// useEffect(() => {
// 	// 	if (avatarError) {
// 	// 		showErrorModal(avatarError);
// 	// 	}
// 	// }, [avatarError, showErrorModal]);

// 	// Показ ошибки загрузки профиля
// 	// useEffect(() => {
// 	// 	if (profileError) {
// 	// 		const message =
// 	// 			profileError instanceof Error
// 	// 				? profileError.message
// 	// 				: 'Ошибка загрузки данных профиля';
// 	// 		showErrorModal(message);
// 	// 	}
// 	// }, [profileError, showErrorModal]);

// 	// Очистка preview URL при изменении профиля
// 	// useEffect(() => {
// 	// 	if (profileData?.avatar_url) {
// 	// 		setAvatarPreviewUrl(null);
// 	// 	}
// 	// }, [profileData?.avatar_url]);

// 	const isUploading = isAvatarUploading || isSaving;

// 	return (
// 		<>
// 			<div className={cls.avatarContainer}>
// 				<div className={cls.avatarWrapper}>
// 					{isUploading ? (
// 						<div className={cls.loading}>
// 							<Loader width='40px' height='40px' />
// 							<Text className={cls.loadingText}>
// 								{isAvatarUploading ? 'Загрузка аватара...' : 'Сохранение...'}
// 							</Text>
// 						</div>
// 					) : (
// 						<Avatar
// 							size={avatarSize}
// 							src={currentAvatar || undefined}
// 							variant={avatarVariant}
// 							alt='Аватар пользователя'
// 						/>
// 					)}
// 				</div>
// 				{/* Загрузчик аватара */}
// 				<div className={cls.btnWrapper}>
// 					<AvatarUploader
// 						ref={avatarUploaderRef}
// 						onAvatarChange={handleAvatarChange}
// 					/>
// 					{!isUploading && (
// 						<Button
// 							theme={ButtonTheme.CLEAR}
// 							color={ButtonColor.PRIMARY}
// 							btnType={ButtonType.BUTTON}
// 							onClick={() => avatarUploaderRef.current?.openFilePicker()}
// 							disabled={isUploading}
// 							className={classNames(cls.uploadButton, {
// 								[cls.mobileUploadButton]: isMobile
// 							})}
// 						>
// 							{isMobile ? 'Изменить фото' : 'Выбрать фотографию'}
// 						</Button>
// 					)}
// 				</div>
// 			</div>

// 			{/* Модальное окно ошибки */}
// 			{isErrorModalOpen && (
// 				<Modal
// 					isOpen={isErrorModalOpen}
// 					onClose={handleCloseErrorModal}
// 					closeButton
// 					size='wide'
// 					borderRadius='8px'
// 				>
// 					<div className={cls.errorModalContent}>
// 						<Text type={TextType.TITLE} tag={TitleTag.H3} fontSize={TextSize.L}>
// 							Ошибка
// 						</Text>
// 						<Text type={TextType.TEXT} tag={TextTag.P} fontSize={TextSize.M}>
// 							{serverError || avatarError}
// 						</Text>
// 						<Button
// 							onClick={handleCloseErrorModal}
// 							color={ButtonColor.GREEN}
// 							className={cls.errorCloseBtn}
// 						>
// 							Закрыть
// 						</Button>
// 					</div>
// 				</Modal>
// 			)}
// 		</>
// 	);
// }
