import { NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  concept: z.string().min(1),
  challengeContext: z.string().min(1),
});

const SYSTEM_PROMPT = (concept: string, challengeContext: string) => `You are explaining a programming concept to a frontend developer (React/JS background) who is learning backend and Node.js concepts. They are beginner-to-intermediate on the backend. Assume they know JavaScript well, but may be unfamiliar with Node.js APIs, server-side patterns, and backend terminology.

Concept: ${concept}
Challenge context: ${challengeContext}

Respond with ONLY a raw JSON object — no markdown fences, no preamble, no trailing text. The JSON must have these exact fields:

{
  "explanation": "2-3 sentences. Plain everyday English. If this is a Node.js/backend concept, relate it to something a frontend developer would already know. If you use a technical term, define it immediately in the same sentence.",
  "parameters": [
    { "name": "paramName", "type": "string", "description": "Plain-English description of what to pass in. If the type is unfamiliar, briefly explain what it is.", "required": true }
  ],
  "returns": { "type": "string[]", "description": "Plain-English description of what comes back. If the return type name is unfamiliar, explain what it actually is in simple terms rather than using the jargon name.", "learnMoreUrl": "https://nodejs.org/api/fs.html#class-fsdirent", "learnMoreLabel": "Node.js Docs — fs.Dirent" },
  "proTips": ["One concrete tip directly useful for solving this specific challenge.", "One common mistake a frontend developer would make with this concept, and how to avoid it."],
  "approaches": [
    {
      "name": "Short name for this approach, e.g. 'Synchronous' or 'Async/Await'. Do NOT include words like 'recommended' or 'best' — that is handled by the UI.",
      "codeSnippet": "5-10 line runnable example. Add a comment on any line that might be unfamiliar to a frontend dev.",
      "language": "javascript",
      "pros": ["One concrete advantage of this approach"],
      "cons": ["One concrete disadvantage of this approach"]
    }
  ],
  "recommendedApproach": "The exact value of the 'name' field of the single best approach. Must match exactly.",
  "recommendation": "Why you recommend that approach for this challenge, in 1-2 plain-English sentences.",
  "resourceUrl": "The single best URL — MDN for web/JS, nodejs.org/api for Node built-ins, react.dev for React.",
  "resourceLabel": "Short label e.g. 'MDN — Array.prototype.join()'"
}

Rules:
- "parameters" and "returns": only include if this concept is a callable function/method. For general concepts (e.g. "event loop", "closure"), set both to null.
- "returns.learnMoreUrl" and "returns.learnMoreLabel": include ONLY when the return type is a non-primitive class or object type (e.g. Dirent, Buffer, EventEmitter, Promise — NOT string, number, boolean, void, null, string[], number[]). Set both to null otherwise. learnMoreUrl must be a real, valid documentation URL.
- "approaches": include ALL meaningfully different ways to accomplish the task with this concept (typically 2-3). Each must have a distinct name, working code, and honest pros/cons. Limit each pros/cons array to 1-2 items.
- "proTips": always exactly 2 items.
- Never use unexplained backend jargon. Write as if talking to a smart frontend developer, not a backend engineer.
- Keep every field concise. This renders in a narrow sidebar.`;

interface ConceptParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

interface ConceptReturn {
  type: string;
  description: string;
  learnMoreUrl?: string | null;
  learnMoreLabel?: string | null;
}

interface CodeApproach {
  name: string;
  codeSnippet: string;
  language: 'javascript' | 'typescript';
  pros: string[];
  cons: string[];
}

export interface ConceptExplanation {
  explanation: string;
  parameters: ConceptParameter[] | null;
  returns: ConceptReturn | null;
  proTips: [string, string];
  approaches: CodeApproach[];
  recommendedApproach: string;
  recommendation: string;
  resourceUrl: string;
  resourceLabel: string;
  _placeholder?: true;
}

function placeholderResponse(concept: string): ConceptExplanation {
  return {
    explanation: `${concept} is a programming concept used in JavaScript/TypeScript development. Add your ANTHROPIC_API_KEY to .env.local to get AI-powered explanations.`,
    parameters: null,
    returns: null,
    proTips: [
      'Add ANTHROPIC_API_KEY to .env.local to get real tips.',
      'Restart the dev server after adding the key.',
    ],
    approaches: [
      {
        name: 'Example',
        codeSnippet: `// Example for: ${concept}\n// Add ANTHROPIC_API_KEY to .env.local\n// to get real explanations and code samples.`,
        language: 'javascript',
        pros: ['Simple'],
        cons: ['Requires API key'],
      },
    ],
    recommendedApproach: 'Example',
    recommendation: 'Add your ANTHROPIC_API_KEY to .env.local to get a real recommendation.',
    resourceUrl: `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(concept)}`,
    resourceLabel: `MDN Search — ${concept}`,
    _placeholder: true,
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
    return NextResponse.json(placeholderResponse(concept));
  }

  try {
    const { Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 2048,
      messages: [{ role: 'user', content: SYSTEM_PROMPT(concept, challengeContext) }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    const text = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim();
    const data = JSON.parse(text) as ConceptExplanation;
    return NextResponse.json(data);
  } catch (err) {
    console.error('[concept-explanation] Error:', err);
    return NextResponse.json(placeholderResponse(concept));
  }
}
