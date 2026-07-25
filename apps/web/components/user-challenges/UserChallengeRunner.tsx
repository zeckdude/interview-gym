'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { UserChallenge } from '@prisma/client';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { LanguageToggle } from '@/components/editor/LanguageToggle';
import { ResultPanel } from '@/components/challenges/ResultPanel';
import { ConsolePanel } from '@/components/challenges/ConsolePanel';
import type { ConsoleEntry } from '@/components/challenges/ConsolePanel';
import { ChallengeDescription } from '@/components/challenges/ChallengeDescription';
import { NarrationPanel } from '@/components/challenges/NarrationPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useRightPanel } from '@/components/providers/RightPanelProvider';
import { CoachPanel } from '@/components/challenges/CoachPanel';
import { ImprovementPanel } from '@/components/challenges/ImprovementPanel';
import { ReviewPanel } from '@/components/challenges/ReviewPanel';
import { ContentBreadcrumbs } from '@/components/content/ContentBreadcrumbs';
import { ContentDetailMenu } from '@/components/content/ContentDetailMenu';
import type { ChallengeLanguage, ValidationResult } from '@/data/types';
import { userChallengeToChallenge } from '@/lib/user-challenge';
import { prepareCodeForExecution } from '@/lib/code-runner';
import type { ChallengeCategory, ChallengeDifficulty } from '@/data/types';

const LANGUAGE_STORAGE_KEY = 'interview-gym-language';

function codeStorageKey(id: string) {
  return `interview-gym-user-code-${id}`;
}

function loadSavedCode(
  challengeId: string,
  starterCode: Record<string, string>
): Record<string, string> {
  try {
    const raw = localStorage.getItem(codeStorageKey(challengeId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    /* ignore */
  }
  return starterCode;
}

function saveCode(challengeId: string, code: Record<string, string>) {
  try {
    localStorage.setItem(codeStorageKey(challengeId), JSON.stringify(code));
  } catch {
    /* ignore */
  }
}

interface UserChallengeRunnerProps {
  record: UserChallenge;
}

export function UserChallengeRunner({ record }: UserChallengeRunnerProps) {
  const challenge = userChallengeToChallenge(record);
  const { openConcepts, openChat, setChallengeCtx, isOpen } = useRightPanel();

  const [language, setLanguage] = useState<ChallengeLanguage>('typescript');
  const [codeByLanguage, setCodeByLanguage] = useState<Record<ChallengeLanguage, string>>(
    () =>
      loadSavedCode(record.id, {
        javascript: record.starterCodeJs,
        typescript: record.starterCodeTs,
      }) as Record<ChallengeLanguage, string>
  );
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [descriptionCollapsed, setDescriptionCollapsed] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [improveOpen, setImproveOpen] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'javascript' || stored === 'typescript') {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    setChallengeCtx({
      challengeId: record.id,
      title: record.title,
      description: record.description,
      currentCode: codeByLanguage[language],
      language,
    });
  }, [record, codeByLanguage, language, setChallengeCtx]);

  const handleLanguageChange = useCallback((lang: ChallengeLanguage) => {
    setLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setResult(null);
  }, []);

  const handleCodeChange = useCallback(
    (value: string) => {
      setCodeByLanguage((prev) => {
        const next = { ...prev, [language]: value };
        saveCode(record.id, next);
        return next;
      });
    },
    [language, record.id]
  );

  const handleRun = async () => {
    setIsRunning(true);
    setResult(null);
    setHasSubmitted(true);

    const captured: ConsoleEntry[] = [];
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    const capture =
      (type: ConsoleEntry['type']) =>
      (...args: unknown[]) => {
        captured.push({ type, args });
        if (type === 'log') originalLog(...args);
        else if (type === 'warn') originalWarn(...args);
        else if (type === 'error') originalError(...args);
        else if (type === 'info') originalInfo(...args);
      };

    console.log = capture('log');
    console.warn = capture('warn');
    console.error = capture('error');
    console.info = capture('info');

    try {
      const code = prepareCodeForExecution(codeByLanguage[language], language);
      const validationResult = await challenge.validate(code, language);
      setConsoleLogs(captured);
      if (captured.length > 0) setConsoleOpen(true);
      setResult(validationResult);

      await fetch(`/api/user-challenges/${record.id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passed: validationResult.passed,
          code,
          language,
        }),
      });
    } catch {
      setConsoleLogs(captured);
      if (captured.length > 0) setConsoleOpen(true);
      setResult({
        passed: false,
        results: [
          {
            description: 'Failed to run code',
            expected: 'Successful execution',
            actual: 'An unexpected error occurred',
            passed: false,
          },
        ],
      });
    } finally {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
      setIsRunning(false);
    }
  };

  const validatorNote = (
    <div className="mb-4 bg-warning-light border border-warning rounded-md px-4 py-3">
      <p className="font-body text-sm text-text-primary">
        <strong>Note:</strong> This challenge&apos;s validator checks your code against the
        AI-generated solution. Results may not be perfect.
      </p>
    </div>
  );

  const header = (
    <div className="space-y-4 mb-6">
      <div className="flex items-start justify-between gap-3">
        <ContentBreadcrumbs
          items={[
            { label: 'My Challenges', href: '/my-challenges' },
            { label: record.title },
          ]}
        />
        <ContentDetailMenu
          studyPlan={{
            itemType: 'user-challenge',
            itemId: record.id,
            source: 'generated',
          }}
        />
      </div>
      <div className="bg-bg-surface rounded-lg border border-border-subtle shadow-card px-6 py-5">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-sm bg-brand-light text-brand mb-2 inline-block">
            Generated by you
          </span>
          <h1 className="font-display font-bold text-2xl text-text-primary leading-tight">
            {record.title}
          </h1>
          {record.companyName && (
            <p className="font-body text-sm text-text-secondary mt-1">
              From: {record.companyName}
            </p>
          )}
        </div>
        <Link
          href={`/my-challenges/${record.id}/lesson`}
          className="font-body text-sm font-semibold px-4 py-2 rounded-md bg-bg-subtle hover:bg-brand-light text-text-secondary hover:text-brand border border-border-subtle hover:border-brand/30 transition-all"
        >
          📚 View Lesson First
        </Link>
      </div>
      <div className="flex gap-2">
        <Badge type="category" value={record.category as ChallengeCategory} />
        <Badge type="difficulty" value={record.difficulty as ChallengeDifficulty} />
      </div>
      </div>
    </div>
  );

  const aiButtons = (
    <div className="flex gap-3 mt-4 flex-wrap">
      <Button variant="secondary" onClick={() => setCoachOpen(true)}>
        💡 Get a Hint
      </Button>
      <Button variant="secondary" onClick={() => setReviewOpen(true)} disabled={!hasSubmitted}>
        🔍 What&apos;s Wrong?
      </Button>
      <Button variant="secondary" onClick={() => setImproveOpen(true)}>
        ✨ How to Improve
      </Button>
    </div>
  );

  const aiPanels = (
    <>
      <CoachPanel
        open={coachOpen}
        onClose={() => setCoachOpen(false)}
        challengeId={record.id}
        challengeDescription={record.description}
        concepts={record.concepts}
        userCode={codeByLanguage[language]}
        onCoachUsed={() => {}}
      />
      <ReviewPanel
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        challengeId={record.id}
        challengeDescription={record.description}
        userCode={codeByLanguage[language]}
        language={language}
        onReviewUsed={() => {}}
      />
      <ImprovementPanel
        open={improveOpen}
        onClose={() => setImproveOpen(false)}
        challengeId={record.id}
        userCode={codeByLanguage[language]}
        language={language}
        onImproveUsed={() => {}}
      />
    </>
  );

  const actionBar = (
    <div className="mt-4 flex items-center gap-3 flex-wrap">
      <Button onClick={handleRun} disabled={isRunning}>
        {isRunning ? 'Running…' : 'Run Code'}
      </Button>
      <button
        type="button"
        onClick={() => setConsoleOpen((v) => !v)}
        className={`text-sm font-body font-semibold px-4 py-2 rounded-md border transition-all duration-150 flex items-center gap-2 ${
          consoleOpen
            ? 'bg-[#1A1A1A] text-[#D4D0C8] border-[#333]'
            : 'bg-bg-subtle hover:bg-bg-muted text-text-secondary hover:text-text-primary border-border-subtle'
        }`}
      >
        <span className="font-mono text-xs">{'>'}_</span>
        Console
      </button>
      <button
        type="button"
        onClick={() => openChat()}
        className="ml-auto text-sm font-body font-semibold px-4 py-2 rounded-md bg-bg-subtle hover:bg-brand-light text-text-secondary hover:text-brand border border-border-subtle hover:border-brand/30 transition-all"
      >
        💬 Ask AI
      </button>
    </div>
  );

  const consolePanel = consoleOpen ? (
    <ConsolePanel entries={consoleLogs} onClear={() => setConsoleLogs([])} />
  ) : null;

  const descriptionBlock = (
    <div className="bg-bg-surface rounded-lg border border-border-subtle shadow-card px-6 py-6">
      <ChallengeDescription description={record.description} />
      <NarrationPanel challengeId={record.id} challengeType="user" />
    </div>
  );

  const conceptsBlock =
    record.concepts.length > 0 ? (
      <div className="bg-bg-surface rounded-lg border border-border-subtle shadow-card px-6 py-5">
        <h3 className="font-display font-semibold text-xs text-text-muted uppercase tracking-widest mb-4">
          Concepts covered
        </h3>
        <div className="flex flex-wrap gap-2">
          {record.concepts.map((concept) => (
            <button
              key={concept}
              type="button"
              onClick={() => openConcepts(concept)}
              className="text-sm font-body font-medium bg-bg-subtle hover:bg-brand-light text-text-primary hover:text-brand px-3 py-1.5 rounded-sm border border-border-subtle hover:border-brand/30 transition-all"
            >
              {concept}
            </button>
          ))}
        </div>
      </div>
    ) : null;

  const editorBlock = (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4 gap-2">
        <h2 className="font-display font-semibold text-lg text-text-primary">Your Solution</h2>
        <LanguageToggle language={language} onChange={handleLanguageChange} />
      </div>
      <CodeEditor
        language={language}
        value={codeByLanguage[language]}
        onChange={handleCodeChange}
      />
      {actionBar}
      {aiButtons}
      {aiPanels}
      {consolePanel}
      <ResultPanel result={result} isRunning={isRunning} />
    </div>
  );

  if (isOpen) {
    return (
      <div className="flex flex-col gap-6">
        {header}
        {validatorNote}
        {editorBlock}
        <div className="bg-bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden">
          <button
            type="button"
            onClick={() => setDescriptionCollapsed((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 font-body text-sm font-semibold text-text-primary hover:text-brand transition-colors"
          >
            <span>{descriptionCollapsed ? '▶ Show instructions' : '▼ Hide instructions'}</span>
          </button>
          {!descriptionCollapsed && (
            <div className="border-t border-border-subtle px-6 py-6 space-y-6">
              <ChallengeDescription description={record.description} />
              <NarrationPanel challengeId={record.id} challengeType="user" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {header}
      {validatorNote}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {descriptionBlock}
          {conceptsBlock}
        </div>
        <div className="lg:col-span-3">{editorBlock}</div>
      </div>
    </div>
  );
}
