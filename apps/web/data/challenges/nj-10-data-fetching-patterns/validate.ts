import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface User { id: string; name: string; }
interface Stats { visits: number; }

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const loadDashboardData = getExport<(userId: string) => Promise<{ user: User; stats: Stats }>>(
      exports,
      'loadDashboardData'
    );
    const resetLog = getExport<() => void>(exports, 'resetLog');
    const getLog = getExport<() => string[]>(exports, 'getLog');

    resetLog();
    const result = await loadDashboardData('user-1');

    const test1 = result.user?.id === 'user-1' && result.user?.name === 'Ada Lovelace';
    const test2 = result.stats?.visits === 1024;

    const log = getLog();
    const userEndIdx = log.indexOf('user:end');
    const statsStartIdx = log.indexOf('stats:start');
    const test3 = statsStartIdx !== -1 && userEndIdx !== -1 && statsStartIdx < userEndIdx;

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'Returns the fetched user', expected: '{ id: "user-1", name: "Ada Lovelace" }', actual: JSON.stringify(result.user), passed: test1 },
        { description: 'Returns the fetched stats', expected: '{ visits: 1024 }', actual: JSON.stringify(result.stats), passed: test2 },
        { description: 'getStats() starts before getUser() finishes (ran in parallel)', expected: 'stats:start before user:end', actual: log.join(' → '), passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
