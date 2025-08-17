import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function POST(req: Request) {
  try {
    const body = await req.text();

    const r = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    const txt = await r.text();
    let data: any;
    try { data = JSON.parse(txt); } catch { data = { message: txt }; }

    if (!r.ok) {
      const msg = data?.message ?? `HTTP ${r.status}: ${txt}`;
      return NextResponse.json({ message: msg }, { status: r.status });
    }

    const token = data?.access_token;
    if (!token) {
      return NextResponse.json({ message: 'Missing access_token in response' }, { status: 500 });
    }

    const res = NextResponse.json({ ok: true });
    // ثبّت كوكي HttpOnly
    res.headers.append(
      'Set-Cookie',
      `access_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
    );
    return res;
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Proxy error (login)' }, { status: 500 });
  }
}
