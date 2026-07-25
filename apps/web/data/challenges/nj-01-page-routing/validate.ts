import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface RouteMatch {
  file: string | null;
  params: Record<string, string>;
}

const routes = [
  'app/page.tsx',
  'app/about/page.tsx',
  'app/blog/[slug]/page.tsx',
  'app/(marketing)/pricing/page.tsx',
  'app/shop/[...slug]/page.tsx',
];

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const matchRoute = getExport<(routes: string[], pathname: string) => RouteMatch>(
      exports,
      'matchRoute'
    );

    const r1 = matchRoute(routes, '/');
    const test1 = r1.file === 'app/page.tsx';

    const r2 = matchRoute(routes, '/about');
    const test2 = r2.file === 'app/about/page.tsx';

    const r3 = matchRoute(routes, '/blog/hello-world');
    const test3 = r3.file === 'app/blog/[slug]/page.tsx' && r3.params.slug === 'hello-world';

    const r4 = matchRoute(routes, '/pricing');
    const test4 = r4.file === 'app/(marketing)/pricing/page.tsx';

    const r5 = matchRoute(routes, '/shop/a/b/c');
    const test5 = r5.file === 'app/shop/[...slug]/page.tsx' && r5.params.slug === 'a/b/c';

    const r6 = matchRoute(routes, '/does-not-exist');
    const test6 = r6.file === null;

    return {
      passed: test1 && test2 && test3 && test4 && test5 && test6,
      results: [
        { description: 'Matches the root page', expected: 'app/page.tsx', actual: String(r1.file), passed: test1 },
        { description: 'Matches a static segment', expected: 'app/about/page.tsx', actual: String(r2.file), passed: test2 },
        { description: 'Matches a dynamic [slug] segment and captures params', expected: 'app/blog/[slug]/page.tsx + { slug: "hello-world" }', actual: `${r3.file} + ${JSON.stringify(r3.params)}`, passed: test3 },
        { description: 'Route groups (name) are invisible to the URL', expected: 'app/(marketing)/pricing/page.tsx', actual: String(r4.file), passed: test4 },
        { description: 'Catch-all [...slug] swallows remaining segments', expected: 'app/shop/[...slug]/page.tsx + { slug: "a/b/c" }', actual: `${r5.file} + ${JSON.stringify(r5.params)}`, passed: test5 },
        { description: 'Returns null file for unmatched routes', expected: 'null', actual: String(r6.file), passed: test6 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
