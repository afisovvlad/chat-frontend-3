/**
 * Конфигурация валидации аватара
 */
export const AVATAR_VALIDATION_CONFIG = {
	MAX_SIZE_MB: 5,
	MAX_SIZE_BYTES: 5 * 1024 * 1024,
	ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
} as const;

/**
 * Сообщения об ошибках
 */
export const ERROR_MESSAGES = {
	FILE_NOT_SELECTED: 'Файл не выбран',
	FILE_TOO_LARGE: (maxSizeMB: number) =>
		`Размер файла не должен превышать ${maxSizeMB} МБ`,
	INVALID_FILE_TYPE: 'Файл должен быть изображением (JPEG, PNG, WEBP, GIF)',
	FILE_CORRUPTED: 'Файл поврежден или не является валидным изображением',
	UPLOAD_FAILED: 'Не удалось получить URL аватара',
	PROFILE_LOAD_FAILED: 'Ошибка загрузки данных профиля',
	PROFILE_SAVE_FAILED: 'Произошла непредвиденная ошибка при сохранении',
	AVATAR_UPLOAD_FAILED: 'Ошибка загрузки аватара'
} as const;
