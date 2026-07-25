import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface RouteConfig {
  dynamic?: 'auto' | 'force-dynamic' | 'force-static';
  usesCookies?: boolean;
  usesHeaders?: boolean;
  usesSearchParams?: boolean;
  fetchCache?: 'default-cache' | 'no-store' | 'force-cache';
  revalidate?: number | false;
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const determineRenderMode = getExport<(config: RouteConfig) => 'static' | 'dynamic'>(
      exports,
      'determineRenderMode'
    );

    const r1 = determineRenderMode({});
    const test1 = r1 === 'static';

    const r2 = determineRenderMode({ usesCookies: true });
    const test2 = r2 === 'dynamic';

    const r3 = determineRenderMode({ dynamic: 'force-dynamic' });
    const test3 = r3 === 'dynamic';

    const r4 = determineRenderMode({ dynamic: 'force-static', usesCookies: true, usesHeaders: true });
    const test4 = r4 === 'static';

    const r5 = determineRenderMode({ fetchCache: 'no-store' });
    const test5 = r5 === 'dynamic';

    const r6 = determineRenderMode({ revalidate: 60 });
    const test6 = r6 === 'static';

    const r7 = determineRenderMode({ revalidate: 0 });
    const test7 = r7 === 'dynamic';

    return {
      passed: test1 && test2 && test3 && test4 && test5 && test6 && test7,
      results: [
        { description: 'No dynamic APIs → static', expected: 'static', actual: r1, passed: test1 },
        { description: 'Reading cookies() forces dynamic', expected: 'dynamic', actual: r2, passed: test2 },
        { description: '"force-dynamic" override', expected: 'dynamic', actual: r3, passed: test3 },
        { description: '"force-static" overrides even cookies/headers usage', expected: 'static', actual: r4, passed: test4 },
        { description: 'fetchCache: "no-store" forces dynamic', expected: 'dynamic', actual: r5, passed: test5 },
        { description: 'revalidate: 60 (ISR) is still static', expected: 'static', actual: r6, passed: test6 },
        { description: 'revalidate: 0 forces dynamic', expected: 'dynamic', actual: r7, passed: test7 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
