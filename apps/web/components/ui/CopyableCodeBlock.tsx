'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/components/providers/ThemeProvider';

interface CopyableCodeBlockProps {
  code: string;
  language: string;
  height?: string;
}

export function CopyableCodeBlock({
  code,
  language,
  height = '160px',
}: CopyableCodeBlockProps) {
  const { look, darkMode } = useTheme();
  const [copied, setCopied] = useState(false);

  const monacoTheme =
    darkMode === 'dark' ? look.dark.monacoThemeDark : look.light.monacoThemeLight;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-border-subtle">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-bg-subtle px-3 py-1.5 border-b border-border-subtle">
        <span className="font-mono text-xs text-text-muted">{language}</span>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1 text-xs font-body font-semibold px-2 py-0.5 rounded transition-all duration-150 ${
            copied
              ? 'text-success bg-success-light'
              : 'text-text-muted hover:text-text-primary hover:bg-border-subtle'
          }`}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <span>✓</span>
              <span>Copied</span>
            </>
          ) : (
            <>
              <span>⎘</span>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Editor */}
      <Editor
        height={height}
        language={language}
        value={code}
        theme={monacoTheme}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          lineNumbers: 'off',
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          fontSize: 13,
          fontFamily: 'JetBrains Mono, Fira Code, monospace',
          automaticLayout: true,
          scrollbar: { vertical: 'hidden', horizontal: 'hidden', alwaysConsumeMouseWheel: false },
          overviewRulerLanes: 0,
          folding: false,
          contextmenu: false,
        }}
      />
    </div>
  );
}
