import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const { phone_number, code } = await request.json();
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_API}/${process.env.NEXT_PUBLIC_TOKEN}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ phone_number, code })
		}
	);

	if (!res.ok) {
		const err = await res.json();
		return NextResponse.json(
			{ errors: err.errors || ['Ошибка входа'] },
			{ status: 400 }
		);
	}
	const data = await res.json();
	// console.log('data in setTokens', data);

	// Создаём ответ
	const response = NextResponse.json(
		{ success: true, is_filled: data.is_filled },
		{ status: 200 }
	);
	// Устанавливаем Access Token
	response.cookies.set('accessToken', data.access, {
		path: '/',
		httpOnly: true,
		secure: true,
		maxAge: 10 * 60 // 10 минут
	});

	// Устанавливаем Refresh Token
	response.cookies.set('refreshToken', data.refresh, {
		path: '/',
		httpOnly: true,
		secure: true,
		maxAge: 30 * 24 * 60 * 60 // 30 дней
	});

	return response;
}
