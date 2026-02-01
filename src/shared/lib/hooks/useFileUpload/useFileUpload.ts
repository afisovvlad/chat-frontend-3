// lib/hooks/useFileUpload.ts
import { useState, useCallback, useRef } from 'react';

/**
 * Конфигурация загрузки файла
 */
interface FileUploadConfig<T = unknown> {
	/**
	 * Функция загрузки файла на сервер
	 */
	uploadFn: (file: File) => Promise<T>;

	/**
	 * Опциональная функция валидации файла
	 */
	validateFn?: (file: File) => Promise<{ valid: boolean; error?: string }>;

	/**
	 * Функция извлечения данных из ответа
	 * @param response - ответ от сервера
	 * @returns данные для успешного завершения
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	extractData?: (response: T) => any;

	/**
	 * Сообщения об ошибках (опционально)
	 */
	errorMessages?: {
		validationFailed?: string;
		uploadFailed?: string;
		extractFailed?: string;
	};
}

/**
 * Результат хука загрузки файла
 */
interface UseFileUploadResult<T = unknown> {
	/**
	 * Функция загрузки файла
	 */
	upload: (file: File) => Promise<T>;

	/**
	 * Статус загрузки
	 */
	isUploading: boolean;

	/**
	 * Ошибка загрузки
	 */
	error: string | null;

	/**
	 * Очистка ошибки
	 */
	clearError: () => void;

	/**
	 * Последний успешный результат
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	lastResult: any | null;
}

/**
 * Универсальный хук для загрузки файлов
 * @param config - конфигурация загрузки
 * @returns объект с методами и состоянием загрузки
 *
 * @example
 
 * const { upload, isUploading, error } = useFileUpload({
 *   uploadFn: uploadAvatar,
 *   validateFn: validateImageFile,
 *   extractData: (response) => response.file_url,
 *   errorMessages: {
 *     validationFailed: 'Неверный формат аватара',
 *     uploadFailed: 'Не удалось загрузить аватар'
 *   }
 * });
 *
 * @example

 * const { upload, isUploading } = useFileUpload({
 *   uploadFn: uploadDocument,
 *   extractData: (response) => response.document_id
 * });
 */
export const useFileUpload = <T = unknown>(
	config: FileUploadConfig<T>
): UseFileUploadResult<T> => {
	const { uploadFn, validateFn, extractData, errorMessages } = config;

	const [isUploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [lastResult, setLastResult] = useState<unknown | null>(null);

	// Используем ref для избежания лишних ререндеров при изменении колбэков
	const uploadFnRef = useRef(uploadFn);
	const validateFnRef = useRef(validateFn);
	const extractDataRef = useRef(extractData);

	uploadFnRef.current = uploadFn;
	validateFnRef.current = validateFn;
	extractDataRef.current = extractData;

	const upload = useCallback(
		async (file: File): Promise<T> => {
			setUploading(true);
			setError(null);

			try {
				// Валидация (если указана)
				if (validateFnRef.current) {
					const validation = await validateFnRef.current(file);
					if (!validation.valid) {
						const errorMsg =
							errorMessages?.validationFailed || 'Ошибка валидации файла';
						throw new Error(validation.error || errorMsg);
					}
				}

				// Загрузка файла
				const response = await uploadFnRef.current(file);

				// Извлечение данных (если указана)
				let extractedData: unknown = response;
				if (extractDataRef.current) {
					extractedData = extractDataRef.current(response);
					if (extractedData === undefined || extractedData === null) {
						const errorMsg =
							errorMessages?.extractFailed ||
							'Не удалось извлечь данные из ответа';
						throw new Error(errorMsg);
					}
				}

				setLastResult(extractedData);
				return response;
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: errorMessages?.uploadFailed || 'Ошибка загрузки файла';

				setError(message);
				console.error('❌ Ошибка загрузки файла:', err);
				throw err;
			} finally {
				setUploading(false);
			}
		},
		[errorMessages]
	);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	return {
		upload,
		isUploading,
		error,
		clearError,
		lastResult
	};
};
