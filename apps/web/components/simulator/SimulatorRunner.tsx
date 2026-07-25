'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { LanguageToggle } from '@/components/editor/LanguageToggle';
import { ResultPanel } from '@/components/challenges/ResultPanel';
import { ConsolePanel } from '@/components/challenges/ConsolePanel';
import type { ConsoleEntry } from '@/components/challenges/ConsolePanel';
import { ChallengeDescription } from '@/components/challenges/ChallengeDescription';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ContentBreadcrumbs } from '@/components/content/ContentBreadcrumbs';
import type { ChallengeLanguage, ValidationResult } from '@/data/types';
import { getChallengeById } from '@/data';
import { prepareCodeForExecution } from '@/lib/code-runner';
import { cn } from '@/lib/utils';

const LANGUAGE_STORAGE_KEY = 'interview-gym-language';

interface SessionChallenge {
  id: string;
  order: number;
  challengeId: string;
  passed: boolean | null;
}

interface SessionData {
  id: string;
  durationMinutes: number;
  startedAt: string;
  completedAt: string | null;
  challenges: SessionChallenge[];
}

interface SimulatorRunnerProps {
  sessionId: string;
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function SimulatorRunner({ sessionId }: SimulatorRunnerProps) {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [language, setLanguage] = useState<ChallengeLanguage>('typescript');
  const [codeByLanguage, setCodeByLanguage] = useState<Record<ChallengeLanguage, string>>({
    javascript: '',
    typescript: '',
  });
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  const challengeStartRef = useRef(Date.now());
  const sessionEndRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completingRef = useRef(false);
  const codeRef = useRef(codeByLanguage);
  const languageRef = useRef(language);
  const challengeRef = useRef<ReturnType<typeof getChallengeById>>(undefined);
  const currentScRef = useRef<SessionChallenge | undefined>(undefined);

  const currentSc = session?.challenges[currentIndex];
  const challenge = currentSc ? getChallengeById(currentSc.challengeId) : undefined;
  const isLast = session ? currentIndex === session.challenges.length - 1 : false;
  const totalChallenges = session?.challenges.length ?? 0;

  codeRef.current = codeByLanguage;
  languageRef.current = language;
  challengeRef.current = challenge;
  currentScRef.current = currentSc;

  const completeSession = useCallback(
    async (pending?: {
      simulatorChallengeId: string;
      code: string;
      language: ChallengeLanguage;
      passed: boolean;
      timeSpentMs: number;
    }) => {
      if (completingRef.current) return;
      completingRef.current = true;
      setCompleting(true);

      if (timerRef.current) clearInterval(timerRef.current);

      try {
        const res = await fetch(`/api/simulator/${sessionId}/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pendingSubmissions: pending ? [pending] : [],
          }),
        });
        const data = await res.json();
        if (res.ok) {
          router.push(data.redirectUrl ?? `/simulator/${sessionId}/results`);
        }
      } catch {
        router.push(`/simulator/${sessionId}/results`);
      }
    },
    [sessionId, router]
  );

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(`/api/simulator/${sessionId}`);
        if (!res.ok) {
          router.push('/simulator');
          return;
        }
        const data: SessionData = await res.json();
        if (data.completedAt) {
          router.push(`/simulator/${sessionId}/results`);
          return;
        }
        setSession(data);

        const firstIncomplete = data.challenges.findIndex((c) => c.passed === null);
        setCurrentIndex(firstIncomplete >= 0 ? firstIncomplete : 0);

        const endTime =
          new Date(data.startedAt).getTime() + data.durationMinutes * 60 * 1000;
        sessionEndRef.current = endTime;
        setSecondsLeft(Math.max(0, Math.floor((endTime - Date.now()) / 1000)));
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [sessionId, router]);

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'javascript' || stored === 'typescript') {
      setLanguage(stored);
    }
  }, []);

  useEffect(() => {
    if (!challenge) return;
    setCodeByLanguage({
      javascript: challenge.starterCode.javascript,
      typescript: challenge.starterCode.typescript,
    });
    setResult(null);
    setConsoleLogs([]);
    challengeStartRef.current = Date.now();
  }, [challenge?.id]);

  useEffect(() => {
    if (loading || !session) return;

    timerRef.current = setInterval(async () => {
      const remaining = Math.max(
        0,
        Math.floor((sessionEndRef.current - Date.now()) / 1000)
      );
      setSecondsLeft(remaining);

      if (remaining <= 0 && !completingRef.current) {
        const ch = challengeRef.current;
        const sc = currentScRef.current;
        const lang = languageRef.current;
        const codeMap = codeRef.current;
        const timeSpentMs = Date.now() - challengeStartRef.current;

        let passed = false;
        if (ch) {
          try {
            const code = prepareCodeForExecution(codeMap[lang], lang);
            const validation = await ch.validate(code, lang);
            passed = validation.passed;
          } catch {
            passed = false;
          }
        }

        if (sc) {
          await completeSession({
            simulatorChallengeId: sc.id,
            code: codeMap[lang],
            language: lang,
            passed,
            timeSpentMs,
          });
        } else {
          await completeSession();
        }
      }
    }, 250);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, session, completeSession]);

  const handleLanguageChange = (lang: ChallengeLanguage) => {
    setLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const handleSubmit = async () => {
    if (!challenge || !currentSc || isSubmitting) return;
    setIsSubmitting(true);
    setIsRunning(true);
    setResult(null);

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

    let validationResult: ValidationResult = {
      passed: false,
      results: [],
    };

    try {
      const code = prepareCodeForExecution(codeByLanguage[language], language);
      validationResult = await challenge.validate(code, language);
      setConsoleLogs(captured);
      setResult(validationResult);

      const timeSpentMs = Date.now() - challengeStartRef.current;

      const res = await fetch(`/api/simulator/${sessionId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simulatorChallengeId: currentSc.id,
          code: codeByLanguage[language],
          language,
          passed: validationResult.passed,
          timeSpentMs,
        }),
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data.isLast) {
        await completeSession();
      } else {
        setCurrentIndex((i) => i + 1);
      }
    } catch {
      setConsoleLogs(captured);
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
      setIsSubmitting(false);
    }
  };

  const handleEndEarly = async () => {
    if (!window.confirm('End this session early? Your progress will be saved.')) return;

    const sc = currentScRef.current;
    const ch = challengeRef.current;
    const lang = languageRef.current;
    const codeMap = codeRef.current;

    if (sc && sc.passed === null) {
      const timeSpentMs = Date.now() - challengeStartRef.current;
      let passed = false;
      if (ch) {
        try {
          const code = prepareCodeForExecution(codeMap[lang], lang);
          const validation = await ch.validate(code, lang);
          passed = validation.passed;
        } catch {
          passed = false;
        }
      }
      await completeSession({
        simulatorChallengeId: sc.id,
        code: codeMap[lang],
        language: lang,
        passed,
        timeSpentMs,
      });
    } else {
      await completeSession();
    }
  };

  if (loading || !session || !challenge || !currentSc) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const urgent = secondsLeft <= 300;

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <div className="px-6 pt-4 bg-bg-surface border-b border-border-subtle">
        <ContentBreadcrumbs
          items={[
            { label: 'Simulator', href: '/simulator' },
            { label: 'Interview Session' },
          ]}
        />
      </div>
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-bg-surface">
        <div className="flex items-center gap-6">
          <span
            className={cn(
              'font-display font-bold text-3xl tabular-nums',
              urgent ? 'text-error' : 'text-text-primary'
            )}
          >
            {formatCountdown(secondsLeft)}
          </span>
          <span className="font-body text-base text-text-primary font-semibold">
            Challenge {currentIndex + 1} of {totalChallenges}
          </span>
        </div>
        <Button variant="ghost" onClick={handleEndEarly} disabled={completing}>
          End Session Early
        </Button>
      </header>

      {/* Main split panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-0 overflow-hidden">
        {/* Left: description */}
        <div className="lg:col-span-2 overflow-y-auto p-6 border-r border-border-subtle bg-bg-surface">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge type="difficulty" value={challenge.difficulty} />
              <Badge type="category" value={challenge.category} />
            </div>
            <h1 className="font-display font-bold text-2xl text-text-primary">
              {challenge.title}
            </h1>
            <ChallengeDescription description={challenge.description} />
          </div>
        </div>

        {/* Right: editor */}
        <div className="lg:col-span-3 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-subtle">
            <LanguageToggle language={language} onChange={handleLanguageChange} />
            <Button
              onClick={handleSubmit}
              disabled={isRunning || isSubmitting || completing}
            >
              {isRunning ? (
                <>
                  <Spinner size="sm" />
                  Running…
                </>
              ) : isLast ? (
                'Submit & Finish'
              ) : (
                'Submit & Next'
              )}
            </Button>
          </div>

          <div className="flex-1 min-h-0">
            <CodeEditor
              value={codeByLanguage[language]}
              onChange={(val) =>
                setCodeByLanguage((prev) => ({ ...prev, [language]: val }))
              }
              language={language}
            />
          </div>

          {result && (
            <div className="border-t border-border-subtle p-4 max-h-48 overflow-y-auto">
              <ResultPanel result={result} isRunning={isRunning} />
            </div>
          )}

          {consoleLogs.length > 0 && (
            <div className="border-t border-border-subtle p-4">
              <ConsolePanel
                entries={consoleLogs}
                onClear={() => setConsoleLogs([])}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
