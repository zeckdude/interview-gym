import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { getPlaybookContextForUser } from '@/lib/playbook/db';
import { AI_MODEL, requireApiKey } from '@/lib/anthropic';

const exchangeSchema = z.object({
  questionText: z.string(),
  answerTranscript: z.string().nullable().optional(),
  aiContentScore: z.number().nullable().optional(),
  fillerWordCount: z.number().nullable().optional(),
  wordsPerMinute: z.number().nullable().optional(),
  deepgramConfidence: z.number().nullable().optional(),
});

const requestSchema = z.object({
  category: z.string().min(1),
  exchanges: z.array(exchangeSchema).min(1),
  avgContentScore: z.number(),
  totalFillerWords: z.number(),
  avgWPM: z.number(),
});

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

  const { category, exchanges, avgContentScore, totalFillerWords, avgWPM } = parsed.data;
  const { criteriaSummary } = await getPlaybookContextForUser(authResult.user.id);

  const exchangeScores = exchanges.map((e, i) => ({
    question: e.questionText.slice(0, 80),
    contentScore: e.aiContentScore ?? 0,
    index: i + 1,
  }));

  const answeredExchanges = exchanges.filter((e) => e.answerTranscript?.trim());

  const transcriptSection =
    answeredExchanges.length > 0
      ? answeredExchanges
          .map((e, i) => {
            const meta = [
              e.fillerWordCount != null ? `${e.fillerWordCount} filler words` : null,
              e.wordsPerMinute != null ? `${Math.round(e.wordsPerMinute)} WPM` : null,
              e.deepgramConfidence != null
                ? `confidence ${e.deepgramConfidence.toFixed(2)}`
                : null,
              e.aiContentScore != null ? `content score ${e.aiContentScore}/100` : null,
            ]
              .filter(Boolean)
              .join(' · ');

            return `### Answer ${i + 1}
Question: ${e.questionText}
${meta ? `Signals: ${meta}` : ''}
Transcript (what the candidate actually said):
"""
${e.answerTranscript!.trim()}
"""`;
          })
          .join('\n\n')
      : '(No answer transcripts were recorded for this session.)';

  const feedbackPrompt = `You are a senior engineering interview coach providing feedback after a mock interview.

IMPORTANT: Base feedback ONLY on what the candidate actually said in the transcripts below — never reference pre-written playbook answers or invent details not in the transcript.

Candidate's job search goals (tailor coaching to these roles):
${criteriaSummary}

Interview summary:
- Category: ${category}
- Questions asked: ${exchanges.length}
- Overall content score: ${Math.round(avgContentScore)}
- Total filler words: ${totalFillerWords} across ${answeredExchanges.length} answers
- Average WPM: ${Math.round(avgWPM)} (ideal: 130-160 for interviews)

Individual answer scores: ${JSON.stringify(exchangeScores)}

---

CANDIDATE ANSWER TRANSCRIPTS (ground all feedback in these):

${transcriptSection}

---

Provide a coaching debrief in this exact format:

**What you did well:** (2-3 specific things — cite phrases or points from the transcripts)
**Where to improve:** (2-3 specific, actionable things with examples from their actual answers)
**Communication:** (1-2 sentences on filler words, pace, and clarity)
**Focus for next time:** (1 specific thing to practice before the next session)

Be direct, specific, and encouraging. Quote or paraphrase their actual words where helpful.
Keep it under 250 words.`;

  try {
    const { anthropic } = await import('@/lib/anthropic');
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 2048,
      messages: [{ role: 'user', content: feedbackPrompt }],
    });

    const feedback =
      response.content[0]?.type === 'text' ? response.content[0].text.trim() : '';

    if (!feedback) {
      return NextResponse.json({ error: 'Empty feedback response' }, { status: 500 });
    }

    return NextResponse.json({ feedback });
  } catch (err) {
    console.error('[voice-interview-feedback] Error:', err);
    return NextResponse.json({ error: 'Failed to generate feedback' }, { status: 500 });
  }
}
