import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  concept: z.string().min(1),
  challengeContext: z.string().min(1),
});

const SYSTEM_PROMPT = (concept: string, challengeContext: string) => `You are a concise technical educator explaining a programming concept to a senior frontend engineer doing interview prep.

Concept: ${concept}
Challenge context: ${challengeContext}

Respond with ONLY a JSON object (no markdown, no preamble):
{
  "explanation": "2-3 sentences explaining what this concept is and when you use it. Plain English, no jargon unless necessary.",
  "codeSnippet": "A short, runnable code example (5-10 lines max) showing the concept in action. Use modern JS/TS syntax.",
  "language": "javascript",
  "resourceUrl": "The single best URL to learn more — MDN for web/JS concepts, nodejs.org/api for Node built-ins, react.dev for React concepts. Choose the most authoritative source.",
  "resourceLabel": "Short human-readable label for the link, e.g. 'MDN — Array.prototype.join()' or 'Node.js Docs — fs.readdirSync'"
}`;

interface ConceptExplanation {
  explanation: string;
  codeSnippet: string;
  language: 'javascript' | 'typescript';
  resourceUrl: string;
  resourceLabel: string;
}

function placeholderResponse(concept: string): ConceptExplanation {
  return {
    explanation: `${concept} is a programming concept used in JavaScript/TypeScript development. Add your ANTHROPIC_API_KEY to .env.local to get AI-powered explanations.`,
    codeSnippet: `// Example for: ${concept}\n// Add ANTHROPIC_API_KEY to .env.local\n// to get real explanations and code samples.`,
    language: 'javascript',
    resourceUrl: `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(concept)}`,
    resourceLabel: `MDN Search — ${concept}`,
  };
}

export async function POST(request: Request) {
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

  const { concept, challengeContext } = parsed.data;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Phase 5 will add the API key — return placeholder content for now
    return NextResponse.json(placeholderResponse(concept));
  }

  try {
    const { Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: SYSTEM_PROMPT(concept, challengeContext),
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const data = JSON.parse(text) as ConceptExplanation;
    return NextResponse.json(data);
  } catch (err) {
    console.error('Concept explanation error:', err);
    return NextResponse.json(placeholderResponse(concept));
  }
}
