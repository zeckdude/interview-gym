import type { ChallengeLanguage } from '@/data/types';

export function prepareCodeForExecution(
  code: string,
  language: ChallengeLanguage
): string {
  if (language === 'javascript') {
    return code;
  }

  const lines = code.split('\n');
  const result: string[] = [];
  let skipBlock = false;
  let braceDepth = 0;

  for (let line of lines) {
    const trimmed = line.trim();

    if (/^(export\s+)?(interface|type)\s/.test(trimmed)) {
      if (trimmed.includes('{')) {
        skipBlock = true;
        braceDepth =
          (trimmed.match(/\{/g) || []).length -
          (trimmed.match(/\}/g) || []).length;
      }
      continue;
    }

    if (skipBlock) {
      braceDepth +=
        (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;
      if (braceDepth <= 0) skipBlock = false;
      continue;
    }

    // import * as fs from 'fs'
    if (/^import\s+\*/.test(trimmed)) {
      const match = trimmed.match(
        /import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/
      );
      if (match) {
        result.push(`const ${match[1]} = require("${match[2]}");`);
        continue;
      }
    }

    // import { x } from 'mod'
    if (/^import\s+\{/.test(trimmed)) {
      const match = trimmed.match(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/);
      if (match) {
        result.push(`const {${match[1]}} = require("${match[2]}");`);
        continue;
      }
    }

    // export { fn }
    if (/^export\s+\{/.test(trimmed)) {
      const match = trimmed.match(/export\s+\{([^}]+)\}/);
      if (match) {
        result.push(`module.exports = { ${match[1]} };`);
        continue;
      }
    }

    line = line.replace(/^export\s+(function|const|let|var|async\s+function)/, '$1');

    // Remove function generics: foo<T ...>( → foo(
    line = line.replace(/<[^(]*\([^)]*\)[^>]*>/g, '');
    line = line.replace(/<[^>]+>/g, '');

    // Remove return type before opening brace
    line = line.replace(/\)\s*:\s*[^{]+\s*\{/g, ') {');

    // Remove Record<...> and similar complex types in annotations
    line = line.replace(/:\s*Record<[^>]+>/g, '');
    line = line.replace(/:\s*ReturnType<[^>]+>/g, '');
    line = line.replace(/:\s*\([^)]*\)\s*=>\s*void/g, '');

    // Remove simple type annotations (not object literal values)
    line = line.replace(
      /(\w)\s*:\s*(?:[A-Z][\w<>,\s|&\[\]?]*|string|number|boolean|void|null|undefined|Record|Promise|ReturnType)(?=[,)])/g,
      '$1'
    );

    // Remove union with null: | null
    line = line.replace(/\s*\|\s*null/g, '');

    // Remove non-null assertions
    line = line.replace(/(\w)!/g, '$1');

    // Remove 'as TypeName' assertions
    line = line.replace(/\s+as\s+\w+/g, '');

    // Remove 'as const'
    line = line.replace(/\s+as\s+const/g, '');

    result.push(line);
  }

  return result.join('\n');
}
