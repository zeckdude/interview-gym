import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSystemDesignChallengeById } from '@/data/system-design';
import type { SystemDesignSectionGrade } from '@/data/types';
import { requireAuthUser } from '@/lib/ai-auth';
import { AI_MAX_TOKENS, AI_MODEL, requireApiKey } from '@/lib/anthropic';

const requestSchema = z.object({
  challengeId: z.string().min(1),
  sectionId: z.string().min(1),
  sectionAnswer: z.string().min(1),
});

function parseGradeJson(rawText: string): SystemDesignSectionGrade | null {
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    const parsed = JSON.parse(jsonMatch[0]) as {
      score?: number;
      feedback?: string;
      strengths?: string[];
      gaps?: string[];
      firstFollowUpQuestion?: string;
    };
    if (typeof parsed.score !== 'number' || !parsed.feedback) return null;
    return {
      sectionId: '',
      score: Math.max(0, Math.min(100, Math.round(parsed.score))),
      feedback: parsed.feedback,
      strengths: parsed.strengths ?? [],
      gaps: parsed.gaps ?? [],
      firstFollowUpQuestion: parsed.firstFollowUpQuestion,
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

  const challenge = getSystemDesignChallengeById(parsed.data.challengeId);
  if (!challenge) {
    return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
  }

  const section = challenge.sections.find((s) => s.id === parsed.data.sectionId);
  if (!section) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 });
  }

  try {
    requireApiKey();
  } catch {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 });
  }

  const gradingPrompt = `You are a senior staff engineer grading a system design interview response.

Challenge: ${challenge.title}
Scenario: ${challenge.scenario}

Grade this section on a scale of 0-100 and provide specific feedback.

Section: ${section.label}
Scoring criteria: ${section.scoringCriteria}
User's answer: ${parsed.data.sectionAnswer}

Respond with ONLY JSON:
{
  "score": 0-100,
  "feedback": "2-3 sentences of specific feedback",
  "strengths": ["what they got right"],
  "gaps": ["what they missed or got wrong"],
  "firstFollowUpQuestion": "the most important follow-up question to ask based on their answer"
}`;

  try {
    const { anthropic } = await import('@/lib/anthropic');

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      messages: [{ role: 'user', content: gradingPrompt }],
    });

    const rawText =
      response.content[0]?.type === 'text' ? response.content[0].text : '';

    const grade = parseGradeJson(rawText);
    if (!grade) {
      return NextResponse.json({ error: 'Failed to parse grading response' }, { status: 500 });
    }

    return NextResponse.json({
      ...grade,
      sectionId: section.id,
    });
  } catch (err) {
    console.error('[grade-system-design] Error:', err);
    return NextResponse.json({ error: 'Failed to grade section' }, { status: 500 });
  }
}
