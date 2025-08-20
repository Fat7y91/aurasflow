import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasCookie: !!globalThis?.Headers, // just to avoid TS noise
    note: 'Open Application → Cookies to be sure; this route just shows cookie presence at server.',
  });
}