import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { getPlaybookContextForUser } from '@/lib/playbook/db';
import { AI_MAX_TOKENS, AI_MODEL, requireApiKey } from '@/lib/anthropic';
import type { VoiceInterviewCategory } from '@/data/voice-interviews';

const requestSchema = z.object({
  question: z.string().min(1),
  category: z.string().min(1),
  transcript: z.string().min(1),
  idealAnswerGuidance: z.string().min(1),
  targetAnswerMinutes: z.number().positive(),
});

interface ScoreResult {
  contentScore: number;
  contentFeedback: string;
  strengths: string[];
  gaps: string[];
  communicationNotes: string;
  recommendedFollowUpType: 'followup' | 'challenge';
}

function parseScoreJson(rawText: string): ScoreResult | null {
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    const parsed = JSON.parse(jsonMatch[0]) as Partial<ScoreResult>;
    if (typeof parsed.contentScore !== 'number' || !parsed.contentFeedback) return null;
    return {
      contentScore: Math.max(0, Math.min(100, Math.round(parsed.contentScore))),
      contentFeedback: parsed.contentFeedback,
      strengths: parsed.strengths ?? [],
      gaps: parsed.gaps ?? [],
      communicationNotes: parsed.communicationNotes ?? '',
      recommendedFollowUpType:
        parsed.recommendedFollowUpType === 'challenge' ? 'challenge' : 'followup',
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

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

  try {
    requireApiKey();
  } catch {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 });
  }

  const { question, category, transcript, idealAnswerGuidance, targetAnswerMinutes } = parsed.data;
  const { criteriaSummary } = await getPlaybookContextForUser(authResult.user.id);

  const scoringPrompt = `You are scoring a voice interview answer.

IMPORTANT: Grade ONLY what the candidate said in their transcript. Do NOT use any pre-written playbook content or planned answers — evaluate their actual spoken response.

Question: ${question}
Category: ${category as VoiceInterviewCategory}
Candidate's answer (transcript): ${transcript}

Candidate's job search goals (use to tailor feedback tone only — NOT for scoring content):
${criteriaSummary}

Ideal answer guidance (private — do not share with candidate):
${idealAnswerGuidance}

Score the answer on TWO dimensions:

1. Content Quality (0-100): Did they actually answer the question well?
   - 90-100: Excellent, specific, well-structured, shows real experience
   - 70-89: Good, covers main points, minor gaps
   - 50-69: Adequate, covers basics but lacks depth or specifics
   - Below 50: Missed key points, vague, or off-topic
   - If the candidate explicitly says they are not answering the question, or pivots to unrelated topics, score below 30

2. Communication Signals (based on transcript analysis):
   - Was the answer structured or rambling?
   - Were there signs of hedging/uncertainty ("I think maybe...", "I'm not sure but...")?
   - Was it appropriately concise (not too short, not too long for a ${targetAnswerMinutes}-minute target)?

Respond with ONLY JSON:
{
  "contentScore": 0-100,
  "contentFeedback": "2-3 sentences of specific feedback on the content",
  "strengths": ["1-2 things they did well"],
  "gaps": ["1-2 specific things that were missing or weak"],
  "communicationNotes": "1 sentence on communication quality from the transcript",
  "recommendedFollowUpType": "followup" | "challenge"
}`;

  try {
    const { anthropic } = await import('@/lib/anthropic');
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      messages: [{ role: 'user', content: scoringPrompt }],
    });

    const rawText =
      response.content[0]?.type === 'text' ? response.content[0].text : '';

    const score = parseScoreJson(rawText);
    if (!score) {
      return NextResponse.json({ error: 'Failed to parse scoring response' }, { status: 500 });
    }

    return NextResponse.json(score);
  } catch (err) {
    console.error('[score-voice-answer] Error:', err);
    return NextResponse.json({ error: 'Failed to score answer' }, { status: 500 });
  }
}
