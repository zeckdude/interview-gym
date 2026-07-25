import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface ActionResult {
  success: boolean;
  errors: Record<string, string>;
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const createPost = getExport<(formData: { title: string; content: string }) => ActionResult>(
      exports,
      'createPost'
    );

    const empty = createPost({ title: '', content: '' });
    const test1 = empty.success === false && 'title' in empty.errors && 'content' in empty.errors;

    const tooShort = createPost({ title: 'Hi', content: 'short' });
    const test2 = tooShort.success === false && 'title' in tooShort.errors && 'content' in tooShort.errors;

    const valid = createPost({ title: 'Hello World', content: 'This is a long enough post body.' });
    const test3 = valid.success === true && Object.keys(valid.errors).length === 0;

    const partiallyValid = createPost({ title: 'Valid Title', content: 'short' });
    const test4 = partiallyValid.success === false && !('title' in partiallyValid.errors) && 'content' in partiallyValid.errors;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Empty fields fail with errors for both', expected: 'success: false, errors: {title, content}', actual: JSON.stringify(empty), passed: test1 },
        { description: 'Too-short fields fail validation', expected: 'success: false, errors: {title, content}', actual: JSON.stringify(tooShort), passed: test2 },
        { description: 'Valid input succeeds with no errors', expected: 'success: true, errors: {}', actual: JSON.stringify(valid), passed: test3 },
        { description: 'Only the failing field appears in errors', expected: 'errors: {content} only', actual: JSON.stringify(partiallyValid), passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
