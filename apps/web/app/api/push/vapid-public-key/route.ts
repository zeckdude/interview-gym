import { NextResponse } from 'next/server';
import { isPushConfigured } from '@/lib/notifications';

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null;
  const configured = isPushConfigured();

  return NextResponse.json({
    configured,
    publicKey: configured ? publicKey : null,
  });
}
