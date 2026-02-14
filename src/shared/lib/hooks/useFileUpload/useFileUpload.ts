import { useState, useCallback, useRef } from 'react';

interface FileUploadConfig<T = unknown> {
	uploadFn: (file: File) => Promise<T>;

	validateFn?: (file: File) => Promise<{ valid: boolean; error?: string }>;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	extractData?: (response: T) => any;

	errorMessages?: {
		validationFailed?: string;
		uploadFailed?: string;
		extractFailed?: string;
	};
}

interface UseFileUploadResult<T = unknown> {
	upload: (file: File) => Promise<T>;

	isUploading: boolean;

	error: string | null;

	clearError: () => void;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	lastResult: any | null;
}

export const useFileUpload = <T = unknown>(
	config: FileUploadConfig<T>
): UseFileUploadResult<T> => {
	const { uploadFn, validateFn, extractData, errorMessages } = config;

	const [isUploading, setUploading] = useState(false);

	const [error, setError] = useState<string | null>(null);

	const [lastResult, setLastResult] = useState<unknown | null>(null);

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
				if (validateFnRef.current) {
					const validation = await validateFnRef.current(file);

					if (!validation.valid) {
						const errorMsg =
							errorMessages?.validationFailed || 'Ошибка валидации файла';

						throw new Error(validation.error || errorMsg);
					}
				}

				const response = await uploadFnRef.current(file);

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
