import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
	const cookieStore = await cookies();

	// Очистка accessToken
	cookieStore.set('accessToken', '', {
		httpOnly: true,
		secure: true,
		maxAge: 0
	});

	// Очистка refreshToken
	cookieStore.set('refreshToken', '', {
		httpOnly: true,
		secure: true,
		maxAge: 0
	});

	return NextResponse.json({ success: true });
}
