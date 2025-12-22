// import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';

// export function middleware(request: NextRequest) {
// 	console.log('🔥 MIDDLEWARE WORKS', request.nextUrl.pathname);
// 	return NextResponse.next();
// }

// export const config = {
// 	matcher: ['/']
// };

import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
	console.log('🔥 proxy WORKS', request.nextUrl.pathname);
	const accessToken = request.cookies.get('accessToken')?.value;
	const { pathname } = request.nextUrl;
	// const isLoginPage = pathname === '/login';
	const isLoginPage = pathname.endsWith('/login');
	console.log('isLoginPage proxy', isLoginPage);
	console.log('accessToken proxy', accessToken);
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
	matcher: ['/login', '/(.*)/login', '/api/:path*']
	// matcher: ['/login', '/api/:path*']
};
