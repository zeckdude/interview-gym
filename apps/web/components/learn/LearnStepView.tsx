'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LearnStep } from '@/data/learn/types';
import { getOrderedHints, getStepHints } from '@/data/learn/hints';
import {
  LearnCodeBlock,
  LearnConceptNote,
  LearnGrowTextarea,
  LearnInlineText,
  ResultPanel,
} from '@/components/learn/LearnCodeBlock';
import { LearnCallout } from '@/components/learn/LearnReferencePanel';
import { Button } from '@/components/ui/Button';
import {
  isErrorExpectedOutput,
  getPredictRuntimeReference,
  runDemoCode,
  runLearnCode,
  validateCodeChallenge,
  validatePredictOutput,
} from '@/lib/learn/execute-code';
import {
  classifyCodeChallengeMistake,
  classifyPredictMistake,
  fingerprintAnswer,
} from '@/lib/learn/mistake-classifier';
import type { MistakeKind } from '@/lib/learn/mistake-kind';
import { recordHintEvent } from '@/lib/learn/hint-events';
import {
  isCodeProblemIntro,
  isTeachingIntroText,
  learnStepSectionClass,
  type LearnStepSpacing,
} from '@/lib/learn/step-spacing';
import {
  loadLearnStepState,
  saveLearnStepState,
  type LearnStepStoredState,
} from '@/lib/learn/step-storage';
import { LearnRecommendedAnswer } from '@/components/learn/LearnRecommendedAnswer';
import { cn } from '@/lib/utils';

interface LearnStepViewProps {
  step: LearnStep;
  moduleId: string;
  onComplete: () => void;
  isActive: boolean;
  isCompleted: boolean;
  /** When the prior step is a "Here's a code problem:" intro, skip duplicate prompt. */
  previousStep?: LearnStep;
}

const SUCCESS_PAUSE_MS = 400;

async function recordStruggle(
  conceptTags: string[],
  moduleId: string,
  stepId: string
) {
  try {
    await fetch('/api/learn/struggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conceptTags, moduleId, stepId }),
    });
  } catch {
    /* non-blocking */
  }
}

function focusAtEnd(el: HTMLTextAreaElement) {
  el.focus();
  el.selectionStart = el.selectionEnd = el.value.length;
}

function handleModEnterRun(
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  run: () => void
) {
  if (e.key === 'Enter' && !e.nativeEvent.isComposing && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    run();
  }
}

function stepExpectsError(step: LearnStep): boolean {
  if (step.type === 'predict-output') {
    return Boolean(step.expectsError || isErrorExpectedOutput(step.expectedOutput));
  }
  if (step.type === 'code-challenge') {
    return step.goalType === 'error';
  }
  if (step.type === 'code-demo') {
    return Boolean(step.expectsError || isErrorExpectedOutput(step.expectedOutput));
  }
  return false;
}

function getRuntimeReferenceForPredictStep(
  step: Extract<LearnStep, { type: 'predict-output' }>,
  storedReference?: string
): string {
  return (
    storedReference ||
    getPredictRuntimeReference(step.code, step.expectedOutput)
  );
}

function expectsMultilineOutput(step: LearnStep): boolean {
  if (step.type !== 'predict-output') return false;
  return (
    step.expectedOutput.includes('\n') ||
    (step.code.match(/console\.log/g)?.length ?? 0) > 1
  );
}

export function LearnStepView({
  step,
  moduleId,
  onComplete,
  isActive,
  isCompleted,
  previousStep,
  spacing = 'standalone',
}: LearnStepViewProps & { spacing?: LearnStepSpacing }) {
  const done = isCompleted;
  const sectionRef = useRef<HTMLElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const predictInputRef = useRef<HTMLTextAreaElement>(null);
  const codeRef = useRef<HTMLTextAreaElement>(null);

  const [textAcknowledged, setTextAcknowledged] = useState(done);
  const [demoAcknowledged, setDemoAcknowledged] = useState(done);
  const [predictAnswer, setPredictAnswer] = useState('');
  const [predictsError, setPredictsError] = useState(false);
  const [predictResult, setPredictResult] = useState<boolean | null>(done ? true : null);
  const [predictReference, setPredictReference] = useState('');
  const [code, setCode] = useState('');
  const [codeResult, setCodeResult] = useState<{
    passed: boolean | null;
    actual: string;
    message: string;
  }>({ passed: done ? true : null, actual: '', message: '' });
  const [hintLevel, setHintLevel] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [lastMistakeKind, setLastMistakeKind] = useState<MistakeKind | null>(null);
  const [demoOutput, setDemoOutput] = useState<string | null>(null);
  const [choiceIndex, setChoiceIndex] = useState<number | null>(null);
  const [choiceResult, setChoiceResult] = useState<boolean | null>(done ? true : null);
  const [showRecommended, setShowRecommended] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const resumedCompletionRef = useRef(false);
  const latestHintRef = useRef<HTMLDivElement>(null);
  const prevHintLevelRef = useRef(0);

  const defaultHints =
    step.type === 'predict-output' ||
    step.type === 'code-challenge' ||
    step.type === 'choice'
      ? getStepHints(step)
      : [];
  const orderedHints =
    step.type === 'predict-output' ||
    step.type === 'code-challenge' ||
    step.type === 'choice'
      ? getOrderedHints(step, lastMistakeKind)
      : [];
  const hints = orderedHints.length > 0 ? orderedHints : defaultHints;
  const multilinePredict = step.type === 'predict-output' && expectsMultilineOutput(step);

  const showContinue =
    isActive &&
    ((step.type === 'text' && !textAcknowledged) ||
      (step.type === 'code-demo' && !demoAcknowledged && demoOutput !== null) ||
      (step.type === 'review-gate' && !textAcknowledged));

  const scheduleComplete = useCallback(() => {
    window.setTimeout(() => onComplete(), SUCCESS_PAUSE_MS);
  }, [onComplete]);

  const persistStepState = useCallback(
    (patch: LearnStepStoredState) => {
      if (
        step.type !== 'predict-output' &&
        step.type !== 'code-challenge' &&
        step.type !== 'choice'
      ) {
        return;
      }
      const existing = loadLearnStepState(moduleId, step.id) ?? {};
      saveLearnStepState(moduleId, step.id, { ...existing, ...patch });
    },
    [moduleId, step.id, step.type]
  );

  const toggleRecommended = useCallback(() => {
    if (step.type !== 'code-challenge') return;
    setShowRecommended((prev) => {
      const next = !prev;
      persistStepState({ showRecommended: next });
      return next;
    });
  }, [persistStepState, step.type]);

  useEffect(() => {
    setHintLevel(0);
    setRevealed(false);
    setAnswerRevealed(false);
    setLastMistakeKind(null);
    prevHintLevelRef.current = 0;

    const stored = loadLearnStepState(moduleId, step.id);
    setShowRecommended(
      step.type === 'code-challenge' ? (stored?.showRecommended ?? false) : false
    );

    if (step.type === 'predict-output') {
      setAnswerRevealed(stored?.answerRevealed ?? false);
      setPredictsError(
        stored?.predictsError ??
          (stored?.predictAnswer?.trim().toLowerCase() === 'error' ? true : false)
      );
      setPredictAnswer(stored?.predictAnswer ?? (done ? step.expectedOutput : ''));
      setPredictReference(
        stored?.predictReference ??
          (done || stored?.predictPassed
            ? getRuntimeReferenceForPredictStep(step, stored?.predictReference)
            : '')
      );
      setPredictResult(
        stored?.predictPassed ?? (done ? true : null)
      );
      return;
    }

    if (step.type === 'choice') {
      setChoiceIndex(stored?.choiceIndex ?? null);
      setChoiceResult(stored?.choicePassed ?? (done ? true : null));
      return;
    }

    if (step.type === 'code-challenge') {
      setAnswerRevealed(stored?.answerRevealed ?? false);
      setCode(
        stored?.code ?? `${step.setupCode}\n${step.starterCode}`
      );
      setCodeResult({
        passed: stored?.codePassed ?? (done ? true : null),
        actual: stored?.codeActual ?? '',
        message: stored?.codeMessage ?? '',
      });
    }
  }, [step, moduleId, done]);

  useEffect(() => {
    resumedCompletionRef.current = false;
  }, [step.id]);

  useEffect(() => {
    if (!isActive || resumedCompletionRef.current) return;

    const stored = loadLearnStepState(moduleId, step.id);
    const alreadyPassed =
      (step.type === 'predict-output' && stored?.predictPassed === true) ||
      (step.type === 'code-challenge' && stored?.codePassed === true) ||
      (step.type === 'choice' && stored?.choicePassed === true);

    if (alreadyPassed) {
      resumedCompletionRef.current = true;
      scheduleComplete();
    }
  }, [isActive, step, moduleId, scheduleComplete]);

  useEffect(() => {
    if (hintLevel <= prevHintLevelRef.current || hintLevel === 0) {
      prevHintLevelRef.current = hintLevel;
      return;
    }

    prevHintLevelRef.current = hintLevel;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        latestHintRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }, [hintLevel]);

  useEffect(() => {
    if (step.type === 'code-demo') {
      const result = runDemoCode(step.code);
      setDemoOutput(result.ok ? result.output : result.error ?? result.output);
    }
  }, [step]);

  useEffect(() => {
    if (step.type !== 'code-challenge' || !done || codeResult.actual) return;

    const stored = loadLearnStepState(moduleId, step.id);
    if (stored?.codeActual) return;

    const fullCode = `${step.setupCode}\n${step.solutionCode}`;
    const ran = runLearnCode(fullCode);
    if (ran.output) {
      setCodeResult((prev) => ({ ...prev, actual: ran.output }));
    }
  }, [step, moduleId, done, codeResult.actual]);

  const handleContinue = useCallback(() => {
    if (step.type === 'text' || step.type === 'review-gate') {
      setTextAcknowledged(true);
    }
    if (step.type === 'code-demo') {
      setDemoAcknowledged(true);
    }
    onComplete();
  }, [onComplete, step.type]);

  const logSuccess = useCallback(
    (stepType: 'predict-output' | 'code-challenge') => {
      void recordHintEvent({
        moduleId,
        stepId: step.id,
        stepType,
        eventType: 'success',
        mistakeKind: lastMistakeKind,
        hintsShown: hintLevel,
        revealed,
        eventuallyCorrect: true,
      });
    },
    [moduleId, step.id, lastMistakeKind, hintLevel, revealed]
  );

  const handlePredictRun = useCallback(() => {
    if (step.type !== 'predict-output') return;
    const answer = predictsError
      ? 'error'
      : predictInputRef.current?.value ?? predictAnswer;
    const result = validatePredictOutput(
      answer,
      step.expectedOutput,
      step.id,
      step.code,
      step.acceptErrorShorthand || predictsError
    );
    setPredictReference(result.reference);
    setPredictResult(result.passed);
    persistStepState({
      predictAnswer: predictsError ? 'error' : answer,
      predictReference: result.reference,
      predictPassed: result.passed,
      predictsError,
    });
    if (result.passed) {
      logSuccess('predict-output');
      scheduleComplete();
      return;
    }

    const mistakeKind = classifyPredictMistake(
      answer,
      result.reference,
      step.expectedOutput,
      {
        acceptErrorShorthand: step.acceptErrorShorthand,
        expectsError: step.expectsError,
        stepId: step.id,
      }
    );
    setLastMistakeKind(mistakeKind);
    void recordHintEvent({
      moduleId,
      stepId: step.id,
      stepType: 'predict-output',
      eventType: 'wrong_attempt',
      mistakeKind,
      answerFingerprint: fingerprintAnswer(answer),
      hintsShown: defaultHints.length > 0 && hintLevel === 0 ? 1 : hintLevel,
      revealed,
    });
    if (defaultHints.length > 0 && hintLevel === 0) {
      setHintLevel(1);
    }
  }, [
    step,
    predictAnswer,
    predictsError,
    scheduleComplete,
    logSuccess,
    moduleId,
    hintLevel,
    revealed,
    defaultHints.length,
    persistStepState,
  ]);

  const handleCodeRun = useCallback(() => {
    if (step.type !== 'code-challenge') return;
    const source = codeRef.current?.value ?? code;
    const result = validateCodeChallenge(
      source,
      step.expectedOutput,
      step.id,
      step.goalType ?? 'output'
    );
    const actual =
      result.actual ||
      (result.passed
        ? step.goalType === 'error'
          ? step.expectedOutput
          : runLearnCode(source).output || step.expectedOutput
        : '');
    setCodeResult({ passed: result.passed, actual, message: result.message });
    persistStepState({
      code: source,
      codeActual: actual,
      codePassed: result.passed,
      codeMessage: result.message,
    });
    if (result.passed) {
      logSuccess('code-challenge');
      scheduleComplete();
      return;
    }

    const mistakeKind = classifyCodeChallengeMistake(
      source,
      actual,
      step.expectedOutput,
      step.goalType ?? 'output',
      result.passed
    );
    setLastMistakeKind(mistakeKind);
    void recordHintEvent({
      moduleId,
      stepId: step.id,
      stepType: 'code-challenge',
      eventType: 'wrong_attempt',
      mistakeKind,
      answerFingerprint: fingerprintAnswer(actual),
      hintsShown: defaultHints.length > 0 && hintLevel === 0 ? 1 : hintLevel,
      revealed,
    });
    if (defaultHints.length > 0 && hintLevel === 0) {
      setHintLevel(1);
    }
  }, [
    step,
    code,
    scheduleComplete,
    logSuccess,
    moduleId,
    hintLevel,
    revealed,
    defaultHints.length,
    persistStepState,
  ]);

  const handlePredictAnswerChange = useCallback(
    (value: string) => {
      setPredictAnswer(value);
      persistStepState({ predictAnswer: value, predictsError: false });
      setPredictsError(false);
    },
    [persistStepState]
  );

  const handleSelectPredictError = useCallback(() => {
    setPredictsError(true);
    setPredictAnswer('');
    persistStepState({ predictsError: true, predictAnswer: '' });
  }, [persistStepState]);

  const handleSelectPredictOutput = useCallback(() => {
    setPredictsError(false);
    persistStepState({ predictsError: false });
    window.setTimeout(() => predictInputRef.current?.focus(), 0);
  }, [persistStepState]);

  const predictDisplayAnswer = predictsError ? 'Error' : predictAnswer;

  const handleCodeChange = useCallback(
    (value: string) => {
      setCode(value);
      persistStepState({ code: value });
    },
    [persistStepState]
  );

  const handleChoiceSubmit = useCallback(() => {
    if (step.type !== 'choice' || choiceIndex === null) return;
    const passed = choiceIndex === step.correctIndex;
    setChoiceResult(passed);
    persistStepState({ choiceIndex, choicePassed: passed });
    if (passed) {
      scheduleComplete();
      return;
    }
    if (defaultHints.length > 0 && hintLevel === 0) {
      setHintLevel(1);
    }
  }, [
    step,
    choiceIndex,
    scheduleComplete,
    persistStepState,
    defaultHints.length,
    hintLevel,
  ]);

  const handleHintClick = useCallback(() => {
    const tags = step.conceptTags ?? [];
    const nextLevel = Math.min(hintLevel + 1, hints.length);
    void recordStruggle(tags, moduleId, step.id);
    void recordHintEvent({
      moduleId,
      stepId: step.id,
      stepType: step.type === 'code-challenge' ? 'code-challenge' : 'predict-output',
      eventType: 'hint_shown',
      mistakeKind: lastMistakeKind,
      hintsShown: nextLevel,
      revealed,
    });
    setHintLevel(nextLevel);
  }, [step, moduleId, hints.length, hintLevel, lastMistakeKind, revealed]);

  const handleReveal = useCallback(() => {
    const tags = step.conceptTags ?? [];
    void recordStruggle(tags, moduleId, step.id);
    void recordHintEvent({
      moduleId,
      stepId: step.id,
      stepType: step.type === 'code-challenge' ? 'code-challenge' : 'predict-output',
      eventType: 'reveal',
      mistakeKind: lastMistakeKind,
      hintsShown: hintLevel,
      revealed: true,
    });

    if (step.type === 'predict-output') {
      const answer = getRuntimeReferenceForPredictStep(step, predictReference);
      setPredictAnswer(answer);
      setPredictReference(answer);
      setPredictResult(true);
      setAnswerRevealed(true);
      persistStepState({
        predictAnswer: answer,
        predictReference: answer,
        predictPassed: true,
        answerRevealed: true,
      });
    }

    if (step.type === 'code-challenge') {
      const fullCode = `${step.setupCode}\n${step.solutionCode}`;
      const ran = runLearnCode(fullCode);
      const actual =
        step.goalType === 'error'
          ? ran.error ?? ran.output ?? step.expectedOutput
          : ran.output || step.expectedOutput;
      setCode(fullCode);
      setCodeResult({ passed: true, actual, message: '' });
      setAnswerRevealed(true);
      persistStepState({
        code: fullCode,
        codeActual: actual,
        codePassed: true,
        codeMessage: '',
        answerRevealed: true,
      });
    }

    setRevealed(true);
  }, [
    step,
    moduleId,
    lastMistakeKind,
    hintLevel,
    predictReference,
    persistStepState,
  ]);

  useEffect(() => {
    if (!isActive) return;

    const timer = window.setTimeout(() => {
      if (step.type === 'predict-output') {
        predictInputRef.current?.focus();
      } else if (step.type === 'code-challenge' && codeRef.current) {
        focusAtEnd(codeRef.current);
      } else if (showContinue) {
        continueRef.current?.focus();
      }
    }, 120);

    return () => window.clearTimeout(timer);
  }, [isActive, step.type, showContinue]);

  useEffect(() => {
    if (!isActive) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName;
      const plainEnter =
        e.key === 'Enter' &&
        !e.isComposing &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.shiftKey &&
        !e.altKey;

      if (tag === 'TEXTAREA' || tag === 'INPUT') return;

      if (plainEnter && showContinue) {
        e.preventDefault();
        handleContinue();
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [isActive, showContinue, handleContinue]);

  const codeDisplayOutput =
    step.type === 'code-challenge' && codeResult.passed !== null
      ? codeResult.actual || (codeResult.passed ? step.expectedOutput : '')
      : undefined;

  const predictIsError =
    step.type === 'predict-output' && stepExpectsError(step);
  const predictRuntimeReference =
    step.type === 'predict-output'
      ? getRuntimeReferenceForPredictStep(step, predictReference)
      : '';
  const showPredictFeedback =
    step.type === 'predict-output' &&
    predictResult !== null &&
    !(isActive && revealed);
  const predictShowResultOnly =
    predictIsError && predictResult === true && !answerRevealed;
  const showCodeEditor =
    step.type === 'code-challenge' && isActive && codeResult.passed !== true;
  const showCodeHistory =
    step.type === 'code-challenge' && !showCodeEditor && code.trim().length > 0;
  const showExpectedErrorPanel =
    step.type === 'code-challenge' && step.goalType === 'error';
  const choiceRuntimeReference =
    step.type === 'choice' && step.code
      ? getPredictRuntimeReference(step.code, step.choices[step.correctIndex] ?? '')
      : step.type === 'choice'
        ? step.choices[step.correctIndex] ?? ''
        : '';

  if (!isActive && !isCompleted) return null;

  const hintCallouts = hints.slice(0, hintLevel).map((text, i) => (
    <div
      key={i}
      ref={i === hintLevel - 1 ? latestHintRef : undefined}
      className="scroll-mt-24"
    >
      <LearnCallout title={`Hint ${i + 1}`} variant="hint">
        <LearnInlineText content={text} />
      </LearnCallout>
    </div>
  ));

  return (
    <section
      ref={sectionRef}
      className={learnStepSectionClass(spacing)}
    >
      {step.type === 'text' && (
        <>
          {step.title && (
            <h2 className="font-display font-bold text-2xl text-text-primary">{step.title}</h2>
          )}
          {isTeachingIntroText(step) ? (
            <LearnConceptNote content={step.content} />
          ) : (
            <LearnInlineText content={step.content} />
          )}
          {showContinue && (
            <Button ref={continueRef} onClick={handleContinue}>
              Continue →
            </Button>
          )}
        </>
      )}

      {step.type === 'code-demo' && (
        <>
          <LearnCodeBlock code={step.code} />
          <ResultPanel
            mode="output-only"
            goal={demoOutput ?? step.expectedOutput}
            isError={step.expectsError ?? isErrorExpectedOutput(step.expectedOutput)}
          />
          {showContinue && (
            <Button ref={continueRef} onClick={handleContinue}>
              Continue →
            </Button>
          )}
        </>
      )}

      {step.type === 'predict-output' && (
        <>
          {step.prompt && (
            <p className="font-body text-xl font-semibold text-text-primary">{step.prompt}</p>
          )}
          <LearnCodeBlock code={step.code} />

          {showPredictFeedback && (
            <ResultPanel
              mode={
                predictShowResultOnly
                  ? 'output-only'
                  : predictIsError && predictResult !== true
                    ? 'full'
                    : 'feedback-only'
              }
              goal={
                predictShowResultOnly || (predictIsError && predictResult !== true)
                  ? predictRuntimeReference
                  : undefined
              }
              goalLabel={
                predictShowResultOnly
                  ? 'Result'
                  : predictIsError && predictResult !== true
                    ? 'Error output'
                    : undefined
              }
              yours={predictShowResultOnly ? undefined : predictDisplayAnswer}
              passed={predictResult}
              isError={predictIsError && predictResult !== true}
              yoursNote={answerRevealed ? 'revealed answer' : undefined}
            />
          )}

          {isActive && predictResult !== true && !revealed && (
            <>
              <div className="space-y-2">
                <label
                  htmlFor={`predict-${step.id}`}
                  className="font-body text-base font-semibold text-text-primary block mb-2"
                >
                  Your answer
                  {multilinePredict && (
                    <span className="font-normal text-text-muted ml-2 text-sm">
                      — one line per console.log output
                    </span>
                  )}
                </label>
                <LearnGrowTextarea
                  id={`predict-${step.id}`}
                  ref={predictInputRef}
                  value={predictAnswer}
                  onChange={handlePredictAnswerChange}
                  onKeyDown={(e) => handleModEnterRun(e, handlePredictRun)}
                  disabled={predictsError}
                  mutedShell={predictsError}
                  header={
                    predictIsError && !multilinePredict ? (
                      <div
                        className="inline-flex rounded-lg border border-border-subtle bg-bg-subtle p-1"
                        role="group"
                        aria-label="What happens when this runs?"
                      >
                        <button
                          type="button"
                          aria-pressed={!predictsError}
                          onClick={handleSelectPredictOutput}
                          className={cn(
                            'rounded-md px-3 py-1.5 font-body text-sm font-semibold transition-colors',
                            !predictsError
                              ? 'bg-bg-surface text-text-primary shadow-sm'
                              : 'text-text-muted hover:text-text-primary'
                          )}
                        >
                          Prints output
                        </button>
                        <button
                          type="button"
                          aria-pressed={predictsError}
                          onClick={handleSelectPredictError}
                          className={cn(
                            'rounded-md px-3 py-1.5 font-body text-sm font-semibold transition-colors',
                            predictsError
                              ? 'bg-cat-fe/15 text-cat-fe border border-cat-fe/30'
                              : 'text-text-muted hover:text-text-primary'
                          )}
                        >
                          Throws error
                        </button>
                      </div>
                    ) : undefined
                  }
                  placeholder={
                    multilinePredict
                      ? 'Type each line of output…'
                      : predictsError
                        ? 'Throws error — press Run to check'
                        : 'Type the output…'
                  }
                  aria-label="Your answer"
                  actions={
                    <>
                      <Button onClick={handlePredictRun}>Run ↵</Button>
                      {hints.length > 0 && hintLevel < hints.length && (
                        <Button variant="secondary" onClick={handleHintClick}>
                          Hint
                        </Button>
                      )}
                      {hints.length > 0 && hintLevel >= hints.length && (
                        <Button variant="secondary" onClick={handleReveal}>
                          Reveal answer
                        </Button>
                      )}
                    </>
                  }
                />
                <p className="font-body text-sm text-text-muted">
                  Press Enter for a new line · ⌘/Ctrl + Enter to run
                </p>
              </div>

              {hintCallouts}
            </>
          )}

          {revealed && (
            <LearnCallout title="Answer" variant="reveal">
              <p className="font-mono text-lg bg-bg-subtle rounded-lg px-4 py-3 whitespace-pre-wrap">
                {predictRuntimeReference}
              </p>
              {step.revealExplanation && (
                <LearnInlineText content={step.revealExplanation} />
              )}
              <Button onClick={onComplete} className="mt-2">
                Got it — Continue →
              </Button>
            </LearnCallout>
          )}
        </>
      )}

      {step.type === 'choice' && (
        <>
          <p className="font-body text-xl font-semibold text-text-primary">{step.prompt}</p>
          {step.code && <LearnCodeBlock code={step.code} />}

          {choiceRuntimeReference && (choiceResult === true || done) && (
            <ResultPanel
              mode="output-only"
              goal={choiceRuntimeReference}
              goalLabel="Result"
              passed
            />
          )}

          {choiceResult === false && choiceIndex !== null && (
            <ResultPanel
              mode="feedback-only"
              yours={step.choices[choiceIndex] ?? ''}
              passed={false}
            />
          )}

          {isActive && choiceResult !== true && (
            <>
              <fieldset className="space-y-3">
                <legend className="font-body text-base font-semibold text-text-primary mb-2">
                  Pick the best answer
                </legend>
                {step.choices.map((choice, index) => {
                  const isSelected = choiceIndex === index;
                  const isWrongSelection = choiceResult === false && isSelected;
                  return (
                  <label
                    key={index}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-colors',
                      isWrongSelection
                        ? 'border-error/40 bg-error/5'
                        : isSelected
                          ? 'border-cat-fe bg-cat-fe/10'
                          : 'border-border-subtle bg-bg-surface hover:border-border-strong'
                    )}
                  >
                    <input
                      type="radio"
                      name={`choice-${step.id}`}
                      checked={isSelected}
                      onChange={() => {
                        setChoiceIndex(index);
                        setChoiceResult(null);
                        persistStepState({ choiceIndex: index, choicePassed: null });
                      }}
                      className="mt-1 h-4 w-4 accent-cat-fe"
                    />
                    <span className="font-mono text-base text-text-primary leading-relaxed">
                      {choice}
                    </span>
                  </label>
                  );
                })}
              </fieldset>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleChoiceSubmit} disabled={choiceIndex === null}>
                  Check answer
                </Button>
                {hints.length > 0 && hintLevel < hints.length && (
                  <Button variant="secondary" onClick={handleHintClick}>
                    Hint
                  </Button>
                )}
              </div>

              {choiceResult === false && (
                <LearnCallout title="Not quite" variant="hint">
                  <LearnInlineText
                    content={step.explanation ?? 'Try again — pick the message that matches this error.'}
                  />
                </LearnCallout>
              )}

              {hintCallouts}
            </>
          )}
        </>
      )}

      {step.type === 'code-challenge' && (
        <>
          {step.prompt && !isCodeProblemIntro(previousStep) && (
            <p className="font-body text-xl font-semibold text-text-primary">{step.prompt}</p>
          )}
          <div className="space-y-2">
            {showCodeEditor ? (
              <LearnCodeBlock
                ref={codeRef}
                code=""
                editable
                value={code}
                onChange={handleCodeChange}
                onKeyDown={(e) => handleModEnterRun(e, handleCodeRun)}
                actions={
                  <>
                    <Button onClick={handleCodeRun}>Run ↵</Button>
                    {hints.length > 0 && hintLevel < hints.length && (
                      <Button variant="secondary" onClick={handleHintClick}>
                        Hint
                      </Button>
                    )}
                    {hints.length > 0 && hintLevel >= hints.length && !revealed && (
                      <Button variant="secondary" onClick={handleReveal}>
                        Reveal answer
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const starter = `${step.setupCode}\n${step.starterCode}`;
                        handleCodeChange(starter);
                        setCodeResult({ passed: null, actual: '', message: '' });
                        persistStepState({
                          code: starter,
                          codeActual: '',
                          codePassed: null,
                          codeMessage: '',
                        });
                      }}
                    >
                      Reset
                    </Button>
                  </>
                }
              />
            ) : showCodeHistory ? (
              <LearnCodeBlock code={code} />
            ) : (
              <LearnCodeBlock
                ref={codeRef}
                code=""
                editable
                value={code}
                onChange={handleCodeChange}
                onKeyDown={(e) => handleModEnterRun(e, handleCodeRun)}
              />
            )}
            {showCodeEditor && (
              <p className="font-body text-sm text-text-muted">
                Press Enter for a new line · ⌘/Ctrl + Enter to run
              </p>
            )}
          </div>

          {showExpectedErrorPanel && (
            <ResultPanel
              mode="output-only"
              goal={step.expectedOutput}
              goalLabel="Expected result"
              goalVariant="expected"
            />
          )}

          {codeResult.passed !== null && (
            <ResultPanel
              mode="feedback-only"
              yours={codeDisplayOutput}
              passed={codeResult.passed}
              isError={step.goalType === 'error' && codeResult.passed !== true}
              yoursNote={answerRevealed ? 'revealed answer' : undefined}
            />
          )}

          {codeResult.message && codeResult.passed === false && (
            <p className="font-body text-base text-error">{codeResult.message}</p>
          )}

          {codeResult.passed === true && (
            <LearnRecommendedAnswer open={showRecommended} onToggle={toggleRecommended}>
              <LearnCodeBlock code={step.solutionCode} />
              {step.revealExplanation && (
                <LearnInlineText content={step.revealExplanation} className="mt-3" />
              )}
            </LearnRecommendedAnswer>
          )}

          {showCodeEditor && (
            <>
              {hintCallouts}
              {revealed && (
                <LearnCallout title="Solution" variant="reveal">
                  <LearnCodeBlock code={step.solutionCode} />
                  {step.revealExplanation && (
                    <LearnInlineText content={step.revealExplanation} />
                  )}
                  <Button onClick={onComplete} className="mt-2">
                    Got it — Continue →
                  </Button>
                </LearnCallout>
              )}
            </>
          )}
        </>
      )}

      {step.type === 'review-gate' && (
        <>
          <h2 className="font-display font-bold text-2xl text-text-primary">{step.title}</h2>
          <LearnInlineText content={step.content} />
          {showContinue && (
            <Button ref={continueRef} onClick={handleContinue}>
              Start review →
            </Button>
          )}
        </>
      )}
    </section>
  );
}
