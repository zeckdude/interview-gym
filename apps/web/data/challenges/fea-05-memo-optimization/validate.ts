import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

type Props = Record<string, unknown>;

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createMemoComponent = getExport<
      <T extends Props, R>(fn: (p: T) => R, eq?: (a: T, b: T) => boolean) => { render(p: T): R }
    >(exports, 'createMemoComponent');
    const shallowEqual = getExport<(a: Props, b: Props) => boolean>(exports, 'shallowEqual');

    // Test 1: shallowEqual works correctly
    const test1a = shallowEqual({ a: 1 }, { a: 1 }) === true;
    const test1b = shallowEqual({ a: 1 }, { a: 2 }) === false;
    const test1 = test1a && test1b;

    // Test 2: skips re-render for same props
    let count = 0;
    const comp = createMemoComponent((props: { label: string }) => { count++; return props.label; });
    comp.render({ label: 'hi' });
    comp.render({ label: 'hi' });
    const test2 = count === 1;

    // Test 3: re-renders when props change
    comp.render({ label: 'bye' });
    const test3 = count === 2;

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'shallowEqual returns true for same values, false for different', expected: 'true/false', actual: `${test1a}/${test1b}`, passed: test1 },
        { description: 'Same props: renderFn called only once (skips re-render)', expected: '1 call', actual: `${count} call(s)`, passed: test2 },
        { description: 'Changed props: renderFn called again', expected: '2 calls total', actual: `${count} calls`, passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
