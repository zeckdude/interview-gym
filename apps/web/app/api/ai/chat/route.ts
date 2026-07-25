import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getClerkUserEmail } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// ── GET /api/ai/chat?challengeId=xxx ─────────────────────────────────────────
export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const challengeId = searchParams.get('challengeId');
  if (!challengeId) return NextResponse.json({ error: 'Missing challengeId' }, { status: 400 });

  const clerkUser = await currentUser();
  const email = getClerkUserEmail(clerkUser);
  if (!email) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: { clerkId: userId, email },
  });

  const messages = await prisma.chatMessage.findMany({
    where: { userId: user.id, challengeId },
    orderBy: { createdAt: 'asc' },
    select: { id: true, role: true, content: true, createdAt: true },
  });

  return NextResponse.json({ messages });
}

// ── POST /api/ai/chat ─────────────────────────────────────────────────────────
const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const requestSchema = z.object({
  challengeId: z.string().min(1),
  messages: z.array(messageSchema).min(1),
  challengeTitle: z.string(),
  challengeDescription: z.string(),
  currentCode: z.string(),
  language: z.string(),
});

const SYSTEM_PROMPT = (
  challengeTitle: string,
  challengeDescription: string,
  currentCode: string,
  language: string
) => `You are a friendly, encouraging coding tutor inside Interview Gym — an interactive coding challenge platform.

The student is working on this challenge:
**${challengeTitle}**

Challenge description:
${challengeDescription}

Their current ${language} code:
\`\`\`${language}
${currentCode || "(empty — they haven't written anything yet)"}
\`\`\`

Your role:
- Help them understand concepts and debug their code
- Guide them toward the solution — don't just hand it to them directly
- If they ask for a hint, give a small nudge, not the full answer
- If they ask "what's wrong?", point out the issue clearly but let them fix it
- Be concise — responses render in a narrow sidebar
- The student is a frontend developer (React/JS background) learning backend/Node.js — relate concepts to things they know from the frontend when possible
- Be warm and encouraging, not dry or robotic`;

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { challengeId, messages, challengeTitle, challengeDescription, currentCode, language } =
    parsed.data;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 });
  }

  // Resolve DB user
  const clerkUser = await currentUser();
  const email = getClerkUserEmail(clerkUser);
  if (!email) return NextResponse.json({ error: 'User email not found' }, { status: 400 });

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email },
    create: { clerkId: userId, email },
  });

  // Save the new user message (last item in the messages array)
  const newUserMessage = messages[messages.length - 1];
  const savedUserMsg = await prisma.chatMessage.create({
    data: {
      userId: user.id,
      challengeId,
      role: newUserMessage.role,
      content: newUserMessage.content,
    },
  });

  try {
    const { Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey });

    const stream = client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT(challengeTitle, challengeDescription, currentCode, language),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    let assistantMsgId: string | null = null;

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let accumulated = '';
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              accumulated += chunk.delta.text;
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
          // Save the complete assistant response to DB
          const saved = await prisma.chatMessage.create({
            data: {
              userId: user.id,
              challengeId,
              role: 'assistant',
              content: accumulated,
            },
          });
          assistantMsgId = saved.id;
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        // Client uses this to reconcile the saved user message ID
        'X-User-Message-Id': savedUserMsg.id,
      },
    });
  } catch (err) {
    console.error('[chat] Error:', err);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
