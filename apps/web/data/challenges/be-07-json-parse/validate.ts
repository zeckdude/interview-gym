import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const safeJsonParse = getExport<(json: string) => ParseResult<unknown>>(exports, 'safeJsonParse');

    const r1 = safeJsonParse('{"name":"Alice"}');
    const test1 = r1.ok === true && (r1 as { ok: true; value: unknown }).value !== null;

    const r2 = safeJsonParse('not json at all');
    const test2 = r2.ok === false && typeof (r2 as { ok: false; error: string }).error === 'string';

    const r3 = safeJsonParse('[1,2,3]');
    const test3 = r3.ok === true && Array.isArray((r3 as { ok: true; value: unknown }).value);

    const r4 = safeJsonParse('42');
    const test4 = r4.ok === true && (r4 as { ok: true; value: unknown }).value === 42;

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        {
          description: 'Parses valid JSON object',
          expected: '{ ok: true, value: { name: "Alice" } }',
          actual: JSON.stringify(r1),
          passed: test1,
        },
        {
          description: 'Returns { ok: false, error } for invalid JSON',
          expected: '{ ok: false, error: "<message>" }',
          actual: JSON.stringify(r2),
          passed: test2,
        },
        {
          description: 'Parses valid JSON array',
          expected: '{ ok: true, value: [1,2,3] }',
          actual: JSON.stringify(r3),
          passed: test3,
        },
        {
          description: 'Parses JSON number',
          expected: '{ ok: true, value: 42 }',
          actual: JSON.stringify(r4),
          passed: test4,
        },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
