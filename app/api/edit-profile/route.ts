import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const body = await request.json();
	const cookieStore = await cookies();
	const token = cookieStore.get('accessToken')?.value;

	if (!token) {
		return NextResponse.json({ detail: 'No access token' }, { status: 401 });
	}

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_BASE_API}/${process.env.NEXT_PUBLIC_EDIT_PROFILE}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(body)
		}
	);

	if (!res.ok) {
		if (res.status >= 500 && res.status < 600) {
			return NextResponse.json({ status: 500 });
		} else {
			const err = await res.json();
			return NextResponse.json(err, { status: 400 });
		}
	}

	const result = await res.json();

	return NextResponse.json(result, { status: res.status });
}
