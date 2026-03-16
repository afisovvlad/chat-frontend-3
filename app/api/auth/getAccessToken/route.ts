import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('accessToken')?.value;

	if (!accessToken) {
		return NextResponse.json({ error: 'No access token' }, { status: 401 });
	}

	return NextResponse.json({ accessToken });
}
