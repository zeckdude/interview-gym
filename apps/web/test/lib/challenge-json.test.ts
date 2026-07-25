import { describe, expect, it } from 'vitest';
import { extractJsonObject, parseGeneratedChallenge } from '@/lib/challenge-json';

const SAMPLE = {
  title: 'Test',
  category: 'be',
  difficulty: 'easy',
  description: 'desc',
  concepts: ['fs'],
  starterCodeJs: 'module.exports = {}',
  starterCodeTs: 'export {}',
  solutionJs: 'module.exports = {}',
  solutionTs: 'export {}',
  lessonContent: 'lesson',
  miniChallengePrompt: 'prompt',
  difficulty_reasoning: 'easy because...',
};

describe('challenge-json', () => {
  it('extractJsonObject pulls JSON from markdown fences', () => {
    const text = `Here you go:\n\`\`\`json\n${JSON.stringify(SAMPLE)}\n\`\`\``;
    const json = extractJsonObject(text);
    expect(JSON.parse(json).title).toBe('Test');
  });

  it('extractJsonObject ignores preamble text', () => {
    const text = `Sure!\n${JSON.stringify(SAMPLE)}`;
    expect(JSON.parse(extractJsonObject(text)).title).toBe('Test');
  });

  it('throws when no JSON object present', () => {
    expect(() => extractJsonObject('no braces here')).toThrow(/No JSON object/);
  });

  it('throws on truncated JSON', () => {
    expect(() => extractJsonObject('{ "title": "x"')).toThrow(/truncated/);
  });

  it('parseGeneratedChallenge repairs trailing commas', () => {
    const withComma = `{
      "title": "Test",
      "category": "be",
      "difficulty": "easy",
      "description": "desc",
      "concepts": ["fs"],
      "starterCodeJs": "x",
      "starterCodeTs": "x",
      "solutionJs": "x",
      "solutionTs": "x",
      "lessonContent": "x",
      "miniChallengePrompt": "x",
      "difficulty_reasoning": "x",
    }`;
    const parsed = parseGeneratedChallenge(withComma);
    expect(parsed.title).toBe('Test');
  });
});
