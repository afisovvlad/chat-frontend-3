/**
 * Интерфейс ответа сервера при загрузке аватара
 *
 * @property file - Имя файла или идентификатор файла на сервере
 * @property file_url - Полный URL до загруженного изображения
 *
 * @example
 * ```typescript
 * {
 *   file: "avatar_123456.jpg",
 *   file_url: "https://api.example.com/media/avatars/avatar_123456.jpg"
 * }
 * ```
 */
export interface UploadAvatarResponse {
	/**
	 * Имя файла или идентификатор файла на сервере
	 */
	file: string;

	/**
	 * Полный URL до загруженного изображения
	 * Может использоваться для отображения аватара в интерфейсе
	 */
	file_url: string;
}

/**
 * Функция загрузки аватара на сервер
 *
 * Отправляет файл изображения на сервер через прокси-роут Next.js.
 * Прокси-роут автоматически добавляет токен авторизации из куков.
 *
 * @param file - Файл изображения для загрузки (объект типа File)
 * @returns Промис с данными о загруженном аватаре (имя файла и URL)
 *
 * @throws Error - Если загрузка не удалась, выбрасывается ошибка с понятным сообщением
 *
 * @example
 * ```typescript
 * try {
 *   const fileInput = document.querySelector('input[type="file"]');
 *   const file = fileInput.files?.[0];
 *
 *   if (file) {
 *     const result = await uploadAvatar(file);
 *     console.log('Аватар загружен:');
 *     console.log('Имя файла:', result.file);
 *     console.log('URL:', result.file_url);
 *
 *     // Используем URL в интерфейсе
 *     document.getElementById('avatar').src = result.file_url;
 *   }
 * } catch (error) {
 *   console.error('Ошибка загрузки:', error);
 * }
 * ```
 *
 * @remarks
 * Функция использует прокси-роут `/api/proxy/avatar`, который:
 * - Извлекает токен доступа из куков запроса
 * - Отправляет файл на бэкенд с заголовком Authorization
 * - Возвращает ответ от бэкенда клиенту
 *
 * Это обеспечивает безопасность, так как токен не виден на клиенте.
 */
export const uploadAvatar = async (
	file: File
): Promise<UploadAvatarResponse> => {
	/**
	 * Создаем объект FormData для отправки файла
	 *
	 * FormData - стандартный способ отправки файлов через HTTP
	 * Автоматически устанавливает правильный Content-Type (multipart/form-data)
	 */
	const formData = new FormData();

	/**
	 * Добавляем файл в форму с ключом 'file'
	 *
	 * @param 'file' - Ключ, по которому сервер будет искать файл
	 * @param file - Объект файла для загрузки
	 * @param file.name - Опциональное имя файла (будет передано на сервер)
	 *
	 * Сервер ожидает файл с ключом 'file' в multipart/form-data
	 */
	formData.append('file', file, file.name);

	/**
	 * Отправляем POST-запрос на прокси-роут Next.js
	 *
	 * @param '/api/proxy/avatar' - Путь к прокси-роуту
	 * @param method: 'POST' - Метод запроса
	 * @param body: formData - Тело запроса с файлом
	 *
	 * Куки (включая токен доступа) передаются автоматически браузером,
	 * так как запрос идет на тот же домен.
	 *
	 * Прокси-роут на сервере:
	 * 1. Извлекает токен из куков
	 * 2. Отправляет файл на бэкенд с заголовком Authorization: Bearer <token>
	 * 3. Возвращает ответ от бэкенда клиенту
	 */
	const response = await fetch('/api/proxy/avatar', {
		method: 'POST',
		body: formData
	});

	/**
	 * Проверяем успешность ответа
	 *
	 * @property response.ok - true, если статус ответа 200-299
	 *
	 * Если ответ не успешный (400, 401, 403, 500 и т.д.),
	 * обрабатываем ошибку и выбрасываем исключение
	 */
	if (!response.ok) {
		/**
		 * Получаем тело ответа как текст для анализа ошибки
		 *
		 * Сервер может вернуть ошибку в формате JSON или просто текст
		 */
		const errorText = await response.text();
		console.error('❌ Тело ошибки:', errorText);

		/**
		 * Создаем базовое сообщение об ошибке
		 *
		 * Включает статус ответа для отладки (например, "Upload failed with status 401")
		 */
		let errorMessage = `Upload failed with status ${response.status}`;

		/**
		 * Пытаемся распарсить тело ошибки как JSON
		 *
		 * Серверы могут возвращать ошибки в разных форматах:
		 * - DRF (Django REST Framework): {"file": ["Ошибка валидации"]}
		 * - Стандартные ошибки: {"detail": "Учетные данные не предоставлены"}
		 * - Кастомные ошибки: {"message": "..."} или {"error": "..."}
		 *
		 * Мы пытаемся извлечь понятное сообщение из разных возможных форматов
		 */
		try {
			/**
			 * Парсим тело ответа как JSON
			 */
			const errorData = JSON.parse(errorText);

			/**
			 * Извлекаем сообщение об ошибке из разных возможных полей
			 *
			 * Проверяем поля в порядке приоритета:
			 * 1. errorData.file?.[0] - ошибка валидации поля 'file' (DRF)
			 * 2. errorData.detail - стандартное поле ошибки (DRF)
			 * 3. errorData.message - кастомное сообщение
			 * 4. errorData.error - другое кастомное сообщение
			 * 5. Базовое сообщение, если ни одно поле не найдено
			 *
			 * Оператор || возвращает первое "истинное" значение
			 */
			errorMessage =
				errorData.file?.[0] ||
				errorData.detail ||
				errorData.message ||
				errorData.error ||
				errorMessage;
		} catch (e) {
			/**
			 * Если не удалось распарсить JSON (сервер вернул чистый текст),
			 * используем текст ошибки или базовое сообщение
			 */
			// Не удалось распарсить JSON
			errorMessage = errorText || errorMessage;
		}

		/**
		 * Выбрасываем ошибку с понятным сообщением
		 *
		 * Это позволит вызывающему коду обработать ошибку через try/catch
		 * и показать пользователю понятное сообщение
		 */
		throw new Error(errorMessage);
	}

	/**
	 * Парсим успешный ответ как JSON
	 *
	 * Сервер должен вернуть объект, соответствующий интерфейсу UploadAvatarResponse:
	 * {
	 *   file: string,
	 *   file_url: string
	 * }
	 */
	const data = await response.json();

	/**
	 * Возвращаем данные о загруженном аватаре
	 *
	 * Тип возвращаемого значения: UploadAvatarResponse
	 *
	 * Вызывающий код может использовать:
	 * - data.file - имя файла
	 * - data.file_url - URL для отображения
	 */
	return data;
};
