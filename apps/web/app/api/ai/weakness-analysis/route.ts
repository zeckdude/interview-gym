import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/ai-auth';
import { AI_MAX_TOKENS, AI_MODEL, requireApiKey } from '@/lib/anthropic';
import { buildWeaknessAnalysisInput } from '@/lib/leaderboard';

export async function POST() {
  const authResult = await requireAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    requireApiKey();
  } catch {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 });
  }

  const input = await buildWeaknessAnalysisInput(authResult.user.id);

  const analysisPrompt = `
You are a technical interview coach reviewing a senior frontend engineer's practice data.

Here is their performance summary:
- Total challenges attempted: ${input.totalAttempts}
- Pass rate: ${input.passRate}%
- Category breakdown: ${JSON.stringify(input.byCategory)}
- Weak spots (5+ failures): ${input.weakSpots.map((w) => w.challengeTitle).join(', ') || 'none yet'}
- Strongest category: ${input.strongestCategory}
- Weakest category: ${input.weakestCategory}
- Simulator pass rate: ${input.simulatorPassRate}%
- Regular pass rate: ${input.regularPassRate}%
- Recent trend: ${input.recentTrend} (improving/declining/stable)

Based on this data, provide:
1. Their top 3 specific weaknesses to focus on RIGHT NOW (be specific — name the concept, not just "backend")
2. Their top 2 genuine strengths they can lean on in interviews
3. One specific 3-day practice plan (what to do today, tomorrow, day after)

Format as clean sections with brief bullet points. Be specific, direct, and encouraging.
Keep it under 200 words total.

Use this exact structure:
## Weaknesses
- ...
## Strengths
- ...
## 3-Day Plan
- Today: ...
- Tomorrow: ...
- Day after: ...
`;

  try {
    const { anthropic } = await import('@/lib/anthropic');

    const message = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      messages: [{ role: 'user', content: analysisPrompt }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    const analysis = textBlock?.type === 'text' ? textBlock.text : '';

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error('[weakness-analysis] Error:', err);
    return NextResponse.json({ error: 'Failed to generate analysis' }, { status: 500 });
  }
}
