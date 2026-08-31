import type { Monaco } from '@monaco-editor/react';

/** Minimal globals learners use — avoids pulling in DOM lib (e.g. window.name). */
const LEARN_AMBIENT_GLOBALS = `
declare const console: {
  log(...args: unknown[]): void;
};
`;

let configured = false;

/** Monaco JS defaults for learn steps: no DOM globals, console only via ambient stub. */
export function configureLearnMonaco(monaco: Monaco): void {
  if (configured) return;
  configured = true;

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    lib: ['es2020'],
    checkJs: true,
  });

  monaco.languages.typescript.javascriptDefaults.addExtraLib(
    LEARN_AMBIENT_GLOBALS,
    'learn-globals.d.ts'
  );
}

/** Toggle live in-editor diagnostics (squiggles / hover errors). */
export function applyLearnMonacoDiagnostics(monaco: Monaco, enabled: boolean): void {
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: !enabled,
    noSyntaxValidation: false,
    diagnosticCodesToIgnore: [6385],
  });
}

/** Reset for tests only. */
export function resetLearnMonacoConfigForTests(): void {
  configured = false;
}
