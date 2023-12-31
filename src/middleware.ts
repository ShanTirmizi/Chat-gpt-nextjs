// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimiter } from '@/lib/rateLimit';

export async function middleware(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1';

  try {
    const { success } = await rateLimiter.limit(ip);

    if (!success)
      return new NextResponse(
        'Rate limit exceeded because you are typing too fast.'
      );
    return NextResponse.next();
  } catch (error) {
    return new NextResponse(
      'Sorry, something went wrong processing your request. Please try again later.'
    );
  }
}

export const config = {
  matcher: '/api/chat/:path*',
};
