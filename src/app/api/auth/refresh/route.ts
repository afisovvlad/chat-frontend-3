import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_: NextRequest) {
	const cookieStore = await cookies();

	const refreshToken = cookieStore.get('refreshToken')?.value;

	if (!refreshToken) {
		cookieStore.set('accessToken', '', { maxAge: 0 });
		cookieStore.set('refreshToken', '', { maxAge: 0 });
		return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
	}

	const apiRes = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_API}/auth/refresh/`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh: refreshToken })
		}
	);

	if (!apiRes.ok) {
		cookieStore.set('accessToken', '', { maxAge: 0 });
		cookieStore.set('refreshToken', '', { maxAge: 0 });
		return NextResponse.json({ error: 'Refresh failed' }, { status: 401 });
	}

	const data = await apiRes.json();

	cookieStore.set('accessToken', data.access, {
		httpOnly: true,
		secure: true,
		maxAge: 10 * 60
	});

	cookieStore.set('refreshToken', data.refresh || refreshToken, {
		httpOnly: true,
		secure: true,
		maxAge: 30 * 24 * 60 * 60
	});

	return NextResponse.json({ success: true });
}
