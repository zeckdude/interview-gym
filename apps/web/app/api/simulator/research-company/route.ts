import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuthUser } from '@/lib/ai-auth';
import { getPlaybookContextForUser } from '@/lib/playbook/db';
import { AI_MAX_TOKENS, AI_MODEL, requireApiKey } from '@/lib/anthropic';
import { prisma } from '@/lib/prisma';

const requestSchema = z.object({
  companyName: z.string().optional(),
  companyWebsite: z.string().optional(),
  jobListingUrl: z.string().optional(),
  jobListingText: z.string().optional(),
  additionalNotes: z.string().optional(),
  contextId: z.string().optional(),
});

interface CompanyResearchResult {
  summary: string;
  recentNews: string[];
  culture: string;
  techStack: string[];
  differentiators: string[];
  tailoredQuestions: string[];
}

function parseResearchJson(rawText: string): CompanyResearchResult | null {
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]) as CompanyResearchResult;
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

  if (!parsed.data.companyName && !parsed.data.companyWebsite && !parsed.data.jobListingText) {
    return NextResponse.json(
      { error: 'Provide at least a company name, website, or job listing text' },
      { status: 400 }
    );
  }

  try {
    requireApiKey();
  } catch {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 });
  }

  const { companyName, companyWebsite, jobListingUrl, jobListingText, additionalNotes, contextId } =
    parsed.data;

  const researchPrompt = `Research this company for an interview candidate who will be interviewing there.

Company: ${companyName ?? 'not provided'}
Website: ${companyWebsite ?? 'not provided'}
Job listing: ${jobListingText ?? jobListingUrl ?? 'not provided'}
Additional notes: ${additionalNotes ?? 'none'}

Search for and compile:
1. What the company does (product, customers, market)
2. Recent news (funding, launches, leadership changes, press)
3. Company culture and values (from their website, Glassdoor, etc.)
4. The tech stack they use
5. What makes them distinctive vs competitors
6. Any red flags or concerns worth knowing

Then based on all of the above, generate 5-8 interview questions they are likely to ask the candidate
about why they want to work there and how they fit the role.

Format as JSON:
{
  "summary": "3-4 sentence company overview",
  "recentNews": ["bullet points of recent notable news"],
  "culture": "what the culture seems like",
  "techStack": ["their known technologies"],
  "differentiators": ["what makes them unique"],
  "tailoredQuestions": ["5-8 questions specific to this company and role"]
}`;

  try {
    const { anthropic } = await import('@/lib/anthropic');
    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS * 2,
      tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
      messages: [{ role: 'user', content: researchPrompt }],
    });

    const textBlocks = response.content.filter((b) => b.type === 'text');
    const rawText = textBlocks.map((b) => (b.type === 'text' ? b.text : '')).join('\n');

    const research = parseResearchJson(rawText);
    if (!research) {
      return NextResponse.json({ error: 'Failed to parse research response' }, { status: 500 });
    }

    const researchSummary = [
      research.summary,
      '',
      'Recent news:',
      ...research.recentNews.map((n) => `• ${n}`),
      '',
      `Culture: ${research.culture}`,
      '',
      `Tech stack: ${research.techStack.join(', ')}`,
      '',
      'Differentiators:',
      ...research.differentiators.map((d) => `• ${d}`),
      '',
      'Tailored questions:',
      ...research.tailoredQuestions.map((q) => `• ${q}`),
    ].join('\n');

    let context;
    if (contextId) {
      const existing = await prisma.simulatorCompanyContext.findFirst({
        where: { id: contextId, userId: authResult.user.id },
      });
      if (!existing) {
        return NextResponse.json({ error: 'Company context not found' }, { status: 404 });
      }
      context = await prisma.simulatorCompanyContext.update({
        where: { id: contextId },
        data: {
          companyName,
          companyWebsite,
          jobListingUrl,
          jobListingText,
          additionalNotes,
          researchSummary,
          researchedAt: new Date(),
        },
      });
    } else {
      context = await prisma.simulatorCompanyContext.create({
        data: {
          userId: authResult.user.id,
          companyName,
          companyWebsite,
          jobListingUrl,
          jobListingText,
          additionalNotes,
          researchSummary,
          researchedAt: new Date(),
        },
      });
    }

    return NextResponse.json({ research, researchSummary, contextId: context.id });
  } catch (err) {
    console.error('[research-company] Error:', err);
    return NextResponse.json({ error: 'Failed to research company' }, { status: 500 });
  }
}
