import { NextResponse } from 'next/server';
import {
  getOpsSessionToken,
  OPS_COOKIE_NAME,
  verifyOpsPassword,
} from '@/lib/ops-auth';

export async function POST(req: Request) {
  if (!process.env.OPS_PASSWORD) {
    return NextResponse.json(
      { error: 'OPS_PASSWORD is not configured' },
      { status: 503 }
    );
  }

  const body = (await req.json()) as { password?: string };
  if (!body.password || !verifyOpsPassword(body.password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = getOpsSessionToken();
  if (!token) {
    return NextResponse.json({ error: 'Auth unavailable' }, { status: 503 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(OPS_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(OPS_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
