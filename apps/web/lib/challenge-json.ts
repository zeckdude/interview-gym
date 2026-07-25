import type { GeneratedChallengePayload } from '@/lib/user-challenge';

/**
 * Extract the outermost JSON object from model output using brace matching.
 * Handles preamble text and markdown fences better than regex alone.
 */
export function extractJsonObject(text: string): string {
  const trimmed = text.trim();

  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed;

  const start = candidate.indexOf('{');
  if (start === -1) {
    throw new Error('No JSON object found in response');
  }

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < candidate.length; i++) {
    const char = candidate[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\' && inString) {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0) {
        return candidate.slice(start, i + 1);
      }
    }
  }

  throw new Error('JSON object appears truncated or malformed');
}

function tryParse(jsonStr: string): GeneratedChallengePayload {
  return JSON.parse(jsonStr) as GeneratedChallengePayload;
}

/**
 * Attempt to parse challenge JSON with a few lightweight fixes for common model mistakes.
 */
export function parseGeneratedChallenge(text: string): GeneratedChallengePayload {
  const jsonStr = extractJsonObject(text);

  try {
    return tryParse(jsonStr);
  } catch {
    // Remove trailing commas before } or ]
    const withoutTrailingCommas = jsonStr.replace(/,\s*([}\]])/g, '$1');
    return tryParse(withoutTrailingCommas);
  }
}

const REPAIR_PROMPT = `You are a JSON repair tool. The text below was meant to be a single JSON object for a coding challenge generator.

Fix any syntax errors and return ONLY valid JSON — no markdown fences, no explanation.

Required keys:
title, category, difficulty, description, concepts, starterCodeJs, starterCodeTs, solutionJs, solutionTs, lessonContent, miniChallengePrompt, difficulty_reasoning

Preserve the original content as closely as possible. Escape newlines and quotes properly inside JSON strings.`;

export async function repairGeneratedChallengeJson(
  raw: string,
  anthropic: import('@anthropic-ai/sdk').default,
  model: string
): Promise<GeneratedChallengePayload> {
  const response = await anthropic.messages.create({
    model,
    max_tokens: 8192,
    system: REPAIR_PROMPT,
    messages: [
      {
        role: 'user',
        content: raw.slice(0, 60000),
      },
    ],
  });

  const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
  if (!text) {
    throw new Error('Empty repair response from AI');
  }

  return parseGeneratedChallenge(text);
}
