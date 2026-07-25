'use client';

import Editor from '@monaco-editor/react';
import { useTheme } from '@/components/providers/ThemeProvider';

interface ReadOnlyCodeEditorProps {
  language: 'javascript' | 'typescript';
  value: string;
  height?: string;
}

export function ReadOnlyCodeEditor({
  language,
  value,
  height = '280px',
}: ReadOnlyCodeEditorProps) {
  const { look, darkMode } = useTheme();
  const monacoTheme =
    darkMode === 'dark' ? look.dark.monacoThemeDark : look.light.monacoThemeLight;

  return (
    <div className="rounded-lg overflow-hidden border border-border-subtle shadow-card">
      <Editor
        height={height}
        language={language}
        value={value.trim()}
        theme={monacoTheme}
        options={{
          readOnly: true,
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Fira Code, monospace',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          lineNumbers: 'on',
          automaticLayout: true,
          tabSize: 2,
          domReadOnly: true,
          scrollbar: { alwaysConsumeMouseWheel: false },
        }}
      />
    </div>
  );
}
