/**
 * Импорт типов из Next.js для работы с серверными роутами
 *
 * @type NextRequest - Тип для входящего HTTP-запроса
 * @type NextResponse - Тип для исходящего HTTP-ответа
 */
import { NextRequest, NextResponse } from 'next/server';

/**
 * Конфигурация URL бэкенда
 *
 * Приоритет получения значения:
 * 1. NEXT_PUBLIC_API_URL - основная переменная окружения
 * 2. NEXT_PUBLIC_BASE_API - резервная переменная окружения
 * 3. https://api.test.chat.ktsf.ru/api/v1 - дефолтное значение
 *
 * ⚠️ Важно: если в конце дефолтного значения есть лишние пробелы ('  ')
 * Это может вызвать ошибки при формировании полного URL!
 * Рекомендуется исправить: 'https://api.test.chat.ktsf.ru/api/v1'
 */
const API_URL =
	process.env.NEXT_PUBLIC_API_URL ||
	process.env.NEXT_PUBLIC_BASE_API ||
	'https://api.test.chat.ktsf.ru/api/v1';

/**
 * Указание среды выполнения роута
 *
 * @value 'nodejs' - роут выполняется на сервере Node.js
 *
 * Альтернатива: 'edge' - для выполнения на Edge Runtime (быстрее, но меньше возможностей)
 *
 * Node.js runtime позволяет:
 * - Использовать полный API Node.js
 * - Работать с файловой системой
 * - Использовать больше сторонних библиотек
 */
export const runtime = 'nodejs';

/**
 * Обработчик POST-запросов для загрузки аватара
 *
 * Роут доступен по пути, где находится этот файл (например, /api/proxy/avatar)
 *
 * @param request - Входящий HTTP-запрос от клиента
 * @returns NextResponse - HTTP-ответ для клиента
 *
 * @remarks
 * Роут работает как прокси-сервер:
 * 1. Принимает запрос от клиента (фронтенда)
 * 2. Извлекает токен авторизации из куков
 * 3. Пересылает запрос на бэкенд с токеном в заголовке
 * 4. Возвращает ответ от бэкенда клиенту
 *
 * Это обеспечивает безопасность - токен не виден на клиенте.
 */
export async function POST(request: NextRequest) {
	/**
	 * Оборачиваем весь код в блок try-catch для перехвата ошибок
	 *
	 * Это гарантирует, что любая ошибка будет обработана и клиент получит
	 * понятный ответ вместо необработанного исключения.
	 */
	try {
		/**
		 * Извлекаем куки из входящего запроса
		 *
		 * @property request.cookies - объект для работы с куками
		 * @method cookies.get('accessToken') - получает куку с именем 'accessToken'
		 * @property .value - значение куки (строка)
		 *
		 * Куки автоматически передаются браузером при запросе на тот же домен.
		 * Это позволяет получить токен доступа без явной передачи его от клиента.
		 */
		// Получаем куки из запроса
		const cookies = request.cookies;
		const accessToken = cookies.get('accessToken')?.value;

		/**
		 * Проверяем наличие токена доступа
		 *
		 * Если токен отсутствует, возвращаем ошибку 401 Unauthorized
		 *
		 * @reasons отсутствия токена:
		 * - Пользователь не авторизован
		 * - Куки были удалены или просрочены
		 * - Запрос сделан из другого домена (CORS)
		 */
		if (!accessToken) {
			console.error('❌ Прокси: Токен не найден в куках запроса');
			/**
			 * Возвращаем ответ с ошибкой 401 Unauthorized
			 *
			 * @param { detail: '...' } - тело ответа в формате JSON
			 * @param { status: 401 } - HTTP статус код
			 *
			 * Клиент должен обработать эту ошибку и, например,
			 * перенаправить пользователя на страницу входа.
			 */
			return NextResponse.json(
				{ detail: 'Учетные данные не были предоставлены.' },
				{ status: 401 }
			);
		}

		/**
		 * Извлекаем данные формы из запроса
		 *
		 * @method request.formData() - асинхронно парсит тело запроса как FormData
		 * @returns Promise<FormData> - объект с данными формы
		 *
		 * Клиент отправляет файл через FormData с ключом 'file'
		 * Например: formData.append('file', file)
		 */
		const formData = await request.formData();

		/**
		 * Получаем файл из данных формы
		 *
		 * @method formData.get('file') - получает значение по ключу 'file'
		 * @returns File | null - объект файла или null, если файл не найден
		 *
		 * Если клиент не отправил файл, возвращаем ошибку 400 Bad Request
		 */
		const file = formData.get('file');

		/**
		 * Валидация наличия файла
		 *
		 * Если файл отсутствует, возвращаем ошибку 400 Bad Request
		 *
		 * @reasons отсутствия файла:
		 * - Клиент не выбрал файл
		 * - Ошибка на стороне клиента при формировании запроса
		 * - Неправильный ключ в FormData (не 'file')
		 */
		if (!file) {
			/**
			 * Возвращаем ответ с ошибкой 400 Bad Request
			 *
			 * @param { error: 'File is required' } - тело ответа
			 * @param { status: 400 } - HTTP статус код
			 */
			return NextResponse.json({ error: 'File is required' }, { status: 400 });
		}

		/**
		 * Создаем новый объект FormData для отправки на бэкенд
		 *
		 * @reason: Нельзя напрямую использовать formData из запроса
		 * Нужно создать новый объект и скопировать в него данные
		 *
		 * @type FormData - стандартный веб-API для работы с формами
		 * @method new FormData() - создает пустой объект FormData
		 */
		// Создаем новый FormData для отправки на бэкенд
		const backendFormData = new FormData();

		/**
		 * Добавляем файл в новый FormData для бэкенда
		 *
		 * @method backendFormData.append('file', file as Blob)
		 * @param 'file' - ключ, по которому бэкенд будет искать файл
		 * @param file as Blob - файл, приведенный к типу Blob
		 *
		 * @note: File наследует от Blob, поэтому приведение типа безопасно
		 * Бэкенд ожидает файл с ключом 'file' в multipart/form-data
		 */
		backendFormData.append('file', file as Blob);

		/**
		 * Отправляем запрос на бэкенд с авторизацией
		 *
		 * @function fetch - стандартный веб-API для HTTP-запросов
		 * @param `${API_URL}/auth/messenger/profile/avatar/download/` - полный URL бэкенда
		 * @param options - объект с настройками запроса
		 *
		 * @options.method - HTTP метод ('POST')
		 * @options.headers - заголовки запроса
		 * @options.body - тело запроса (FormData с файлом)
		 * @options.cache - политика кэширования
		 *
		 * @headers.Accept - ожидаемый формат ответа ('application/json')
		 * @headers.Authorization - токен доступа в формате Bearer
		 *
		 * @note: fetch выполняется на сервере (Node.js), поэтому нет CORS ограничений
		 */
		// Отправляем запрос на бэкенд с куками пользователя
		const response = await fetch(
			`${API_URL}/auth/messenger/profile/avatar/download/`,
			{
				method: 'POST',
				headers: {
					/**
					 * Заголовок Accept указывает бэкенду, что мы ожидаем JSON
					 *
					 * @value 'application/json' - MIME-тип для JSON
					 */
					Accept: 'application/json',
					/**
					 * Заголовок Authorization передает токен доступа
					 *
					 * @format 'Bearer <token>' - стандартный формат для JWT
					 * @value accessToken - токен, извлеченный из куков
					 *
					 * Бэкенд проверяет этот токен для авторизации пользователя
					 */
					Authorization: `Bearer ${accessToken}`
				},
				/**
				 * Тело запроса - объект FormData с файлом
				 *
				 * fetch автоматически установит правильный Content-Type:
				 * multipart/form-data; boundary=----
				 */
				body: backendFormData,
				/**
				 * Отключаем кэширование запроса
				 *
				 * @value 'no-cache' - не использовать кэш, всегда отправлять запрос на сервер
				 *
				 * Это важно для загрузки файлов, чтобы каждый файл был обработан заново
				 */
				cache: 'no-cache'
			}
		);

		/**
		 * Проверяем успешность ответа от бэкенда
		 *
		 * @property response.ok - true, если статус ответа 200-299
		 *
		 * Если ответ не успешный (400, 401, 403, 404, 500 и т.д.),
		 * обрабатываем ошибку и возвращаем её клиенту
		 */
		if (!response.ok) {
			/**
			 * Пытаемся получить тело ошибки от бэкенда как JSON
			 *
			 * @method response.json() - парсит тело ответа как JSON
			 * @method .catch(() => ({})) - если парсинг не удался, возвращаем пустой объект
			 *
			 * @reason: Бэкенд может вернуть ошибку не в формате JSON (например, HTML страницу)
			 * В этом случае .json() выбросит ошибку, которую мы перехватываем
			 */
			const errorData = await response.json().catch(() => ({}));

			/**
			 * Логируем ошибку от бэкенда для отладки
			 *
			 * @param '❌ Прокси: Ошибка от бэкенда:' - префикс для идентификации
			 * @param errorData - данные ошибки от бэкенда
			 *
			 * Это поможет при диагностике проблем с бэкендом
			 */
			console.error('❌ Прокси: Ошибка от бэкенда:', errorData);

			/**
			 * Возвращаем ошибку клиенту с тем же статусом, что и от бэкенда
			 *
			 * @param errorData || { error: 'Upload failed' } - тело ответа
			 * Если errorData пустой, используем дефолтное сообщение
			 *
			 * @param { status: response.status } - HTTP статус код от бэкенда
			 * Например: 400 (Bad Request), 401 (Unauthorized), 500 (Internal Server Error)
			 *
			 * Это позволяет клиенту понять тип ошибки и обработать её соответствующе
			 */
			return NextResponse.json(errorData || { error: 'Upload failed' }, {
				status: response.status
			});
		}

		/**
		 * Парсим успешный ответ от бэкенда как JSON
		 *
		 * @method response.json() - асинхронно парсит тело ответа
		 * @returns Promise<any> - данные в формате JSON
		 *
		 * Бэкенд должен вернуть объект с информацией о загруженном файле, например:
		 * {
		 *   file: "avatar_123.jpg",
		 *   file_url: "https://api.example.com/media/avatars/avatar_123.jpg"
		 * }
		 */
		const data = await response.json();

		/**
		 * Возвращаем успешный ответ клиенту
		 *
		 * @method NextResponse.json(data, { status: 200 })
		 * @param data - данные от бэкенда (в формате JSON)
		 * @param { status: 200 } - HTTP статус код (200 OK)
		 *
		 * Клиент получит тот же ответ, что и от бэкенда, но через прокси
		 */
		return NextResponse.json(data, { status: 200 });

		/**
		 * Блок обработки исключений
		 *
		 * Перехватывает любые ошибки, которые произошли в блоке try
		 *
		 * @param error - объект ошибки
		 *
		 * @reasons ошибок:
		 * - Сетевая ошибка при запросе к бэкенду
		 * - Ошибка парсинга JSON
		 * - Ошибка в коде прокси-роута
		 * - Таймаут запроса
		 */
	} catch (error) {
		/**
		 * Логируем внутреннюю ошибку для отладки
		 *
		 * @param '❌ Прокси: Внутренняя ошибка:' - префикс для идентификации
		 * @param error - объект ошибки с деталями
		 *
		 * Это поможет при диагностике проблем с прокси-роутом
		 */
		console.error('❌ Прокси: Внутренняя ошибка:', error);

		/**
		 * Возвращаем стандартную ошибку 500 Internal Server Error
		 *
		 * @param { error: 'Internal server error' } - тело ответа
		 * @param { status: 500 } - HTTP статус код
		 *
		 * @note: Не возвращаем детали ошибки клиенту из соображений безопасности
		 * Детали ошибки доступны только в логах сервера
		 */
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
