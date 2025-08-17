import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const res = await fetch(`${API_URL}/projects`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Proxy error (GET /projects)' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.text();
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body,
    });
    
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || 'Proxy error (POST /projects)' }, { status: 500 });
  }
}