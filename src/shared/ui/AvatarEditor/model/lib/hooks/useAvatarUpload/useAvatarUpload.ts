import { useCallback } from 'react';
import { useFileUpload } from '@/shared/lib/hooks/useFileUpload/useFileUpload';
import { uploadAvatar } from '@/shared/ui/AvatarEditor/api/uploadAvatarApi';
import { validateImageFile } from '../../validateImage/validateImage';

interface UseAvatarUploadResult {
	upload: (file: File) => Promise<void>;

	isUploading: boolean;

	error: string | null;

	clearError: () => void;

	avatarUrl: string | null;
}

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
				'Неверный формат аватара. Используйте изображение (JPEG, PNG, WEBP, AVIF)',

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
