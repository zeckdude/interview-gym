/**
 * Quick validation test for the 5 BE challenges.
 * Run: npx tsx apps/web/scripts/test-challenges.ts
 */
import { beChallenges } from '../data/be-challenges';
import { prepareCodeForExecution } from '../lib/code-runner';

async function runTests() {
  const active = beChallenges.filter((c) => !c.comingSoon);
  let allPassed = true;

  for (const challenge of active) {
    for (const lang of ['javascript', 'typescript'] as const) {
      const code = prepareCodeForExecution(challenge.solution[lang], lang);
      const result = await challenge.validate(code, lang);
      const status = result.passed ? '✓' : '✗';
      console.log(`${status} ${challenge.id} (${lang}): ${result.passed ? 'PASS' : 'FAIL'}`);
      if (!result.passed) {
        allPassed = false;
        console.log('  Results:', result.results);
      }
    }
  }

  process.exit(allPassed ? 0 : 1);
}

runTests();
