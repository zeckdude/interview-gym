import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface RenderState<T> { data: T | null; loading: boolean; error: Error | null; }

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createDataProvider = getExport<
      <T>(fetchFn: typeof fetch) => {
        render<R>(fn: (s: RenderState<T>) => R): R;
        execute(url: string): Promise<void>;
      }
    >(exports, 'createDataProvider');

    const mockFetch = async () => ({ json: async () => [1, 2, 3] });
    const provider = createDataProvider<number[]>(mockFetch as unknown as typeof fetch);

    // Test 1: render prop called immediately with initial state
    let called = false;
    provider.render((state) => { called = true; return state.loading; });
    const test1 = called;

    // Test 2: after execute, data is available
    const states: Array<RenderState<number[]>> = [];
    provider.render((s) => { states.push(s); return null; });
    await provider.execute('/api/data');
    const finalState = states[states.length - 1];
    const test2 = finalState?.data !== null && finalState?.loading === false;

    // Test 3: render prop receives correct state shape
    const test3 = 'data' in finalState && 'loading' in finalState && 'error' in finalState;

    return {
      passed: test1 && test2 && test3,
      results: [
        { description: 'render() calls renderProp immediately', expected: 'called=true', actual: String(called), passed: test1 },
        { description: 'After execute(), data is set in state', expected: 'data set', actual: `data=${finalState?.data ? 'set' : 'null'}, loading=${finalState?.loading}`, passed: test2 },
        { description: 'RenderState has { data, loading, error } shape', expected: 'all 3 keys present', actual: test3 ? 'correct' : 'missing keys', passed: test3 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
