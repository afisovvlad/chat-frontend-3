import { useCallback } from 'react';
import { useFileUpload } from '@/shared/lib/hooks/useFileUpload/useFileUpload';
import { uploadAvatar } from '@/shared/ui/AvatarEditor/api/uploadAvatarApi';
import { validateImageFile } from '../../validateImage/validateImage';

/**
 * Результат хука загрузки аватара
 *
 * @property upload - Функция для загрузки аватара на сервер
 * @property isUploading - Флаг, указывающий, идет ли сейчас загрузка
 * @property error - Сообщение об ошибке, если загрузка не удалась
 * @property clearError - Функция для очистки сообщения об ошибке
 * @property avatarUrl - URL загруженного аватара (после успешной загрузки)
 */
interface UseAvatarUploadResult {
	/**
	 * Функция загрузки аватара
	 * @param file - Файл изображения для загрузки
	 * @returns Промис, который разрешается после успешной загрузки
	 */
	upload: (file: File) => Promise<void>;

	/**
	 * Флаг состояния загрузки
	 * Используется для отображения индикатора загрузки или блокировки кнопки
	 */
	isUploading: boolean;

	/**
	 * Сообщение об ошибке
	 * Содержит текст ошибки, если загрузка не удалась, или null если ошибки нет
	 */
	error: string | null;

	/**
	 * Функция очистки ошибки
	 * Сбрасывает состояние ошибки в null
	 */
	clearError: () => void;

	/**
	 * URL загруженного аватара
	 * Содержит ссылку на изображение после успешной загрузки, или null если аватар еще не загружен
	 */
	avatarUrl: string | null;
}

/**
 * Хук для загрузки аватара пользователя
 *
 * Предоставляет готовый функционал для загрузки аватара с валидацией,
 * обработкой ошибок и отслеживанием состояния загрузки.
 *
 * Использует универсальный хук useFileUpload, преднастроенный под загрузку аватаров.
 *
 * @param onSuccess - Опциональный callback, который вызывается после успешной загрузки аватара
 * @returns Объект с методами и состоянием загрузки
 *
 * @example
 * ```typescript
 * const { upload, isUploading, error, avatarUrl } = useAvatarUpload(() => {
 *   console.log('Аватар успешно загружен!');
 * });
 *
 * const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 *   const file = e.target.files?.[0];
 *   if (file) {
 *     await upload(file);
 *     console.log('URL аватара:', avatarUrl);
 *   }
 * };
 * ```
 */
export const useAvatarUpload = (
	onSuccess?: () => void
): UseAvatarUploadResult => {
	/**
	 * Используем универсальный хук useFileUpload для загрузки файлов
	 *
	 * Настраиваем его под конкретную задачу загрузки аватара:
	 * - uploadFn: функция загрузки аватара на сервер
	 * - validateFn: функция валидации изображения
	 * - extractData: извлекаем только URL из ответа сервера
	 * - errorMessages: кастомные сообщения об ошибках на русском языке
	 *
	 * Хук возвращает:
	 * - upload: функция загрузки файла
	 * - isUploading: флаг состояния загрузки
	 * - error: сообщение об ошибке
	 * - clearError: функция очистки ошибки
	 * - lastResult: последний успешный результат (в нашем случае - URL аватара)
	 */
	const {
		upload: uploadFile,
		isUploading,
		error,
		clearError,
		lastResult
	} = useFileUpload({
		// Функция загрузки аватара на сервер через прокси-роут
		uploadFn: uploadAvatar,

		// Функция валидации файла перед загрузкой
		// Проверяет, что файл является валидным изображением
		validateFn: validateImageFile,

		// Функция извлечения нужных данных из ответа сервера
		// Сервер возвращает объект { file: string, file_url: string }
		// Нам нужен только file_url - URL изображения
		extractData: response => response.file_url,

		// Кастомные сообщения об ошибках на русском языке
		errorMessages: {
			// Ошибка валидации файла
			validationFailed:
				'Неверный формат аватара. Используйте изображение (JPEG, PNG, WEBP, AVIF)',

			// Ошибка загрузки файла на сервер
			uploadFailed: 'Не удалось загрузить аватар. Попробуйте ещё раз',

			// Ошибка извлечения данных из ответа сервера
			extractFailed: 'Не удалось получить ссылку на аватар'
		}
	});

	/**
	 * Функция загрузки аватара
	 *
	 * Обертка над функцией uploadFile из универсального хука.
	 * Добавляет вызов колбэка onSuccess после успешной загрузки.
	 *
	 * @param file - Файл изображения для загрузки
	 * @returns Промис, который разрешается после успешной загрузки
	 *
	 * @throws Ошибка, если загрузка не удалась
	 *
	 * @example
	 * ```typescript
	 * try {
	 *   await upload(file);
	 *   console.log('Аватар загружен успешно!');
	 * } catch (error) {
	 *   console.error('Ошибка загрузки:', error);
	 * }
	 * ```
	 */
	const upload = useCallback(
		async (file: File) => {
			// Вызываем функцию загрузки из универсального хука
			// Она выполнит валидацию, загрузку на сервер и извлечение данных
			await uploadFile(file);

			// Если загрузка успешна, вызываем колбэк onSuccess (если он передан)
			// Это позволяет компоненту выполнить дополнительные действия
			// после успешной загрузки (например, обновить данные пользователя)
			onSuccess?.();
		},
		// Зависимости для мемоизации функции
		// Функция будет пересоздаваться только при изменении этих зависимостей
		[uploadFile, onSuccess]
	);

	/**
	 * Возвращаем объект с методами и состоянием загрузки
	 *
	 * Свойства объекта:
	 * - upload: функция загрузки аватара
	 * - isUploading: флаг состояния загрузки
	 * - error: сообщение об ошибке (или null)
	 * - clearError: функция очистки ошибки
	 * - avatarUrl: URL загруженного аватара (или null)
	 *
	 * Обратите внимание:
	 * - `upload` - это наша обертка с вызовом onSuccess
	 * - `avatarUrl` - это `lastResult` из универсального хука, приведенный к string | null
	 *   (мы знаем, что extractData возвращает строку - URL)
	 */
	return {
		upload,
		isUploading,
		error,
		clearError,
		avatarUrl: lastResult as string | null
	};
};
