import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonAi09ChunkDocument: Lesson = {
  id: 'lesson-ai-09-chunk-document',
  title: 'Chunk Text For RAG',
  category: 'fe-ai',
  topLevel: 'fe',
  subcategory: 'ai',
  difficulty: 'easy',
  relatedChallengeIds: ['ai-09-chunk-document'],
  estimatedMinutes: 10,
  concepts: ["RAG"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Chunk Text For RAG** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** RAG
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function chunkText(text, size) {
  const chunks = [];
    for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
    return chunks;
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **RAG**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ai-09-chunk-document',
    prompt: `Implement \`chunkText\` for a common interview scenario.`,
    timeLimitSeconds: 90,
    starterCode: {
      javascript: `function chunkText(text, size) {
  // Implement this function
  
}`,
      typescript: `function chunkText(text: string, size: number) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function chunkText(text, size) {
  const chunks = [];
    for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
    return chunks;
}`,
      typescript: `function chunkText(text: string, size: number) {
  const chunks = [];
    for (let i = 0; i < text.length; i += size) chunks.push(text.slice(i, i + size));
    return chunks;
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'chunkText');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('chunkText', 'return Boolean(JSON.stringify(chunkText("abcdef", 2)) === JSON.stringify(["ab","cd","ef"]))');
        const ok = testRunner(result.value);
        return ok
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — check the requirements and try again.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'Chunk Text For RAG', url: 'https://developer.mozilla.org/' }
  ],
};
