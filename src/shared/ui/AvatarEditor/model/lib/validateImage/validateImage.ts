import { AVATAR_VALIDATION_CONFIG } from '../../constants/constants';

export interface ValidationResult {
	valid: boolean;
	error?: string;
}

export const validateImageFile = async (
	file: File
): Promise<ValidationResult> => {
	return new Promise(resolve => {
		// Проверка наличия файла
		if (!file) {
			resolve({
				valid: false,
				error: 'Файл не выбран'
			});
			return;
		}

		// Проверка размера
		if (file.size > AVATAR_VALIDATION_CONFIG.MAX_SIZE_BYTES) {
			resolve({
				valid: false,
				error: `Размер файла не должен превышать ${AVATAR_VALIDATION_CONFIG.MAX_SIZE_MB} МБ`
			});
			return;
		}

		// Проверка типа
		if (!file.type.startsWith('image/')) {
			resolve({
				valid: false,
				error: 'Файл должен быть изображением (JPEG, PNG, WEBP, AVIF)'
			});
			return;
		}

		// Валидация через создание изображения
		const img = new Image();
		img.onload = () => {
			resolve({ valid: true });
		};
		img.onerror = () => {
			resolve({
				valid: false,
				error: 'Файл поврежден или не является валидным изображением'
			});
		};
		img.src = URL.createObjectURL(file);
	});
};
