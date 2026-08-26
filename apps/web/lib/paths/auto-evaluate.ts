import { AI_MODEL, anthropic, requireApiKey } from '@/lib/anthropic';
import { prisma } from '@/lib/prisma';
import type { PathType } from '@/lib/paths/types';

interface EvaluationItem {
  id: string;
  type: 'challenge' | 'lesson' | 'question';
  title: string;
  description: string;
  concepts: string[];
  difficulty: string;
  category: string;
}

interface Placement {
  pathType: PathType;
  stage: 1 | 2 | 3;
  mostAsked: boolean;
  order: number;
  reasoning: string;
}

interface EvaluationResult {
  placements: Placement[];
}

function buildEvaluationPrompt(item: EvaluationItem): string {
  return `
You are curating a learning path for senior frontend engineers preparing for technical interviews.

A new piece of content has been added to Interview Gym:

Title: ${item.title}
Type: ${item.type} (challenge / lesson / conceptual question)
Category: ${item.category}
Difficulty: ${item.difficulty}
Concepts covered: ${item.concepts.join(', ')}
Description: ${item.description}

Your job is to determine where this content belongs in the curated learning paths.

The three paths are:
- "fe": Frontend Only path (React, Next.js, CSS, browser APIs, FE architecture)
- "be": Backend Only path (Node.js, databases, APIs, server architecture)
- "fullstack": Full Stack path (high-value items that apply to both, or are critical for full-stack interviews)

The three stages are:
- Stage 1 "Pass a Phone Screen": fundamentals, concepts a recruiter or hiring manager would probe
- Stage 2 "Pass a Technical Round": depth, production patterns, trade-offs a senior engineer interviewer expects
- Stage 3 "Pass a System Design Round": architecture, scaling, system design thinking

Determine:
1. Which path(s) this content belongs in (can be multiple)
2. Which stage within each path
3. Whether it should be marked mostAsked (true only if this is a genuinely common real interview topic)
4. A suggested order position within the stage (estimate based on complexity relative to other items)
5. Your reasoning in one sentence

Respond with ONLY JSON:
{
  "placements": [
    {
      "pathType": "fe" | "be" | "fullstack",
      "stage": 1 | 2 | 3,
      "mostAsked": true | false,
      "order": number,
      "reasoning": "one sentence explanation"
    }
  ]
}

If the content doesn't belong in any curated path (too niche, too advanced for interview prep, or already well-covered),
return { "placements": [] }.
`.trim();
}

async function callClaudeForEvaluation(item: EvaluationItem): Promise<EvaluationResult> {
  requireApiKey();

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: buildEvaluationPrompt(item) }],
  });

  const text = response.content[0]?.type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { placements: [] };
  }

  try {
    return JSON.parse(jsonMatch[0]) as EvaluationResult;
  } catch {
    return { placements: [] };
  }
}

export async function evaluateAndSlotContent(item: EvaluationItem): Promise<void> {
  try {
    const evaluation = await callClaudeForEvaluation(item);

    for (const placement of evaluation.placements) {
      if (!['fe', 'be', 'fullstack'].includes(placement.pathType)) continue;
      if (![1, 2, 3].includes(placement.stage)) continue;

      await prisma.pathStageItem.upsert({
        where: {
          pathType_itemId: { pathType: placement.pathType, itemId: item.id },
        },
        create: {
          pathType: placement.pathType,
          stage: placement.stage,
          itemId: item.id,
          itemType: item.type,
          mostAsked: placement.mostAsked,
          order: placement.order,
          aiEvaluated: true,
          aiReasoning: placement.reasoning,
        },
        update: {
          stage: placement.stage,
          mostAsked: placement.mostAsked,
          aiReasoning: placement.reasoning,
        },
      });
    }
  } catch (err) {
    console.error('[paths/auto-evaluate] Failed to evaluate content:', err);
  }
}

export function evaluateAndSlotContentAsync(item: EvaluationItem): void {
  void evaluateAndSlotContent(item);
}
