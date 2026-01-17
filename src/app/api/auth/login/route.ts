import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const body = await request.json();
    const { username, password } = body;

    // Hardcoded credentials as per prompt
    if (username === 'admin' && password === 'Felicidad0505') {
        const response = NextResponse.json({ success: true });

        // Set a cookie (simple auth for this demo)
        // HttpOnly, Secure, SameSite
        response.cookies.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        return response;
    }

    return NextResponse.json({ success: false }, { status: 401 });
}
