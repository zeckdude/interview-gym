'use client';

import Editor from '@monaco-editor/react';
import { useTheme } from '@/components/providers/ThemeProvider';

interface CodeEditorProps {
  language: 'javascript' | 'typescript';
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  const { look, darkMode } = useTheme();
  const monacoTheme =
    darkMode === 'dark' ? look.dark.monacoThemeDark : look.light.monacoThemeLight;

  return (
    <div className="rounded-lg overflow-hidden border border-border-subtle shadow-card">
      <Editor
        height="480px"
        language={language}
        value={value}
        onChange={(val) => onChange(val ?? '')}
        theme={monacoTheme}
        options={{
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Fira Code, monospace',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          lineNumbers: 'on',
          roundedSelection: true,
          automaticLayout: true,
          tabSize: 2,
          scrollbar: { alwaysConsumeMouseWheel: false },
        }}
      />
    </div>
  );
}
