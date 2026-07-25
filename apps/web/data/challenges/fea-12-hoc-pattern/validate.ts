import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

type Props = Record<string, unknown>;

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const withLogger = getExport<
      <T extends Props, R>(fn: (p: T) => R, name?: string) => { render(p: T): R; getLogs(): string[] }
    >(exports, 'withLogger');

    const Button = withLogger(
      (props: { label: string }) => `<button>${props.label}</button>`,
      'Button'
    );

    // Test 1: passes through to original render function
    const r1 = Button.render({ label: 'Click' });
    const test1 = r1 === '<button>Click</button>';

    // Test 2: logs are recorded
    const logs = Button.getLogs();
    const test2 = logs.length === 1 && logs[0].includes('Button') && logs[0].includes('Click');

    // Test 3: logs accumulate
    Button.render({ label: 'Submit' });
    const test3 = Button.getLogs().length === 2;

    // Test 4: component name appears in log
    const test4 = logs[0].includes('[Button]');

    return {
      passed: test1 && test2 && test3 && test4,
      results: [
        { description: 'Passes props through to original function', expected: '<button>Click</button>', actual: r1, passed: test1 },
        { description: 'Logs are recorded with component name and props', expected: 'log contains "Button" and "Click"', actual: logs[0] ?? 'no log', passed: test2 },
        { description: 'Logs accumulate across multiple renders', expected: '2 logs', actual: `${Button.getLogs().length} logs`, passed: test3 },
        { description: 'Component name appears in bracket format [Name]', expected: '[Button]', actual: logs[0]?.split(' ')[0] ?? 'none', passed: test4 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
