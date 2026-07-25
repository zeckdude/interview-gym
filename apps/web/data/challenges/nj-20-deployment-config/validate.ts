import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const fn = getExport<(config: { output: string; headers: string[]; envValidated: boolean; redirects: unknown[] }) => boolean>(exports, 'validateProductionConfig');
const good = { output:'standalone', headers:['Content-Security-Policy','Strict-Transport-Security'], envValidated:true, redirects:[{ source:'/old'}] };
const bad = { output:'standalone', headers:['Content-Security-Policy'], envValidated:true, redirects:[] };
const t1 = fn(good) === true;
const t2 = fn(bad) === false;
return { passed: t1&&t2, results: [
  { description: 'Valid production config passes', expected: 'true', actual: String(fn(good)), passed: t1 },
  { description: 'Missing HSTS/redirects fails', expected: 'false', actual: String(fn(bad)), passed: t2 },
]};
  } catch (e: unknown) {
    return errorResult(e);
  }
}
