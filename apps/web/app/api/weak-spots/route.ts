import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/ai-auth';
import { getWeakSpotMap } from '@/lib/weak-spots';

export async function GET() {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const weakSpots = await getWeakSpotMap(authResult.user.id);

  return NextResponse.json({ weakSpots });
}
