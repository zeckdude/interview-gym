import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const debounce = getExport<
      (fn: (...args: unknown[]) => void, delay: number) => (...args: unknown[]) => void
    >(exports, 'debounce');

    let count = 0;
    let lastArg = '';
    const d = debounce((q: unknown) => { count++; lastArg = String(q); }, 80);

    d('a');
    d('ab');
    d('abc');
    const immediateCount = count;
    await sleep(120);
    const afterCount = count;
    const test1 = immediateCount === 0 && afterCount === 1 && lastArg === 'abc';

    // Test: only last call executes
    count = 0;
    d('x');
    d('xy');
    d('xyz');
    await sleep(120);
    const test2 = count === 1 && lastArg === 'xyz';

    return {
      passed: test1 && test2,
      results: [
        { description: 'Does not call fn on rapid calls (0 immediate)', expected: '0 immediate, 1 after delay, arg="abc"', actual: `immediate=${immediateCount}, after=${afterCount}, arg="${lastArg}"`, passed: test1 },
        { description: 'Only the last call in a burst executes', expected: 'arg="xyz"', actual: `count=${count}, arg="${lastArg}"`, passed: test2 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
