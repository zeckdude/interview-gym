import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const fn = getExport<(path: string, locale: string) => string>(exports, 'localizePath');
const t1 = fn('/about', 'es') === '/es/about';
const t2 = fn('/en/about', 'es') === '/es/about';
const t3 = fn('/', 'en') === '/en';
return { passed: t1&&t2&&t3, results: [
  { description: 'Adds locale prefix', expected: '/es/about', actual: fn('/about','es'), passed: t1 },
  { description: 'Replaces existing locale', expected: '/es/about', actual: fn('/en/about','es'), passed: t2 },
  { description: 'Root becomes /locale', expected: '/en', actual: fn('/','en'), passed: t3 },
]};
  } catch (e: unknown) {
    return errorResult(e);
  }
}
