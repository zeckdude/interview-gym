import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface Metadata {
  title: string;
  description: string;
  openGraph: { images: string[] };
}

export async function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const generateMetadata = getExport<
      (props: { params: { slug: string } }) => Metadata | Promise<Metadata>
    >(exports, 'generateMetadata');

    const found = await generateMetadata({ params: { slug: 'hello-world' } });
    const test1 = found.title === 'Hello World | My Blog';
    const test2 = found.description === 'My first post';
    const test3 = Array.isArray(found.openGraph?.images) && found.openGraph.images[0] === '/images/hello.png';

    const notFound = await generateMetadata({ params: { slug: 'does-not-exist' } });
    const test4 = notFound.title === 'Post Not Found | My Blog';
    const test5 = notFound.description === 'This post could not be found.';
    const test6 = Array.isArray(notFound.openGraph?.images) && notFound.openGraph.images.length === 0;

    return {
      passed: test1 && test2 && test3 && test4 && test5 && test6,
      results: [
        { description: 'Builds a dynamic title from the post', expected: 'Hello World | My Blog', actual: found.title, passed: test1 },
        { description: 'Uses the post excerpt as description', expected: 'My first post', actual: found.description, passed: test2 },
        { description: 'Includes the post image in openGraph.images', expected: '["/images/hello.png"]', actual: JSON.stringify(found.openGraph?.images), passed: test3 },
        { description: 'Falls back to "Post Not Found" title for missing posts', expected: 'Post Not Found | My Blog', actual: notFound.title, passed: test4 },
        { description: 'Falls back to the generic not-found description', expected: 'This post could not be found.', actual: notFound.description, passed: test5 },
        { description: 'Fallback openGraph.images is empty', expected: '[]', actual: JSON.stringify(notFound.openGraph?.images), passed: test6 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
