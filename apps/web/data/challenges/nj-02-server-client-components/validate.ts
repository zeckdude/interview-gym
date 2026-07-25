import { executeUserCode, getExport } from '../../../lib/execute-code';
import { errorResult } from '../_utils';

interface ComponentAnalysis {
  needsClientDirective: boolean;
  reasons: string[];
}

export function validate(userCode: string) {
  try {
    const exports = executeUserCode(userCode, () => ({}));
    const analyzeComponent = getExport<(source: string) => ComponentAnalysis>(
      exports,
      'analyzeComponent'
    );

    const stateful = analyzeComponent(
      "function Counter() { const [count, setCount] = useState(0); return null; }"
    );
    const test1 = stateful.needsClientDirective === true && stateful.reasons.length > 0;

    const handler = analyzeComponent(
      "function Btn() { return React.createElement('button', { onClick: () => {} }); }"
    );
    const test2 = handler.needsClientDirective === true;

    const browserGlobal = analyzeComponent(
      "function Widget() { const w = window.innerWidth; return null; }"
    );
    const test3 = browserGlobal.needsClientDirective === true;

    const serverComponent = analyzeComponent(
      "async function ProductList() { const products = await getProducts(); return products; }"
    );
    const test4 = serverComponent.needsClientDirective === false && serverComponent.reasons.length === 0;

    const explicitDirective = analyzeComponent("'use client'\nfunction Static() { return null; }");
    const test5 = explicitDirective.needsClientDirective === true;

    return {
      passed: test1 && test2 && test3 && test4 && test5,
      results: [
        { description: 'Flags components using useState as needing "use client"', expected: 'needsClientDirective: true', actual: JSON.stringify(stateful), passed: test1 },
        { description: 'Flags components with DOM event handlers', expected: 'needsClientDirective: true', actual: JSON.stringify(handler), passed: test2 },
        { description: 'Flags components accessing browser globals like window', expected: 'needsClientDirective: true', actual: JSON.stringify(browserGlobal), passed: test3 },
        { description: 'Leaves pure async server components as Server Components', expected: 'needsClientDirective: false, no reasons', actual: JSON.stringify(serverComponent), passed: test4 },
        { description: 'Respects an explicit "use client" directive', expected: 'needsClientDirective: true', actual: JSON.stringify(explicitDirective), passed: test5 },
      ],
    };
  } catch (e: unknown) {
    return errorResult(e);
  }
}
