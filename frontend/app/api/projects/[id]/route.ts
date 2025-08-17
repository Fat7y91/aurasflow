import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const r = await fetch(`${API_URL}/projects/${params.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Proxy error (GET /projects/:id)' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.text();
    const r = await fetch(`${API_URL}/projects/${params.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body,
    });
    const data = await r.json();
    return NextResponse.json(data, { status: r.status });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Proxy error (PATCH /projects/:id)' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const r = await fetch(`${API_URL}/projects/${params.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    // بعض الـ back-ends بيرجعوا body فنعمل محاولة
    let data: any = null;
    try { data = await r.json(); } catch {}

    return NextResponse.json(data ?? { ok: r.ok }, { status: r.status });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Proxy error (DELETE /projects/:id)' }, { status: 500 });
  }
}
