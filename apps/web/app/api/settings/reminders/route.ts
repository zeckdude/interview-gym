import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { prisma } from '@/lib/prisma';

const preferencesSchema = z.object({
  reminderEnabled: z.boolean(),
  reminderFrequency: z.enum(['daily', 'weekly']),
  reminderTime: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.string().min(1),
});

export async function GET() {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const prefs = await prisma.userPreferences.upsert({
      where: { userId: authResult.user.id },
      update: {},
      create: { userId: authResult.user.id },
    });

    return NextResponse.json({
      reminderEnabled: prefs.reminderEnabled,
      reminderFrequency: prefs.reminderFrequency,
      reminderTime: prefs.reminderTime,
      timezone: prefs.timezone,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const body = await req.json();
    const parsed = preferencesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid preferences', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const prefs = await prisma.userPreferences.upsert({
      where: { userId: authResult.user.id },
      update: parsed.data,
      create: {
        userId: authResult.user.id,
        ...parsed.data,
      },
    });

    return NextResponse.json({
      reminderEnabled: prefs.reminderEnabled,
      reminderFrequency: prefs.reminderFrequency,
      reminderTime: prefs.reminderTime,
      timezone: prefs.timezone,
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
