import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const getApiURL = () => {
  return process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEV_API_URL
    : process.env.NEXT_PUBLIC_PROD_API_URL;
};

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body (instead of FormData)
    const body = await request.json();
    const { title, content } = body;

    const apiURL = getApiURL();
    const token = request.cookies.get('token')?.value;

    const res = await fetch(`${apiURL}/post`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      console.error('Backend API returned error', await res.text());
      return NextResponse.json({ message: 'Failed to create post' }, { status: 500 });
    }

    // Instead of redirect (since you handle submission client-side), return a success response
    return NextResponse.json({ message: 'Post created successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
