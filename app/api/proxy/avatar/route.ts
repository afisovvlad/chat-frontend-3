import { NextRequest, NextResponse } from 'next/server';

const API_URL =
	process.env.NEXT_PUBLIC_API_URL ||
	process.env.NEXT_PUBLIC_BASE_API ||
	'https://api.test.chat.ktsf.ru/api/v1';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
	try {
		// Получаем куки из запроса
		const cookies = request.cookies;
		const accessToken = cookies.get('accessToken')?.value;

		if (!accessToken) {
			console.error('❌ Прокси: Токен не найден в куках запроса');
			return NextResponse.json(
				{ detail: 'Учетные данные не были предоставлены.' },
				{ status: 401 }
			);
		}

		const formData = await request.formData();
		const file = formData.get('file');

		if (!file) {
			return NextResponse.json({ error: 'File is required' }, { status: 400 });
		}

		// Создаем новый FormData для отправки на бэкенд
		const backendFormData = new FormData();
		backendFormData.append('file', file as Blob);

		// Отправляем запрос на бэкенд с куками пользователя
		const response = await fetch(
			`${API_URL}/auth/messenger/profile/avatar/download/`,
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${accessToken}`
				},
				body: backendFormData,
				cache: 'no-cache'
			}
		);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error('❌ Прокси: Ошибка от бэкенда:', errorData);

			return NextResponse.json(errorData || { error: 'Upload failed' }, {
				status: response.status
			});
		}

		const data = await response.json();

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error('❌ Прокси: Внутренняя ошибка:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
