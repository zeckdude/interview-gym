import type { Lesson } from './types';
import { runUserCode } from './_utils';

export const lessonTs27TopoSort: Lesson = {
  id: 'lesson-ts-27-topo-sort',
  title: 'Topological Sort',
  category: 'stack-typescript',
  topLevel: 'stack',
  subcategory: 'typescript',
  difficulty: 'advanced',
  relatedChallengeIds: ['ts-27-topo-sort'],
  estimatedMinutes: 10,
  concepts: ["graphs","dependencies"],
  steps: [
    {
      type: 'explanation',
      title: 'Why This Matters',
      content: `
**Topological Sort** shows up often in interviews. You need to explain the idea clearly, not just memorize syntax.

**Key concepts:** graphs, dependencies
      `,
    },
    {
      type: 'code-example',
      title: 'Example',
      language: 'javascript',
      content: `function topoSort(graph) {
  const visited = new Set();
    const temp = new Set();
    const result = [];
    const visit = (node) => {
      if (temp.has(node)) throw new Error('Cycle');
      if (visited.has(node)) return;
      temp.add(node);
      for (const dep of graph[node] ?? []) visit(dep);
      temp.delete(node);
      visited.add(node);
      result.push(node);
    };
    for (const node of Object.keys(graph)) visit(node);
    return result.reverse();
}`,
    },
    {
      type: 'gotcha',
      title: '⚠️ Common Interview Trap',
      content: `
Interviewers probe edge cases for **graphs**. Mention invalid inputs, empty values, and when this pattern is the wrong tool.
      `,
    },
  ],
  miniChallenge: {
    id: 'mini-ts-27-topo-sort',
    prompt: `Implement \`topoSort\` for a common interview scenario.`,
    timeLimitSeconds: 120,
    starterCode: {
      javascript: `function topoSort(graph) {
  // Implement this function
  
}`,
      typescript: `function topoSort(graph: Record<string, string[]>) {
  // Implement this function
  
}`,
    },
    solution: {
      javascript: `function topoSort(graph) {
  const visited = new Set();
    const temp = new Set();
    const result = [];
    const visit = (node) => {
      if (temp.has(node)) throw new Error('Cycle');
      if (visited.has(node)) return;
      temp.add(node);
      for (const dep of graph[node] ?? []) visit(dep);
      temp.delete(node);
      visited.add(node);
      result.push(node);
    };
    for (const node of Object.keys(graph)) visit(node);
    return result.reverse();
}`,
      typescript: `function topoSort(graph: Record<string, string[]>) {
  const visited = new Set();
    const temp = new Set();
    const result = [];
    const visit = (node) => {
      if (temp.has(node)) throw new Error('Cycle');
      if (visited.has(node)) return;
      temp.add(node);
      for (const dep of graph[node] ?? []) visit(dep);
      temp.delete(node);
      visited.add(node);
      result.push(node);
    };
    for (const node of Object.keys(graph)) visit(node);
    return result.reverse();
}`,
    },
    validate: (userCode: string) => {
      const result = runUserCode<(...args: unknown[]) => unknown>(userCode, 'topoSort');
      if (!result.passed) return { passed: false, feedback: result.feedback };
      try {
        const testRunner = new Function('topoSort', 'return Boolean(JSON.stringify(topoSort({"a":["b"],"b":["c"],"c":[]})) === JSON.stringify(["c","b","a"]))');
        const ok = testRunner(result.value);
        return ok
          ? { passed: true, feedback: 'Perfect! All tests passed. ✓' }
          : { passed: false, feedback: 'Not quite — check the requirements and try again.' };
      } catch (e) {
        return { passed: false, feedback: `Error running tests: ${e instanceof Error ? e.message : String(e)}` };
      }
    },
  },
  mdnLinks: [
    { label: 'Topological Sort', url: 'https://developer.mozilla.org/' }
  ],
};
