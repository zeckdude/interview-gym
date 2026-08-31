import { describe, expect, it, vi } from 'vitest';
import {
  configureLearnMonaco,
  applyLearnMonacoDiagnostics,
  resetLearnMonacoConfigForTests,
} from '@/lib/learn/monaco-config';

describe('configureLearnMonaco', () => {
  it('configures javascript defaults once without DOM lib', () => {
    resetLearnMonacoConfigForTests();

    const setCompilerOptions = vi.fn();
    const addExtraLib = vi.fn();

    const monaco = {
      languages: {
        typescript: {
          ScriptTarget: { ES2020: 7 },
          javascriptDefaults: {
            setCompilerOptions,
            setDiagnosticsOptions: vi.fn(),
            addExtraLib,
          },
        },
      },
    };

    configureLearnMonaco(monaco as never);
    configureLearnMonaco(monaco as never);

    expect(setCompilerOptions).toHaveBeenCalledTimes(1);
    expect(setCompilerOptions).toHaveBeenCalledWith(
      expect.objectContaining({
        lib: ['es2020'],
        checkJs: true,
      })
    );
    expect(addExtraLib).toHaveBeenCalledTimes(1);
  });
});

describe('applyLearnMonacoDiagnostics', () => {
  it('enables or disables semantic validation', () => {
    const setDiagnosticsOptions = vi.fn();
    const monaco = {
      languages: {
        typescript: {
          javascriptDefaults: { setDiagnosticsOptions },
        },
      },
    };

    applyLearnMonacoDiagnostics(monaco as never, true);
    expect(setDiagnosticsOptions).toHaveBeenCalledWith(
      expect.objectContaining({ noSemanticValidation: false })
    );

    applyLearnMonacoDiagnostics(monaco as never, false);
    expect(setDiagnosticsOptions).toHaveBeenLastCalledWith(
      expect.objectContaining({ noSemanticValidation: true })
    );
  });
});
