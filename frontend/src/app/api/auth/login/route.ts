import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const getApiURL = () => {
  return process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEV_API_URL
    : process.env.NEXT_PUBLIC_PROD_API_URL;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  try {
    const backendRes = await fetch(`${getApiURL()}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json({ message: data.message || 'Login failed' }, { status: backendRes.status });
    }

    const token = data.token;
    if (!token) {
      return NextResponse.json({ message: 'Token not found in backend response' }, { status: 500 });
    }

    // Use NextResponse.cookies.set directly
    const response = NextResponse.json({ message: 'Login successful' });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}