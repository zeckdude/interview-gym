// @ts-nocheck
import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const mergeMetadata = getExport<(...args: unknown[]) => unknown>(exports, 'mergeMetadata');

    const cases = [
      {
        description: "deep merges nested openGraph",
        run: () => JSON.stringify(mergeMetadata({"title":"A","openGraph":{"title":"A","type":"website"}}, {"openGraph":{"title":"B"}})) === JSON.stringify({"title":"A","openGraph":{"title":"B","type":"website"}}),
        expected: {"title":"A","openGraph":{"title":"B","type":"website"}},
        actual: () => JSON.stringify(mergeMetadata({"title":"A","openGraph":{"title":"A","type":"website"}}, {"openGraph":{"title":"B"}})),
      },
      {
        description: "override replaces scalar fields",
        run: () => JSON.stringify(mergeMetadata({"title":"Old","description":"x"}, {"title":"New"})) === JSON.stringify({"title":"New","description":"x"}),
        expected: {"title":"New","description":"x"},
        actual: () => JSON.stringify(mergeMetadata({"title":"Old","description":"x"}, {"title":"New"})),
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
