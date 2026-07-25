import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface InterceptResult {
  level: 'same' | 'one-above' | 'two-above' | 'root';
  segment: string;
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const isParallelSlot = getExport<(folderName: string) => boolean>(exports, 'isParallelSlot');
    const parseInterceptingRoute = getExport<(folderName: string) => InterceptResult | null>(
      exports,
      'parseInterceptingRoute'
    );

    const test1 = isParallelSlot('@modal') === true;
    const test2 = isParallelSlot('photo') === false;

    const same = parseInterceptingRoute('(.)photo');
    const test3 = same?.level === 'same' && same?.segment === 'photo';

    const oneAbove = parseInterceptingRoute('(..)photo');
    const test4 = oneAbove?.level === 'one-above' && oneAbove?.segment === 'photo';

    const twoAbove = parseInterceptingRoute('(..)(..)photo');
    const test5 = twoAbove?.level === 'two-above' && twoAbove?.segment === 'photo';

    const root = parseInterceptingRoute('(...)photo');
    const test6 = root?.level === 'root' && root?.segment === 'photo';

    const notIntercepted = parseInterceptingRoute('photo');
    const test7 = notIntercepted === null;

    return {
      passed: test1 && test2 && test3 && test4 && test5 && test6 && test7,
      results: [
        { description: '@modal is a parallel slot', expected: 'true', actual: String(isParallelSlot('@modal')), passed: test1 },
        { description: 'A plain folder is not a parallel slot', expected: 'false', actual: String(isParallelSlot('photo')), passed: test2 },
        { description: '(.)photo intercepts at the same level', expected: '{ level: "same", segment: "photo" }', actual: JSON.stringify(same), passed: test3 },
        { description: '(..)photo intercepts one level above', expected: '{ level: "one-above", segment: "photo" }', actual: JSON.stringify(oneAbove), passed: test4 },
        { description: '(..)(..)photo intercepts two levels above', expected: '{ level: "two-above", segment: "photo" }', actual: JSON.stringify(twoAbove), passed: test5 },
        { description: '(...)photo intercepts from the root', expected: '{ level: "root", segment: "photo" }', actual: JSON.stringify(root), passed: test6 },
        { description: 'A folder with no prefix is not intercepting', expected: 'null', actual: String(notIntercepted), passed: test7 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
