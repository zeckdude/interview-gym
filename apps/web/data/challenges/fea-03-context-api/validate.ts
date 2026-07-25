import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createContext = getExport<<T>(def: T) => {
      Provider: { setValue(v: T): void };
      useContext(): T;
    }>(exports, 'createContext');

    // Test 1: default value
    const ctx = createContext('light');
    const test1 = ctx.useContext() === 'light';

    // Test 2: Provider sets value
    ctx.Provider.setValue('dark');
    const test2 = ctx.useContext() === 'dark';

    // Test 3: can update value
    ctx.Provider.setValue('light');
    const test3 = ctx.useContext() === 'light';

    // Test 4: independent contexts
    const numCtx = createContext(42);
    const test4 = numCtx.useContext() === 42 && ctx.useContext() === 'light';

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'useContext() returns default before Provider', expected: '"light"', actual: String(ctx.useContext()), passed: test1 },
        { description: 'Provider.setValue updates context value', expected: '"dark"', actual: String(test2 ? 'dark' : 'wrong'), passed: test2 },
        { description: 'Value can be updated multiple times', expected: '"light" (after reset)', actual: String(ctx.useContext()), passed: test3 },
        { description: 'Two createContext() calls are independent', expected: 'numCtx=42, strCtx=light', actual: `numCtx=${numCtx.useContext()}, strCtx=${ctx.useContext()}`, passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
