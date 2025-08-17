import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;

  const isLogin = req.nextUrl.pathname === '/login';
  const isApi = req.nextUrl.pathname.startsWith('/api');

  // اسمح لكل الـ API routes (البروكسيات) يعدّوا
  if (isApi) return NextResponse.next();

  // لو مفيش توكن → أي صفحة غير /login تتحوّل لـ /login
  if (!token && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?from=${encodeURIComponent(req.nextUrl.pathname)}`;
    return NextResponse.redirect(url);
  }

  // لو في توكن وواقف على /login → ودّيه على /projects
  if (token && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = '/projects';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
