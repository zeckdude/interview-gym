import ts from 'typescript';
import type { ChallengeLanguage } from '@/data/types';

/**
 * Prepare user code for the CommonJS-style sandbox used by validators.
 * TypeScript is stripped via the compiler so generics, modifiers, and
 * multi-line type aliases survive — the previous regex stripper was too fragile.
 */
export function prepareCodeForExecution(
  code: string,
  language: ChallengeLanguage
): string {
  if (language === 'javascript') {
    return code;
  }

  const { outputText } = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      esModuleInterop: true,
      removeComments: false,
    },
    reportDiagnostics: false,
  });

  return outputText;
}
