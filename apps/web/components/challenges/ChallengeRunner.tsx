'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { LivePreview } from '@/components/editor/LivePreview';
import { LanguageToggle } from '@/components/editor/LanguageToggle';
import { ResultPanel } from '@/components/challenges/ResultPanel';
import { ConsolePanel } from '@/components/challenges/ConsolePanel';
import type { ConsoleEntry } from '@/components/challenges/ConsolePanel';
import { ChallengeDescription } from '@/components/challenges/ChallengeDescription';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useBadgeCelebrationOptional } from '@/components/providers/BadgeCelebrationProvider';
import { useRightPanel } from '@/components/providers/RightPanelProvider';
import { CoachPanel } from '@/components/challenges/CoachPanel';
import { ImprovementPanel } from '@/components/challenges/ImprovementPanel';
import { ReviewPanel } from '@/components/challenges/ReviewPanel';
import { ChallengeNoteSection } from '@/components/challenges/ChallengeNoteSection';
import { NarrationPanel } from '@/components/challenges/NarrationPanel';
import { ContentBreadcrumbs } from '@/components/content/ContentBreadcrumbs';
import { ContentDetailMenu, MostAskedBadge } from '@/components/content/ContentDetailMenu';
import { StudyPlanBadge } from '@/components/study-plan/StudyPlanBadge';
import {
  NoteHintBanner,
  NoteHintModal,
  RevealedNoteCard,
} from '@/components/challenges/NoteHintModal';
import type { ChallengeLanguage, ValidationResult } from '@/data/types';
import { getChallengeById, getAdjacentChallenge } from '@/data';
import { useContentFilterQuery, useDetailPreservedQuery } from '@/hooks/useContentFilterQuery';
import { buildChallengePath, buildListPath } from '@/lib/content-filter-url';
import { getCuratedMostAskedForChallenge } from '@/lib/most-asked';
import { useMostAskedOptional } from '@/components/providers/MostAskedProvider';
import { prepareCodeForExecution } from '@/lib/code-runner';

const LANGUAGE_STORAGE_KEY = 'interview-gym-language';

// ── localStorage helpers ──────────────────────────────────────────────────────

function codeStorageKey(id: string) { return `interview-gym-code-${id}`; }
function passStorageKey(id: string) { return `interview-gym-passed-${id}`; }
function resultStorageKey(id: string) { return `interview-gym-result-${id}`; }

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
  } catch { /* ignore */ }
  return starterCode;
}

function saveCode(challengeId: string, code: Record<string, string>) {
  try { localStorage.setItem(codeStorageKey(challengeId), JSON.stringify(code)); }
  catch { /* ignore */ }
}

function loadPassStatus(challengeId: string): { passedAt: string } | null {
  try {
    const raw = localStorage.getItem(passStorageKey(challengeId));
    if (raw) return JSON.parse(raw) as { passedAt: string };
  } catch { /* ignore */ }
  return null;
}

function savePassStatus(challengeId: string) {
  try { localStorage.setItem(passStorageKey(challengeId), JSON.stringify({ passedAt: new Date().toISOString() })); }
  catch { /* ignore */ }
}

function loadSavedResult(challengeId: string): ValidationResult | null {
  try {
    const raw = localStorage.getItem(resultStorageKey(challengeId));
    if (raw) return JSON.parse(raw) as ValidationResult;
  } catch { /* ignore */ }
  return null;
}

function savePastResult(challengeId: string, result: ValidationResult) {
  try { localStorage.setItem(resultStorageKey(challengeId), JSON.stringify(result)); }
  catch { /* ignore */ }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface ChallengeRunnerProps {
  challengeId: string;
  weakSpot?: { failedAttempts: number } | null;
  isReviewSession?: boolean;
  initialNote?: { content: string; updatedAt: string } | null;
}

export function ChallengeRunner({
  challengeId,
  weakSpot,
  isReviewSession = false,
  initialNote = null,
}: ChallengeRunnerProps) {
  const challenge = getChallengeById(challengeId);
  const { openConcepts, openChat, setChallengeCtx, isOpen } = useRightPanel();
  const router = useRouter();
  const badgeCelebration = useBadgeCelebrationOptional();
  const filterQuery = useContentFilterQuery();
  const detailQuery = useDetailPreservedQuery();
  const mostAskedCtx = useMostAskedOptional();

  const prevChallenge = getAdjacentChallenge(challengeId, 'prev');
  const nextChallenge = getAdjacentChallenge(challengeId, 'next');

  const goToChallenge = useCallback(
    (id: string) => {
      router.push(buildChallengePath(id, detailQuery));
    },
    [router, detailQuery]
  );

  const [language, setLanguage] = useState<ChallengeLanguage>('typescript');
  const [codeByLanguage, setCodeByLanguage] = useState<Record<ChallengeLanguage, string>>(
    () => loadSavedCode(challengeId, {
      javascript: challenge?.starterCode.javascript ?? '',
      typescript: challenge?.starterCode.typescript ?? '',
    })
  );
  const [result, setResult] = useState<ValidationResult | null>(
    () => loadSavedResult(challengeId)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [showAttempts, setShowAttempts] = useState(false);
  const [descriptionCollapsed, setDescriptionCollapsed] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([]);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [passStatus, setPassStatus] = useState<{ passedAt: string } | null>(
    () => loadPassStatus(challengeId)
  );
  const [hasSubmitted, setHasSubmitted] = useState(() => !!loadSavedResult(challengeId));
  const [coachOpen, setCoachOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [improveOpen, setImproveOpen] = useState(false);
  const [aiCoachUsed, setAiCoachUsed] = useState(false);
  const [aiReviewUsed, setAiReviewUsed] = useState(false);
  const [aiImproveUsed, setAiImproveUsed] = useState(false);
  const [noteHintUsed, setNoteHintUsed] = useState(false);
  const [noteHintModalOpen, setNoteHintModalOpen] = useState(false);
  const [noteRevealed, setNoteRevealed] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'javascript' || stored === 'typescript') {
      setLanguage(stored);
    }
    setCodeByLanguage(
      loadSavedCode(challengeId, {
        javascript: challenge?.starterCode.javascript ?? '',
        typescript: challenge?.starterCode.typescript ?? '',
      })
    );
    setResult(loadSavedResult(challengeId));
    setPassStatus(loadPassStatus(challengeId));
    setHasSubmitted(!!loadSavedResult(challengeId));
    setCoachOpen(false);
    setReviewOpen(false);
    setImproveOpen(false);
    setAiCoachUsed(false);
    setAiReviewUsed(false);
    setAiImproveUsed(false);
    setNoteHintUsed(false);
    setNoteHintModalOpen(false);
    setNoteRevealed(false);
    setConsoleLogs([]);
    setConsoleOpen(false);
    startTimeRef.current = Date.now();
  }, [challengeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep AI context current on every code/language change
  useEffect(() => {
    if (!challenge) return;
    setChallengeCtx({
      challengeId: challenge.id,
      title: challenge.title,
      description: challenge.description,
      currentCode: codeByLanguage[language],
      language,
    });
  }, [challenge, codeByLanguage, language, setChallengeCtx]);

  const handleLanguageChange = useCallback(
    (lang: ChallengeLanguage) => {
      setLanguage(lang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      setResult(null);
    },
    []
  );

  const handleCodeChange = useCallback(
    (value: string) => {
      setCodeByLanguage((prev) => {
        const next = { ...prev, [language]: value };
        saveCode(challengeId, next);
        return next;
      });
    },
    [language, challengeId]
  );

  const trackAiUsage = useCallback(
    async (flags: { aiCoachUsed?: boolean; aiReviewUsed?: boolean; aiImproveUsed?: boolean }) => {
      if (flags.aiCoachUsed) setAiCoachUsed(true);
      if (flags.aiReviewUsed) setAiReviewUsed(true);
      if (flags.aiImproveUsed) setAiImproveUsed(true);

      try {
        await fetch('/api/attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeId: challenge!.id,
            challengeType: challenge!.category,
            language,
            code: codeByLanguage[language],
            passed: false,
            aiCoachUsed: flags.aiCoachUsed ?? false,
            aiReviewUsed: flags.aiReviewUsed ?? false,
            aiImproveUsed: flags.aiImproveUsed ?? false,
            trackingOnly: true,
          }),
        });
      } catch {
        // Non-blocking — flags still sent on next Run Code
      }
    },
    [challenge, language, codeByLanguage]
  );

  if (!challenge || challenge.comingSoon) return null;

  const hasNote = !!initialNote?.content?.trim();

  const handleShowNote = async () => {
    setNoteHintModalOpen(false);
    setNoteRevealed(true);
    setNoteHintUsed(true);
    try {
      await fetch(`/api/notes/${challengeId}`, { method: 'PATCH' });
    } catch {
      // Non-blocking — hintUsed still sent on attempt submit
    }
  };

  const noteHintUi = isReviewSession && hasNote && (
    <>
      {!noteRevealed && <NoteHintBanner onViewNote={() => setNoteHintModalOpen(true)} />}
      {noteRevealed && initialNote && <RevealedNoteCard content={initialNote.content} />}
      <NoteHintModal
        open={noteHintModalOpen}
        onClose={() => setNoteHintModalOpen(false)}
        onShowNote={handleShowNote}
      />
    </>
  );

  const noteSection = (
    <ChallengeNoteSection
      challengeId={challengeId}
      initialContent={initialNote?.content ?? ''}
      initialUpdatedAt={initialNote?.updatedAt}
    />
  );

  const handleRun = async () => {
    setIsRunning(true);
    setResult(null);
    setHasSubmitted(true);

    // Capture console output during execution
    const captured: ConsoleEntry[] = [];
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    const capture =
      (type: ConsoleEntry['type']) =>
      (...args: unknown[]) => {
        captured.push({ type, args });
        // Still forward to the real browser console
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
      if (validationResult.passed) {
        savePastResult(challengeId, validationResult);
        if (!passStatus) {
          savePassStatus(challengeId);
          setPassStatus({ passedAt: new Date().toISOString() });
        }
      }
      const timeSpentMs = Date.now() - startTimeRef.current;
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: challenge.id,
          challengeType: challenge.category,
          language,
          code,
          passed: validationResult.passed,
          timeSpentMs,
          aiCoachUsed,
          aiReviewUsed,
          aiImproveUsed,
          hintUsed: noteHintUsed,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.newBadges?.length) {
          badgeCelebration?.showBadges(data.newBadges);
        }
      }
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

  if (!challenge) {
    return null;
  }

  const curatedMostAsked = getCuratedMostAskedForChallenge(challenge);
  const effectiveMostAsked =
    mostAskedCtx?.getEffective('challenge', challenge.id, curatedMostAsked) ?? {
      ...curatedMostAsked,
      isPersonalOverride: false,
    };

  // AI feature buttons + panels
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
        challengeId={challenge.id}
        challengeDescription={challenge.description}
        concepts={challenge.concepts}
        userCode={codeByLanguage[language]}
        onCoachUsed={() => trackAiUsage({ aiCoachUsed: true })}
      />
      <ReviewPanel
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        challengeId={challenge.id}
        challengeDescription={challenge.description}
        userCode={codeByLanguage[language]}
        language={language}
        onReviewUsed={() => trackAiUsage({ aiReviewUsed: true })}
      />
      <ImprovementPanel
        open={improveOpen}
        onClose={() => setImproveOpen(false)}
        challengeId={challenge.id}
        userCode={codeByLanguage[language]}
        language={language}
        onImproveUsed={() => trackAiUsage({ aiImproveUsed: true })}
      />
    </>
  );

  // Shared action bar used in both layouts
  const actionBar = (
    <div className="mt-4 flex items-center gap-3 flex-wrap">
      <Button onClick={handleRun} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Run Code'}
      </Button>
      <button
        type="button"
        onClick={() => setConsoleOpen((v) => !v)}
        className={`text-sm font-body font-semibold px-4 py-2 rounded-md border transition-all duration-150 flex items-center gap-2 ${
          consoleOpen
            ? 'bg-[#1A1A1A] text-[#D4D0C8] border-[#333] hover:border-[#555]'
            : 'bg-bg-subtle hover:bg-bg-muted text-text-secondary hover:text-text-primary border-border-subtle hover:border-border'
        }`}
      >
        <span className="font-mono text-xs">{'>'}_</span>
        Console
        {consoleLogs.length > 0 && (
          <span className="text-xs bg-brand/20 text-brand px-1.5 py-0.5 rounded-full">
            {consoleLogs.length}
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={() => openChat()}
        className="ml-auto text-sm font-body font-semibold px-4 py-2 rounded-md bg-bg-subtle hover:bg-brand-light text-text-secondary hover:text-brand border border-border-subtle hover:border-brand/30 transition-all duration-150"
      >
        💬 Ask AI
      </button>
    </div>
  );

  const consolePanel = consoleOpen ? (
    <ConsolePanel entries={consoleLogs} onClear={() => setConsoleLogs([])} />
  ) : null;

  // ── Shared: challenge navigation bar ─────────────────────────────────────────
  const breadcrumbs = challenge ? (
    <ContentBreadcrumbs
      items={[
        { label: 'Challenges', href: buildListPath('/challenges', filterQuery) },
        { label: challenge.title },
      ]}
    />
  ) : null;

  const challengeNav = (
    <div className="flex items-center justify-between mb-6">
      <button
        type="button"
        onClick={() => prevChallenge && goToChallenge(prevChallenge.id)}
        disabled={!prevChallenge}
        className="flex items-center gap-2 text-sm font-body font-semibold px-3 py-1.5 rounded-md border border-border-subtle bg-bg-surface hover:bg-bg-subtle hover:text-brand text-text-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-text-secondary disabled:hover:bg-bg-surface"
      >
        ← {prevChallenge ? prevChallenge.title : 'No previous'}
      </button>
      <button
        type="button"
        onClick={() => nextChallenge && goToChallenge(nextChallenge.id)}
        disabled={!nextChallenge}
        className="flex items-center gap-2 text-sm font-body font-semibold px-3 py-1.5 rounded-md border border-border-subtle bg-bg-surface hover:bg-bg-subtle hover:text-brand text-text-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-text-secondary disabled:hover:bg-bg-surface"
      >
        {nextChallenge ? nextChallenge.title : 'No next'} →
      </button>
    </div>
  );

  // ── Shared: already-solved banner ─────────────────────────────────────────
  const weakSpotBanner = weakSpot ? (
    <div className="mb-4 bg-warning-light border border-warning rounded-md px-4 py-3 flex items-center gap-2">
      <span>🚨</span>
      <p className="font-body text-sm text-text-primary">
        This is one of your weak spots — you&apos;ve failed it {weakSpot.failedAttempts} times.
        You&apos;ve got this. Focus up.
      </p>
    </div>
  ) : null;

  const solvedBanner = passStatus ? (
    <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-lg bg-success-light border border-success/30">
      <span className="text-success text-lg">✓</span>
      <div className="flex-1">
        <p className="font-body font-semibold text-success text-sm">
          You solved this on {formatDate(passStatus.passedAt)}
        </p>
        <p className="font-body text-xs text-success/70 mt-0.5">
          Your previous passing solution is shown below. Keep experimenting or move on.
        </p>
      </div>
      {nextChallenge && (
        <button
          type="button"
          onClick={() => goToChallenge(nextChallenge.id)}
          className="shrink-0 text-sm font-body font-bold px-4 py-2 rounded-md bg-success text-white hover:bg-success/90 transition-colors"
        >
          Next challenge →
        </button>
      )}
    </div>
  ) : null;

  // ── Shared: next challenge prompt (shown below results after a fresh pass) ──
  const nextChallengePrompt =
    result?.passed && nextChallenge ? (
      <div className="mt-4 flex items-center justify-between gap-4 px-4 py-3 rounded-lg bg-brand-light border border-brand/20">
        <p className="font-body font-semibold text-brand text-sm">
          Great work! Ready for the next challenge?
        </p>
        <button
          type="button"
          onClick={() => goToChallenge(nextChallenge.id)}
          className="shrink-0 text-sm font-body font-bold px-4 py-2 rounded-md bg-brand text-white hover:bg-brand/90 transition-colors"
        >
          {nextChallenge.title} →
        </button>
      </div>
    ) : null;

  // ── Panel-open layout: editor full-width on top, instructions collapsible below ──
  if (isOpen) {
    return (
      <div className="flex flex-col gap-6 min-h-[calc(100vh-8rem)]">
        {breadcrumbs}
        {challengeNav}
        {weakSpotBanner}
        {noteHintUi}
        {solvedBanner}
        {/* Editor — full width */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-4 gap-2">
            <h2 className="font-display font-semibold text-lg text-text-primary">
              Your Solution
            </h2>
            <LanguageToggle language={language} onChange={handleLanguageChange} />
          </div>
          <CodeEditor
            language={language}
            value={codeByLanguage[language]}
            onChange={handleCodeChange}
          />
          {challenge.hasLivePreview && (
            <LivePreview
              challenge={challenge}
              userCode={codeByLanguage[language]}
              language={language}
            />
          )}
          {actionBar}
          {aiButtons}
          {aiPanels}
          {consolePanel}
          <ResultPanel result={result} isRunning={isRunning} />
          {nextChallengePrompt}
          {noteSection}
        </div>

        {/* Instructions — collapsible below editor */}
        <div className="bg-bg-surface rounded-lg border border-border-subtle shadow-card overflow-hidden">
          <button
            type="button"
            onClick={() => setDescriptionCollapsed((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 font-body text-sm font-semibold text-text-primary hover:text-brand transition-colors"
          >
            <span className="flex items-center gap-2">
              <span>{descriptionCollapsed ? '▶' : '▼'}</span>
              <span>{challenge.title}</span>
              <Badge type="category" value={challenge.category} />
              <Badge type="difficulty" value={challenge.difficulty} />
            </span>
            <span className="text-text-muted text-xs">{descriptionCollapsed ? 'Show instructions' : 'Hide instructions'}</span>
          </button>

          {!descriptionCollapsed && (
            <div className="border-t border-border-subtle px-6 py-6 space-y-6">
              <ChallengeDescription description={challenge.description} />
              <NarrationPanel challengeId={challenge.id} challengeType="builtin" />

              {challenge.concepts.length > 0 && (
                <div>
                  <h3 className="font-display font-semibold text-xs text-text-muted uppercase tracking-widest mb-3">
                    Concepts covered
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {challenge.concepts.map((concept) => (
                      <button
                        key={concept}
                        type="button"
                        onClick={() => openConcepts(concept)}
                        className="text-sm font-body font-medium bg-bg-subtle hover:bg-brand-light text-text-primary hover:text-brand px-3 py-1.5 rounded-sm border border-border-subtle hover:border-brand/30 transition-all duration-150 cursor-pointer"
                      >
                        {concept}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Default layout: instructions left (2/5), editor right (3/5) ──
  return (
    <div className="flex flex-col gap-0">
      {breadcrumbs}
      {challengeNav}
      {weakSpotBanner}
      {noteHintUi}
      {solvedBanner}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[calc(100vh-8rem)]">
      {/* Left panel — description */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-bg-surface rounded-lg border border-border-subtle shadow-card px-6 py-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <h1 className="font-display font-bold text-2xl text-text-primary leading-tight">
              {challenge.title}
            </h1>
            <ContentDetailMenu
              mostAsked={{
                itemType: 'challenge',
                itemId: challenge.id,
                curated: curatedMostAsked,
              }}
              studyPlan={{
                itemType: 'challenge',
                itemId: challenge.id,
                source: 'challenge',
              }}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <Badge type="category" value={challenge.category} />
            <Badge type="difficulty" value={challenge.difficulty} />
            <StudyPlanBadge variant="challenge" itemId={challenge.id} linkToPlan />
            <MostAskedBadge
              mostAsked={effectiveMostAsked.mostAsked}
              isPersonalOverride={effectiveMostAsked.isPersonalOverride}
              reason={effectiveMostAsked.reason}
            />
          </div>
        </div>

        <div className="bg-bg-surface rounded-lg border border-border-subtle shadow-card px-6 py-6">
          <ChallengeDescription description={challenge.description} />
          <NarrationPanel challengeId={challenge.id} challengeType="builtin" />
        </div>

        {challenge.concepts.length > 0 && (
          <div className="bg-bg-surface rounded-lg border border-border-subtle shadow-card px-6 py-5">
            <h3 className="font-display font-semibold text-xs text-text-muted uppercase tracking-widest mb-4">
              Concepts covered
            </h3>
            <p className="font-body text-xs text-text-secondary mb-3">
              Click any concept to open a resource panel.
            </p>
            <div className="flex flex-wrap gap-2">
              {challenge.concepts.map((concept) => (
                <button
                  key={concept}
                  type="button"
                  onClick={() => openConcepts(concept)}
                  className="text-sm font-body font-medium bg-bg-subtle hover:bg-brand-light text-text-primary hover:text-brand px-3 py-1.5 rounded-sm border border-border-subtle hover:border-brand/30 transition-all duration-150 cursor-pointer"
                >
                  {concept}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-bg-surface rounded-lg border border-border-subtle shadow-card px-6 py-5">
          <button
            type="button"
            onClick={() => setShowAttempts(!showAttempts)}
            className="font-body text-base font-semibold text-text-primary hover:text-brand flex items-center gap-2 w-full transition-colors"
          >
            <span className="text-text-muted">{showAttempts ? '▼' : '▶'}</span>
            Previous Attempts
          </button>
          {showAttempts && (
            <p className="mt-4 font-body text-base text-text-muted pl-6">
              Attempt history will be available in Phase 2.
            </p>
          )}
        </div>
      </div>

      {/* Right panel — editor */}
      <div className="lg:col-span-3 flex flex-col">
        <div className="flex items-center justify-between mb-4 gap-2">
          <h2 className="font-display font-semibold text-lg text-text-primary">
            Your Solution
          </h2>
          <LanguageToggle language={language} onChange={handleLanguageChange} />
        </div>
        <CodeEditor
          language={language}
          value={codeByLanguage[language]}
          onChange={handleCodeChange}
        />
        {challenge.hasLivePreview && (
          <LivePreview
            challenge={challenge}
            userCode={codeByLanguage[language]}
            language={language}
          />
        )}
        {actionBar}
        {aiButtons}
        {aiPanels}
        {consolePanel}
        <ResultPanel result={result} isRunning={isRunning} />
        {nextChallengePrompt}
        {noteSection}
      </div>
      </div>
    </div>
  );
}
