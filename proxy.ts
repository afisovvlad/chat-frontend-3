import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
	const accessToken = request.cookies.get('accessToken')?.value;
	const { pathname } = request.nextUrl;

	if (pathname === '/api/auth/setTokens') {
		return NextResponse.next();
	}

	const isLoginPage =
		pathname.includes('/login') ||
		pathname.includes('/registration') ||
		pathname.includes('/user-agreement');

	// Авторизованный не пускаем на /login
	if (accessToken && isLoginPage) {
		return NextResponse.redirect(new URL('/', request.url), 307);
	}

	// Неавторизованного пускаем только на /login
	if (!accessToken && !isLoginPage) {
		return NextResponse.redirect(new URL('/login', request.url), 307);
	}

	// добавляем accessToken в заголовок
	if (accessToken && pathname.startsWith('/api/')) {
		const requestHeaders = new Headers(request.headers);
		requestHeaders.set('Authorization', `Bearer ${accessToken}`);
		return NextResponse.next({ request: { headers: requestHeaders } });
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/login',
		// все остальные пути, кроме статики
		'/((?!_next/static|_next/image|favicon.ico).*)',
		'/api/:path*' // если нужен проксинг токена на API
	]
};
