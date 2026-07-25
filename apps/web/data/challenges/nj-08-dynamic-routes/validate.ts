import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface Post {
  slug: string;
  title: string;
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const generateStaticParams = getExport<() => { slug: string }[]>(exports, 'generateStaticParams');
    const getPost = getExport<(slug: string) => Post | undefined>(exports, 'getPost');

    const params = generateStaticParams();
    const test1 = Array.isArray(params) && params.length === 3;
    const test2 = params.every((p) => typeof p.slug === 'string') &&
      params.some((p) => p.slug === 'getting-started') &&
      params.some((p) => p.slug === 'app-router-guide');

    const found = getPost('app-router-guide');
    const test3 = found?.slug === 'app-router-guide' && found?.title === 'The App Router Guide';

    const missing = getPost('does-not-exist');
    const test4 = missing === undefined;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'generateStaticParams returns one entry per post', expected: '3 entries', actual: `${Array.isArray(params) ? params.length : 'not an array'} entries`, passed: test1 },
        { description: 'Each entry has the correct { slug } shape', expected: '{ slug: string }[]', actual: JSON.stringify(params), passed: test2 },
        { description: 'getPost finds a post by slug', expected: '{ slug: "app-router-guide", title: "The App Router Guide" }', actual: JSON.stringify(found), passed: test3 },
        { description: 'getPost returns undefined for an unknown slug', expected: 'undefined', actual: String(missing), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
