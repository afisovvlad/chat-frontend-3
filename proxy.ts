import { NextRequest, NextResponse } from 'next/server';

const SKIP_AUTH_PATHS = ['/api/auth/setTokens', '/api/auth/refresh'];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasAccessToken = request.cookies.has('accessToken');

	if (SKIP_AUTH_PATHS.some(path => pathname.startsWith(path))) {
		return NextResponse.next();
	}

	const isLoginPage =
		pathname.includes('/login') ||
		pathname.includes('/registration') ||
		pathname.includes('/user-agreement') ||
		pathname.includes('/test');

	// Авторизованный не пускаем на /login
	if (hasAccessToken && isLoginPage) {
		return NextResponse.redirect(new URL('/', request.url), 307);
	}

	// чтобы proxy.ts не перехватывал запросы на proxy route.ts, который перенаправляет запросы на бэк
	const isProxyApi = pathname.startsWith('/api/proxy');

	// Неавторизованного пускаем только на /login
	if (!hasAccessToken && !isLoginPage && !isProxyApi) {
		return NextResponse.redirect(new URL('/login', request.url), 307);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// все остальные пути, кроме статики
		'/((?!_next/static|_next/image|favicon.ico|images).*)'
	]
};
