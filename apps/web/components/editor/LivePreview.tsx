'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import type { Challenge, ChallengeLanguage } from '@/data/types';

interface LivePreviewProps {
  challenge: Challenge;
  userCode: string;
  language: ChallengeLanguage;
}

function buildSandpackFiles(
  challenge: Challenge,
  userCode: string,
  language: ChallengeLanguage
) {
  const mainFile = language === 'typescript' ? '/App.tsx' : '/App.js';
  const wrappedCode = userCode.includes('export default')
    ? userCode
    : `${userCode}\n\nexport default function App() {\n  return (\n    <div style={{ padding: 16, fontFamily: 'system-ui' }}>\n      <p>Live preview available when your module exports a React component.</p>\n    </div>\n  );\n}`;

  return {
    [mainFile]: wrappedCode,
    ...challenge.sandpackFiles,
  };
}

export function LivePreview({ challenge, userCode, language }: LivePreviewProps) {
  const { darkMode } = useTheme();
  const [debouncedCode, setDebouncedCode] = useState(userCode);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCode(userCode), 500);
    return () => clearTimeout(timer);
  }, [userCode]);

  const files = useMemo(
    () => buildSandpackFiles(challenge, debouncedCode, language),
    [challenge, debouncedCode, language]
  );

  return (
    <div className="rounded-lg overflow-hidden border border-border-subtle mt-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-bg-subtle border-b border-border-subtle">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-error opacity-70" />
          <div className="w-3 h-3 rounded-full bg-warning opacity-70" />
          <div className="w-3 h-3 rounded-full bg-success opacity-70" />
        </div>
        <span className="font-mono text-xs text-text-muted ml-2">Live Preview</span>
      </div>

      <SandpackProvider
        template={challenge.sandpackTemplate ?? 'react-ts'}
        files={files}
        theme={darkMode === 'dark' ? 'dark' : 'light'}
        options={{
          autorun: true,
          autoReload: true,
        }}
        customSetup={{
          dependencies: {
            react: '^18.0.0',
            'react-dom': '^18.0.0',
          },
        }}
      >
        <SandpackLayout style={{ border: 'none', borderRadius: 0 }}>
          <SandpackPreview
            showNavigator={false}
            showRefreshButton={false}
            style={{ height: 280, minHeight: 280 }}
          />
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}
