import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];

const getApiURL = () => {
  return process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEV_API_URL
    : process.env.NEXT_PUBLIC_PROD_API_URL;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path matches a protected route
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // Get the token cookie from the request
    const token = request.cookies.get('token')?.value;

    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Call external API to validate token
      const apiURL = `${getApiURL()}/auth/`; // Replace getApiURL() with actual implementation or environment variable
      const response = await fetch(apiURL, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token is invalid or expired
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Token is valid, continue request
      return NextResponse.next();
    } catch (err) {
      console.error('Error validating token:', err);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // For non-protected routes, continue as usual
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
