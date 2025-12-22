import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const { phone_number, code } = await request.json();
	console.log('phone_number in auth route: ', phone_number);
	console.log('code in auth route: ', code);

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_API}/${process.env.NEXT_PUBLIC_TOKEN}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ phone_number, code })
		}
	);

	console.log('res in auth route: ', res);

	if (!res.ok) {
		const err = await res.json();
		console.log('err in auth route: ', err);
		return NextResponse.json(
			{ errors: err.errors || ['Ошибка входа'] },
			{ status: 400 }
		);
	}
	const data = await res.json();

	console.log('data in auth route: ', data);

	// Создаём ответ
	const response = NextResponse.json({ success: true });
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

// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
// 	const body = await request.json();
// 	const { accessToken, refreshToken } = body;

// 	const cookieStore = await cookies();

// 	// Устанавливаем Access Token
// 	cookieStore.set('accessToken', accessToken, {
// 		httpOnly: true,
// 		secure: true,
// 		maxAge: 10 * 60 // 10 минут
// 	});

// 	// Устанавливаем Refresh Token
// 	cookieStore.set('refreshToken', refreshToken, {
// 		httpOnly: true,
// 		secure: true,
// 		maxAge: 30 * 24 * 60 * 60 // 30 дней
// 	});

// 	return NextResponse.json({ success: true });
// }
