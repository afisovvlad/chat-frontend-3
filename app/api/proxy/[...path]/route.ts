import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	return handleProxy(request);
}
export async function POST(request: NextRequest) {
	return handleProxy(request);
}
export async function PUT(request: NextRequest) {
	return handleProxy(request);
}
export async function DELETE(request: NextRequest) {
	return handleProxy(request);
}

async function handleProxy(request: NextRequest) {
	const path = request.nextUrl.pathname.replace('/api/proxy', '');
	const targetUrl = `${process.env.NEXT_PUBLIC_BASE_API}${path}/`;

	const accessToken = request.cookies.get('accessToken')?.value;
	const headers = new Headers(request.headers);
	if (accessToken) {
		headers.set('Authorization', `Bearer ${accessToken}`);
	}

	const body =
		request.method !== 'GET' && request.method !== 'HEAD'
			? await request.text()
			: undefined;

	try {
		const res = await fetch(targetUrl, {
			method: request.method,
			headers,
			body,
			credentials: 'include'
		});

		const response = new NextResponse(res.body, {
			status: res.status,
			statusText: res.statusText,
			headers: res.headers
		});

		return response;
	} catch (_) {
		return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
	}
}
