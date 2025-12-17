import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const body = await request.json();
	const { accessToken, refreshToken } = body;

	const cookieStore = await cookies();

	// Устанавливаем Access Token
	cookieStore.set('accessToken', accessToken, {
		httpOnly: true,
		secure: true,
		maxAge: 10 * 60 // 10 минут
	});

	// Устанавливаем Refresh Token
	cookieStore.set('refreshToken', refreshToken, {
		httpOnly: true,
		secure: true,
		maxAge: 30 * 24 * 60 * 60 // 30 дней
	});

	return NextResponse.json({ success: true });
}
