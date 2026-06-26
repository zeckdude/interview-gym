'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { LanguageToggle } from '@/components/editor/LanguageToggle';
import { ResultPanel } from '@/components/challenges/ResultPanel';
import { ChallengeDescription } from '@/components/challenges/ChallengeDescription';
import { ConceptDrawer } from '@/components/challenges/ConceptDrawer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { ChallengeLanguage, ValidationResult } from '@/data/types';
import { getChallengeById } from '@/data';
import { prepareCodeForExecution } from '@/lib/code-runner';

const LANGUAGE_STORAGE_KEY = 'interview-gym-language';

interface ChallengeRunnerProps {
  challengeId: string;
}

export function ChallengeRunner({ challengeId }: ChallengeRunnerProps) {
  const challenge = getChallengeById(challengeId);

  const [language, setLanguage] = useState<ChallengeLanguage>('typescript');
  const [codeByLanguage, setCodeByLanguage] = useState<Record<ChallengeLanguage, string>>(
    () => ({
      javascript: challenge?.starterCode.javascript ?? '',
      typescript: challenge?.starterCode.typescript ?? '',
    })
  );
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showAttempts, setShowAttempts] = useState(false);
  const [activeConcept, setActiveConcept] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'javascript' || stored === 'typescript') {
      setLanguage(stored);
    }
    startTimeRef.current = Date.now();
  }, [challengeId]);

  const handleLanguageChange = useCallback((lang: ChallengeLanguage) => {
    setLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setResult(null);
  }, []);

  const handleCodeChange = useCallback(
    (value: string) => {
      setCodeByLanguage((prev) => ({ ...prev, [language]: value }));
    },
    [language]
  );

  if (!challenge || challenge.comingSoon) {
    return null;
  }

  const handleRun = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      const code = prepareCodeForExecution(codeByLanguage[language], language);
      const validationResult = await challenge.validate(code, language);
      setResult(validationResult);

      const timeSpentMs = Date.now() - startTimeRef.current;

      await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          challengeType: challenge.category,
          language,
          code,
          passed: validationResult.passed,
          timeSpentMs,
        }),
      });
    } catch {
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
      setIsRunning(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[calc(100vh-8rem)]">
        {/* Left panel — 40% */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Title + badges */}
          <div className="bg-bg-surface dark:bg-[#1A1A1A] rounded-lg border border-border-subtle dark:border-[#2A2A2A] shadow-card px-6 py-5">
            <h1 className="font-display font-bold text-2xl text-text-primary dark:text-[#F0EDE8] mb-4 leading-tight">
              {challenge.title}
            </h1>
            <div className="flex gap-2">
              <Badge type="category" value={challenge.category} />
              <Badge type="difficulty" value={challenge.difficulty} />
            </div>
          </div>

          {/* Challenge description */}
          <div className="bg-bg-surface dark:bg-[#1A1A1A] rounded-lg border border-border-subtle dark:border-[#2A2A2A] shadow-card px-6 py-6">
            <ChallengeDescription description={challenge.description} />
          </div>

          {/* Concepts */}
          {challenge.concepts.length > 0 && (
            <div className="bg-bg-surface dark:bg-[#1A1A1A] rounded-lg border border-border-subtle dark:border-[#2A2A2A] shadow-card px-6 py-5">
              <h3 className="font-display font-semibold text-xs text-text-muted dark:text-[#8A8580] uppercase tracking-widest mb-4">
                Concepts covered
              </h3>
              <p className="font-body text-xs text-text-secondary dark:text-[#AAA5A0] mb-3">
                Click any concept to open a resource panel with an explanation and example.
              </p>
              <div className="flex flex-wrap gap-2">
                {challenge.concepts.map((concept) => (
                  <button
                    key={concept}
                    type="button"
                    onClick={() => setActiveConcept(concept)}
                    className="text-sm font-body font-medium bg-bg-subtle dark:bg-[#252525] hover:bg-brand-light dark:hover:bg-brand/20 text-text-primary dark:text-[#F0EDE8] hover:text-brand px-3 py-1.5 rounded-sm border border-border-subtle dark:border-[#2A2A2A] hover:border-brand/30 transition-all duration-150 cursor-pointer"
                  >
                    {concept}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Previous attempts */}
          <div className="bg-bg-surface dark:bg-[#1A1A1A] rounded-lg border border-border-subtle dark:border-[#2A2A2A] shadow-card px-6 py-5">
            <button
              type="button"
              onClick={() => setShowAttempts(!showAttempts)}
              className="font-body text-base font-semibold text-text-primary dark:text-[#F0EDE8] hover:text-brand flex items-center gap-2 w-full transition-colors"
            >
              <span className="text-text-muted dark:text-[#8A8580]">{showAttempts ? '▼' : '▶'}</span>
              Previous Attempts
            </button>
            {showAttempts && (
              <p className="mt-4 font-body text-base text-text-muted dark:text-[#8A8580] pl-6">
                Attempt history will be available in Phase 2.
              </p>
            )}
          </div>
        </div>

        {/* Right panel — 60% */}
        <div className="lg:col-span-3 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-text-primary dark:text-[#F0EDE8]">
              Your Solution
            </h2>
            <LanguageToggle language={language} onChange={handleLanguageChange} />
          </div>

          <CodeEditor
            language={language}
            value={codeByLanguage[language]}
            onChange={handleCodeChange}
          />

          <div className="mt-4 flex items-center gap-3">
            <Button onClick={handleRun} disabled={isRunning}>
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>

            <div className="flex gap-2 ml-auto">
              {['Get a Hint', "What's Wrong?", 'How to Improve'].map((label) => (
                <button
                  key={label}
                  type="button"
                  disabled
                  title="Coming in Phase 5"
                  className="text-xs font-body font-semibold px-3 py-2 rounded-md bg-bg-subtle dark:bg-[#252525] text-text-muted dark:text-[#8A8580] cursor-not-allowed"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <ResultPanel result={result} isRunning={isRunning} />
        </div>
      </div>

      {/* Concept drawer — rendered outside grid so it overlays correctly */}
      <ConceptDrawer
        concept={activeConcept}
        challengeTitle={challenge.title}
        onClose={() => setActiveConcept(null)}
      />
    </>
  );
}
