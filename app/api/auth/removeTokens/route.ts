import { NextResponse } from 'next/server';

export async function POST() {
	const response = NextResponse.json({ success: true });

	// Очистка accessToken
	response.cookies.set('accessToken', '', {
		httpOnly: true,
		secure: true,
		maxAge: 0
	});

	// Очистка refreshToken
	response.cookies.set('refreshToken', '', {
		httpOnly: true,
		secure: true,
		maxAge: 0
	});

	return response;
}
