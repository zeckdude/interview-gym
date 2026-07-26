// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const parseContentType = getExport<(header: string) => { type: string; charset: string | null }>(exports, 'parseContentType');

    const cases = [
      {
        description: "parses type only",
        run: () => JSON.stringify(parseContentType("application/json")) === JSON.stringify({"type":"application/json","charset":null}),
        expected: {"type":"application/json","charset":null},
        actual: () => JSON.stringify(parseContentType("application/json")),
      },
      {
        description: "extracts charset parameter",
        run: () => JSON.stringify(parseContentType("text/html; charset=UTF-8")) === JSON.stringify({"type":"text/html","charset":"UTF-8"}),
        expected: {"type":"text/html","charset":"UTF-8"},
        actual: () => JSON.stringify(parseContentType("text/html; charset=UTF-8")),
      },
      {
        description: "handles quoted charset",
        run: () => JSON.stringify(parseContentType("text/plain; charset=\"iso-8859-1\"")) === JSON.stringify({"type":"text/plain","charset":"iso-8859-1"}),
        expected: {"type":"text/plain","charset":"iso-8859-1"},
        actual: () => JSON.stringify(parseContentType("text/plain; charset=\"iso-8859-1\"")),
      }
    ];

    const results = cases.map((c) => {
      const passed = c.run();
      return {
        description: c.description,
        expected: String(c.expected),
        actual: passed ? String(c.expected) : String(c.actual()),
        passed,
      };
    });

    return { passed: results.every((r) => r.passed), results };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
