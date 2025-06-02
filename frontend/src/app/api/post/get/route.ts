import { NextRequest, NextResponse } from 'next/server';

type Post = {
  author: string;
  date: string;
  heading: string;
  content: string;
};

const getApiURL = () => {
  return process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEV_API_URL
    : process.env.NEXT_PUBLIC_PROD_API_URL;
};

const decodeToken = (token: string): { id: string } | null => {
  try {
    const payloadBase64 = token.split('.')[1]; // JWT structure: header.payload.signature
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    return payload;
  } catch {
    return null;
  }
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    let author = url.searchParams.get('author') || ''; 

    const token = request.cookies.get('token')?.value;

    if (author === 'me' && token) {
      const decoded = decodeToken(token);
      if (decoded?.id) {
        author = decoded.id; // Use id from token if available
      } else {
        return NextResponse.json(
          { error: 'Invalid token or missing id' },
          { status: 401 }
        );
      }
    }

    const res = await fetch(`${getApiURL()}/posts?author=${encodeURIComponent(author)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch posts');

    const posts: Post[] = await res.json();

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
