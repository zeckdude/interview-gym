import { NextResponse } from 'next/server';
import { z } from 'zod';
import { allQuestions } from '@/data';
import { gradeAnswer } from '@/data/types';
import { requireAuthUser } from '@/lib/ai-auth';
import { questionGradingPrompt } from '@/lib/ai-prompts';
import { AI_MAX_TOKENS, AI_MODEL, requireApiKey } from '@/lib/anthropic';

const requestSchema = z.object({
  questionId: z.string().min(1),
  userAnswer: z.string().min(1),
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

  const question = allQuestions.find((q) => q.id === parsed.data.questionId);
  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }

  const keywordResult = gradeAnswer(parsed.data.userAnswer, question);
  const scorePercent = keywordResult.score * 100;

  // Below 40% — fail immediately, no API call
  if (scorePercent < 40) {
    return NextResponse.json({
      passed: false,
      feedback: `Your answer missed most key concepts. Focus on: ${question.keyTerms.slice(0, 3).join(', ')}.`,
      gradingMethod: 'keyword',
      score: keywordResult.score,
      matchedTerms: keywordResult.matchedTerms,
    });
  }

  // Above 80% — pass immediately, no API call
  if (scorePercent >= 80) {
    return NextResponse.json({
      passed: true,
      feedback: 'Strong answer — you covered the core concepts well.',
      gradingMethod: 'keyword',
      score: keywordResult.score,
      matchedTerms: keywordResult.matchedTerms,
    });
  }

  // 40–80% — hybrid: call Claude for final decision
  try {
    requireApiKey();
  } catch {
    // Fall back to keyword result if no API key
    return NextResponse.json({
      passed: keywordResult.passed,
      feedback: keywordResult.passed
        ? 'Your answer covers enough key concepts.'
        : `Try to include more about: ${question.keyTerms.filter((t) => !keywordResult.matchedTerms.includes(t)).slice(0, 3).join(', ')}.`,
      gradingMethod: 'keyword-fallback',
      score: keywordResult.score,
      matchedTerms: keywordResult.matchedTerms,
    });
  }

  try {
    const { anthropic } = await import('@/lib/anthropic');

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      system: questionGradingPrompt(
        question.question,
        question.modelAnswer,
        parsed.data.userAnswer
      ),
      messages: [
        {
          role: 'user',
          content: 'Grade this answer and respond with JSON only.',
        },
      ],
    });

    const rawText =
      response.content[0]?.type === 'text' ? response.content[0].text : '';

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON in response');
    }

    const aiResult = JSON.parse(jsonMatch[0]) as {
      passed: boolean;
      feedback: string;
    };

    return NextResponse.json({
      passed: aiResult.passed,
      feedback: aiResult.feedback,
      gradingMethod: 'ai',
      score: keywordResult.score,
      matchedTerms: keywordResult.matchedTerms,
    });
  } catch (err) {
    console.error('[grade-question] Error:', err);
    return NextResponse.json({
      passed: keywordResult.passed,
      feedback: keywordResult.passed
        ? 'Your answer covers enough key concepts.'
        : `Try to include more about: ${question.keyTerms.filter((t) => !keywordResult.matchedTerms.includes(t)).slice(0, 3).join(', ')}.`,
      gradingMethod: 'keyword-fallback',
      score: keywordResult.score,
      matchedTerms: keywordResult.matchedTerms,
    });
  }
}
