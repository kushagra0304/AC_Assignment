import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper to get the correct API URL
const getApiURL = () => {
  return process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEV_API_URL
    : process.env.NEXT_PUBLIC_PROD_API_URL;
};

// Server Action to handle post creation
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const heading = formData.get('heading');
  const content = formData.get('content');

  const apiURL = getApiURL();

  const res = await fetch(`${apiURL}/post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Ensures cookies (token) are sent
    body: JSON.stringify({ heading, content })
  });

  if (!res.ok) {
    return NextResponse.json({ message: 'Failed to create post' }, { status: 500 });
  }

  // Redirect back to dashboard after post creation
  return NextResponse.redirect(new URL('/dashboard', request.url), 303);
}
