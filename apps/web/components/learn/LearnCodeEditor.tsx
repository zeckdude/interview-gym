'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import Editor, { type Monaco, type OnMount } from '@monaco-editor/react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { countCodeLines } from '@/lib/learn/code-error-line';
import { configureLearnMonaco, applyLearnMonacoDiagnostics } from '@/lib/learn/monaco-config';
import {
  applyLearnIndentGuideTheme,
  getIndentGuideCssColors,
} from '@/lib/learn/monaco-indent-theme';
import type { ResolvedLearningSettings } from '@/lib/learn/learning-preferences';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

type EditorInstance = Parameters<OnMount>[0];

const LINE_HEIGHT = 26;
const EDITOR_PADDING = 24;
const MIN_LINES = 2;

export interface LearnCodeEditorHandle {
  focus: () => void;
  focusAtEnd: () => void;
  getValue: () => string;
  insertSpaces: (spaces: string) => void;
}

interface LearnCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  highlightLine?: number;
  editorSettings?: Pick<
    ResolvedLearningSettings,
    | 'indentGuides'
    | 'indentGuideColor'
    | 'editorShortcuts'
    | 'errorLineHighlight'
    | 'editorDiagnostics'
  >;
  className?: string;
  'aria-label'?: string;
}

export const LearnCodeEditor = forwardRef<LearnCodeEditorHandle, LearnCodeEditorProps>(
  function LearnCodeEditor(
    {
      value,
      onChange,
      onRun,
      highlightLine,
      editorSettings,
      className,
      'aria-label': ariaLabel,
    },
    ref
  ) {
    const { look, darkMode } = useTheme();
    const monacoTheme =
      darkMode === 'dark' ? look.dark.monacoThemeDark : look.light.monacoThemeLight;
    const guidesOn = editorSettings?.indentGuides !== false;
    const guideColor = editorSettings?.indentGuideColor;
    const indentGuideCss = guidesOn ? getIndentGuideCssColors(guideColor ?? '') : null;
    const editorRef = useRef<EditorInstance | null>(null);
    const monacoRef = useRef<Monaco | null>(null);
    const decorationIdsRef = useRef<string[]>([]);

    const showHighlight =
      editorSettings?.errorLineHighlight !== false &&
      highlightLine != null &&
      highlightLine > 0;

    const lineCount = Math.max(countCodeLines(value), MIN_LINES);
    const height = lineCount * LINE_HEIGHT + EDITOR_PADDING;

    const insertSpaces = useCallback((spaces: string) => {
      const editor = editorRef.current;
      if (!editor) return;
      const selection = editor.getSelection();
      if (!selection) return;
      editor.executeEdits('tab', [
        {
          range: selection,
          text: spaces,
          forceMoveMarkers: true,
        },
      ]);
      editor.focus();
    }, []);

    useImperativeHandle(ref, () => ({
      focus: () => editorRef.current?.focus(),
      focusAtEnd: () => {
        const editor = editorRef.current;
        if (!editor) return;
        editor.focus();
        const model = editor.getModel();
        if (!model) return;
        const lastLine = model.getLineCount();
        const lastColumn = model.getLineMaxColumn(lastLine);
        editor.setPosition({ lineNumber: lastLine, column: lastColumn });
      },
      getValue: () => editorRef.current?.getValue() ?? value,
      insertSpaces,
    }));

    const applyGuideTheme = useCallback(() => {
      const monaco = monacoRef.current;
      if (!monaco) return;
      const themeId = applyLearnIndentGuideTheme(
        monaco,
        monacoTheme,
        guideColor ?? '',
        guidesOn
      );
      monaco.editor.setTheme(themeId);
    }, [monacoTheme, guideColor, guidesOn]);

    const handleBeforeMount = useCallback(
      (monaco: Monaco) => {
        configureLearnMonaco(monaco);
        applyLearnIndentGuideTheme(monaco, monacoTheme, guideColor ?? '', guidesOn);
      },
      [monacoTheme, guideColor, guidesOn]
    );

    const handleMount: OnMount = useCallback(
      (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
          onRun?.();
        });

        if (editorSettings?.editorShortcuts !== false) {
          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
            editor.trigger('keyboard', 'editor.action.commentLine', {});
          });
          editor.addCommand(
            monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyD,
            () => {
              editor.trigger('keyboard', 'editor.action.copyLinesDownAction', {});
            }
          );
        }

        applyLearnMonacoDiagnostics(monaco, editorSettings?.editorDiagnostics === true);
        applyGuideTheme();
      },
      [
        onRun,
        editorSettings?.editorShortcuts,
        editorSettings?.editorDiagnostics,
        applyGuideTheme,
      ]
    );

    useEffect(() => {
      const editor = editorRef.current;
      const monaco = monacoRef.current;
      if (!editor || !monaco) return;

      const decorations = showHighlight
        ? [
            {
              range: new monaco.Range(highlightLine!, 1, highlightLine!, 1),
              options: {
                isWholeLine: true,
                className: 'learn-editor-error-line',
                linesDecorationsClassName: 'learn-editor-error-line-gutter',
              },
            },
          ]
        : [];

      decorationIdsRef.current = editor.deltaDecorations(
        decorationIdsRef.current,
        decorations
      );
    }, [highlightLine, value, showHighlight]);

    useEffect(() => {
      const monaco = monacoRef.current;
      if (!monaco) return;
      applyLearnMonacoDiagnostics(monaco, editorSettings?.editorDiagnostics === true);
    }, [editorSettings?.editorDiagnostics]);

    useLayoutEffect(() => {
      applyGuideTheme();
    }, [applyGuideTheme]);

    useEffect(() => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.updateOptions({
        guides: {
          indentation: guidesOn,
          highlightActiveIndentation: guidesOn,
        },
      });
    }, [guidesOn]);

    useEffect(() => {
      const editor = editorRef.current;
      if (!editor) return;
      editor.updateOptions({
        renderLineHighlight: showHighlight ? 'none' : 'line',
        lineDecorationsWidth: showHighlight ? 12 : 8,
      });
    }, [showHighlight]);

    const wrapperStyle: CSSProperties | undefined = indentGuideCss
      ? ({
          '--learn-indent-guide-color': indentGuideCss.guide,
          '--learn-indent-guide-color-active': indentGuideCss.guideActive,
        } as CSSProperties)
      : undefined;

    return (
      <div
        className={cn('learn-code-editor', className)}
        aria-label={ariaLabel}
        data-indent-guides={guidesOn ? 'true' : 'false'}
        style={wrapperStyle}
      >
        <Editor
          height={`${height}px`}
          language="javascript"
          value={value}
          theme={monacoTheme}
          beforeMount={handleBeforeMount}
          onChange={(next) => onChange(next ?? '')}
          onMount={handleMount}
          options={{
            fontSize: 17,
            lineHeight: LINE_HEIGHT,
            fontFamily: 'JetBrains Mono, Fira Code, ui-monospace, monospace',
            tabSize: 2,
            insertSpaces: true,
            autoIndent: 'advanced',
            formatOnType: true,
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            bracketPairColorization: { enabled: true },
            guides: {
              indentation: editorSettings?.indentGuides !== false,
              highlightActiveIndentation: editorSettings?.indentGuides !== false,
            },
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12, bottom: 12 },
            wordWrap: 'on',
            roundedSelection: true,
            automaticLayout: true,
            scrollbar: { vertical: 'hidden', horizontal: 'auto' },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 8,
            lineNumbersMinChars: 3,
          }}
        />
      </div>
    );
  }
);

interface LearnCodeEditorShellProps {
  setupCode?: string;
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  onHint?: () => void;
  showHintButton?: boolean;
  highlightLine?: number;
  editorSettings?: ResolvedLearningSettings;
  actions?: ReactNode;
  className?: string;
}

/** Setup (read-only) + editable Monaco region with actions. */
export const LearnCodeEditorShell = forwardRef<
  LearnCodeEditorHandle,
  LearnCodeEditorShellProps
>(function LearnCodeEditorShell(
  {
    setupCode,
    value,
    onChange,
    onRun,
    onHint,
    showHintButton = false,
    highlightLine,
    editorSettings,
    actions,
    className,
  },
  ref
) {
  const innerRef = useRef<LearnCodeEditorHandle>(null);
  const showSetup = Boolean(setupCode?.trim()) && editorSettings?.setupCodeSplit !== false;
  const showMobileToolbar = editorSettings?.mobileToolbar !== false;

  useImperativeHandle(ref, () => ({
    focus: () => innerRef.current?.focus(),
    focusAtEnd: () => innerRef.current?.focusAtEnd(),
    getValue: () => innerRef.current?.getValue() ?? value,
    insertSpaces: (spaces: string) => innerRef.current?.insertSpaces(spaces),
  }));

  return (
    <div
      className={cn(
        'rounded-xl border-2 border-border-strong bg-code-bg transition-[border-color,box-shadow]',
        'focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20',
        className
      )}
    >
      {showSetup && (
        <div className="border-b-2 border-border-subtle">
          <div className="px-5 pt-3 pb-1">
            <p className="font-body text-xs font-bold uppercase tracking-wide text-text-secondary">
              Setup
            </p>
            <p className="font-body text-sm text-text-muted mt-0.5">
              Read-only — edit your code below
            </p>
          </div>
          <pre className="px-5 pb-3 font-mono text-[17px] leading-relaxed text-text-muted whitespace-pre-wrap">
            {setupCode}
          </pre>
        </div>
      )}

      {showSetup && (
        <div className="px-5 pt-3 pb-1 border-b border-border-subtle/60">
          <p className="font-body text-xs font-bold uppercase tracking-wide text-brand">
            Your code
          </p>
        </div>
      )}

      {showMobileToolbar && (
        <div className="flex flex-wrap gap-2 px-4 pt-3 pb-1 md:hidden">
          <Button
            type="button"
            variant="secondary"
            className="min-h-[44px] flex-1"
            onClick={() => innerRef.current?.insertSpaces('  ')}
          >
            Tab
          </Button>
          {onRun && (
            <Button type="button" className="min-h-[44px] flex-1" onClick={onRun}>
              Run
            </Button>
          )}
          {showHintButton && onHint && (
            <Button
              type="button"
              variant="secondary"
              className="min-h-[44px] flex-1"
              onClick={onHint}
            >
              Hint
            </Button>
          )}
        </div>
      )}

      <LearnCodeEditor
        ref={innerRef}
        value={value}
        onChange={onChange}
        onRun={onRun}
        highlightLine={highlightLine}
        editorSettings={editorSettings}
        aria-label="Code editor"
      />

      {actions && (
        <div className="flex flex-wrap justify-end gap-2 px-4 pb-4 pt-1">{actions}</div>
      )}
    </div>
  );
});
