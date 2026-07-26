import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonNj30ValidateSegmentConfig: Lesson = {
  id: 'lesson-nj-30-validate-segment-config',
  title: 'Validate Segment Config',
  category: 'nextjs',
  topLevel: 'fe',
  subcategory: 'nextjs',
  difficulty: 'advanced',
  relatedChallengeIds: ['nj-30-validate-segment-config'],
  estimatedMinutes: 10,
  concepts: ["route config","validation","App Router"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Validate Segment Config** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** route config, validation, App Router
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function validateSegmentConfig(config) {
  const errors = [];
    if (config.dynamic != null && !['auto', 'force-dynamic', 'error', 'force-static'].includes(config.dynamic)) {
      errors.push('Invalid dynamic value');
    }
    if (config.revalidate != null && (typeof config.revalidate !== 'number' || config.revalidate < 0)) {
      errors.push('revalidate must be a non-negative number');
    }
    if (config.runtime != null && !['nodejs', 'edge'].includes(config.runtime)) {
      errors.push('Invalid runtime');
    }
    return { valid: errors.length === 0, errors };
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **route config**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-nj-30-validate-segment-config',
    prompt: `Implement \`validateSegmentConfig(config)\` — validate route segment config options and return errors.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function validateSegmentConfig(config) {
  // Implement this function
  
}`,
      typescript: `function validateSegmentConfig(config: { dynamic?: string; revalidate?: number; runtime?: string }) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function validateSegmentConfig(config) {
  const errors = [];
    if (config.dynamic != null && !['auto', 'force-dynamic', 'error', 'force-static'].includes(config.dynamic)) {
      errors.push('Invalid dynamic value');
    }
    if (config.revalidate != null && (typeof config.revalidate !== 'number' || config.revalidate < 0)) {
      errors.push('revalidate must be a non-negative number');
    }
    if (config.runtime != null && !['nodejs', 'edge'].includes(config.runtime)) {
      errors.push('Invalid runtime');
    }
    return { valid: errors.length === 0, errors };
}`,
      typescript: `function validateSegmentConfig(config: { dynamic?: string; revalidate?: number; runtime?: string }) {
  const errors = [];
    if (config.dynamic != null && !['auto', 'force-dynamic', 'error', 'force-static'].includes(config.dynamic)) {
      errors.push('Invalid dynamic value');
    }
    if (config.revalidate != null && (typeof config.revalidate !== 'number' || config.revalidate < 0)) {
      errors.push('revalidate must be a non-negative number');
    }
    if (config.runtime != null && !['nodejs', 'edge'].includes(config.runtime)) {
      errors.push('Invalid runtime');
    }
    return { valid: errors.length === 0, errors };
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'validateSegmentConfig');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('validateSegmentConfig', `return Boolean(JSON.stringify(validateSegmentConfig({"dynamic":"force-static","revalidate":60,"runtime":"edge"})) === JSON.stringify({"valid":true,"errors":[]}));`);
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
    { label: 'Validate Segment Config', url: 'https://developer.mozilla.org/' }
  ],
};
