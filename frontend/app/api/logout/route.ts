import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.json({ ok: true });
  // امسح الكوكي
  res.headers.append('Set-Cookie', 'access_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax');
  return res;
}
