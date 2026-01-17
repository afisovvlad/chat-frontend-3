import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
	const cookieStore = await cookies();

	const refreshToken = cookieStore.get('refreshToken')?.value;

	if (!refreshToken) {
		const response = NextResponse.json(
			{ error: 'No refresh token' },
			{ status: 401 }
		);

		response.cookies.set('accessToken', '', { maxAge: 0 });
		response.cookies.set('refreshToken', '', { maxAge: 0 });
		return response;
	}

	const apiRes = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_API}/auth/login/refresh/token/`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh: refreshToken })
		}
	);

	if (!apiRes.ok) {
		const response = NextResponse.json(
			{ error: 'Refresh failed' },
			{ status: 401 }
		);

		response.cookies.set('accessToken', '', { maxAge: 0 });
		response.cookies.set('refreshToken', '', { maxAge: 0 });
		return response;
	}

	const data = await apiRes.json();
	const response = NextResponse.json({ success: true });

	response.cookies.set('accessToken', data.access, {
		httpOnly: true,
		secure: true,
		maxAge: 10 * 60
	});

	response.cookies.set('refreshToken', data.refresh || refreshToken, {
		httpOnly: true,
		secure: true,
		maxAge: 30 * 24 * 60 * 60
	});

	return response;
}
