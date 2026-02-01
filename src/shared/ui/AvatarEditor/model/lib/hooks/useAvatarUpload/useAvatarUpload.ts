import { useCallback } from 'react';
import { useFileUpload } from '@/shared/lib/hooks/useFileUpload/useFileUpload';
import { uploadAvatar } from '@/shared/ui/AvatarEditor/api/uploadAvatarApi';
import { validateImageFile } from '../../validateImage/validateImage';

/**
 * Результат хука загрузки аватара
 */
interface UseAvatarUploadResult {
	upload: (file: File) => Promise<void>;
	isUploading: boolean;
	error: string | null;
	clearError: () => void;
	avatarUrl: string | null;
}

/**
 * Хук для загрузки аватара
 * @param onSuccess - callback после успешной загрузки
 * @returns объект с методами и состоянием загрузки
 */

export const useAvatarUpload = (
	onSuccess?: () => void
): UseAvatarUploadResult => {
	const {
		upload: uploadFile,
		isUploading,
		error,
		clearError,
		lastResult
	} = useFileUpload({
		uploadFn: uploadAvatar,
		validateFn: validateImageFile,
		extractData: response => response.file_url,
		errorMessages: {
			validationFailed:
				'Неверный формат аватара. Используйте изображение (JPEG, PNG, WEBP)',
			uploadFailed: 'Не удалось загрузить аватар. Попробуйте ещё раз',
			extractFailed: 'Не удалось получить ссылку на аватар'
		}
	});

	const upload = useCallback(
		async (file: File) => {
			await uploadFile(file);
			onSuccess?.();
		},
		[uploadFile, onSuccess]
	);

	return {
		upload,
		isUploading,
		error,
		clearError,
		avatarUrl: lastResult as string | null
	};
};
