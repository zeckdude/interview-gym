'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LearnStep } from '@/data/learn/types';
import { getOrderedHints, getStepHints } from '@/data/learn/hints';
import {
  LearnCodeBlock,
  LearnConceptNote,
  LearnGrowTextarea,
  LearnInlineText,
  LearnPromptText,
  ResultPanel,
  type LearnCodeEditorHandle,
} from '@/components/learn/LearnCodeBlock';
import { LearnCallout } from '@/components/learn/LearnReferencePanel';
import { Button } from '@/components/ui/Button';
import {
  isErrorExpectedOutput,
  isErrorLabel,
  getPredictRuntimeReference,
  runDemoCode,
  runLearnCode,
  validateCodeChallenge,
  validatePredictOutput,
  getPredictOutputStructure,
  formatQuotedPredictAnswer,
  formatQuotedDisplayOutput,
  getCodeChallengeGoalDisplay,
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
  getChallengeDebrief,
  isChallengeYourselfSection,
  isOptionalLearnStep,
  learnStepHintsAllowed,
  learnStepRevealAllowed,
} from '@/lib/learn/challenge-yourself';
import { LearnOptionalChallengeDebrief } from '@/components/learn/LearnChallengeDebriefPanel';
import {
  loadLearnStepState,
  saveLearnStepState,
  type LearnStepStoredState,
} from '@/lib/learn/step-storage';
import { LearnRecommendedAnswer } from '@/components/learn/LearnRecommendedAnswer';
import { LearnErrorPickerPopover } from '@/components/learn/LearnErrorPickerPopover';
import {
  findLearnErrorOption,
  findLearnErrorOptionForReference,
  findLearnErrorOptionInList,
  isCorrectLearnErrorPick,
  type LearnErrorOption,
} from '@/lib/learn/learned-errors';
import {
  combineLearnCode,
  extractUserCodeFromStored,
  findErrorLineInCode,
  findOutputMismatchLine,
  mapFullCodeLineToUserLine,
} from '@/lib/learn/code-error-line';
import type { ResolvedLearningSettings } from '@/lib/learn/learning-preferences';
import { LearnRevealComparison } from '@/components/learn/LearnRevealComparison';
import { LearnTypeReferenceTable } from '@/components/learn/LearnTypeReferenceTable';
import { cn } from '@/lib/utils';
import { useScrollToNewActiveStepContent } from '@/hooks/useScrollToNewActiveStepContent';

interface LearnStepViewProps {
  step: LearnStep;
  moduleId: string;
  onComplete: () => void;
  isActive: boolean;
  isCompleted: boolean;
  /** When the prior step is a "Here's a code problem:" intro, skip duplicate prompt. */
  previousStep?: LearnStep;
  /** Error variants taught before this step — shown when "Throws error" is selected. */
  availableLearnErrors?: LearnErrorOption[];
  /** Increment to auto-fill the recommended answer (development only). */
  devSkipNonce?: number;
  learningSettings: ResolvedLearningSettings;
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

function focusCodeEditorAtEnd(editor: LearnCodeEditorHandle | null) {
  editor?.focusAtEnd();
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

interface CodeChallengeStep {
  setupCode: string;
  starterCode: string;
  solutionCode: string;
}

function getChallengeFullCode(step: CodeChallengeStep, userCode: string): string {
  return combineLearnCode(step.setupCode, userCode);
}

function getSetupLineCount(setupCode: string): number {
  if (!setupCode.trim()) return 0;
  return setupCode.replace(/\r\n/g, '\n').split('\n').length;
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

function getPredictDisplayReference(
  step: Extract<LearnStep, { type: 'predict-output' }>,
  storedReference?: string
): string {
  const raw = getRuntimeReferenceForPredictStep(step, storedReference);
  if (stepExpectsError(step)) return raw;
  return formatQuotedDisplayOutput(step.code, raw);
}

function getCodeChallengeDisplayReference(
  step: Extract<LearnStep, { type: 'code-challenge' }>
): string {
  return `${step.setupCode}\n${step.solutionCode}`;
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
  availableLearnErrors = [],
  devSkipNonce,
  learningSettings,
}: LearnStepViewProps & { spacing?: LearnStepSpacing }) {
  const done = isCompleted;
  const sectionRef = useRef<HTMLElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const predictInputRef = useRef<HTMLTextAreaElement>(null);
  const throwsErrorBtnRef = useRef<HTMLButtonElement>(null);
  const codeRef = useRef<LearnCodeEditorHandle>(null);
  const predictFeedbackRef = useRef<HTMLDivElement>(null);
  const predictResultRef = useRef<HTMLDivElement>(null);
  const codeResultRef = useRef<HTMLDivElement>(null);
  const latestHintRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const recommendedRef = useRef<HTMLDivElement>(null);
  const debriefRef = useRef<HTMLDivElement>(null);
  const choiceFeedbackRef = useRef<HTMLDivElement>(null);
  const choiceExplanationRef = useRef<HTMLDivElement>(null);

  const [textAcknowledged, setTextAcknowledged] = useState(done);
  const [demoAcknowledged, setDemoAcknowledged] = useState(done);
  const [predictAnswer, setPredictAnswer] = useState('');
  const [predictsError, setPredictsError] = useState(false);
  const [errorPickerOpen, setErrorPickerOpen] = useState(false);
  const [selectedErrorId, setSelectedErrorId] = useState<string | null>(null);
  const [wrongErrorId, setWrongErrorId] = useState<string | null>(null);
  const [predictResult, setPredictResult] = useState<boolean | null>(done ? true : null);
  const [predictFeedbackMessage, setPredictFeedbackMessage] = useState<string | null>(null);
  const [predictReference, setPredictReference] = useState('');
  const [code, setCode] = useState('');
  const [codeHighlightLine, setCodeHighlightLine] = useState<number | undefined>();
  const [codeBeforeReveal, setCodeBeforeReveal] = useState('');
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
  const [optionalSkipped, setOptionalSkipped] = useState(false);
  const [debriefAcknowledged, setDebriefAcknowledged] = useState(false);
  const [showDebriefExpanded, setShowDebriefExpanded] = useState(false);
  const resumedCompletionRef = useRef(false);
  const lastDevSkipRef = useRef(0);

  const defaultHints =
    learnStepHintsAllowed(step) &&
    (step.type === 'predict-output' ||
      step.type === 'code-challenge' ||
      step.type === 'choice')
      ? getStepHints(step)
      : [];
  const orderedHints =
    learnStepHintsAllowed(step) &&
    (step.type === 'predict-output' ||
      step.type === 'code-challenge' ||
      step.type === 'choice')
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

  const challengeDebrief = getChallengeDebrief(step);

  const advanceAfterOptionalStep = useCallback(() => {
    if (isOptionalLearnStep(step) && challengeDebrief) {
      return;
    }
    scheduleComplete();
  }, [challengeDebrief, scheduleComplete, step]);

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

  const handleSkipOptional = useCallback(() => {
    if (!isOptionalLearnStep(step)) return;
    setOptionalSkipped(true);
    persistStepState({ skipped: true });
  }, [persistStepState, step]);

  const handleChallengeDebriefContinue = useCallback(() => {
    setDebriefAcknowledged(true);
    setShowDebriefExpanded(false);
    persistStepState({ debriefAcknowledged: true, showDebriefExpanded: false });
    onComplete();
  }, [onComplete, persistStepState]);

  const toggleDebriefExpanded = useCallback(() => {
    setShowDebriefExpanded((prev) => {
      const next = !prev;
      persistStepState({ showDebriefExpanded: next });
      return next;
    });
  }, [persistStepState]);

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
    setErrorPickerOpen(false);
    setPredictFeedbackMessage(null);
    setLastMistakeKind(null);
    setCodeHighlightLine(undefined);

    const stored = loadLearnStepState(moduleId, step.id);
    setHintLevel(stored?.hintLevel ?? 0);
    setRevealed(stored?.revealed ?? false);
    setShowRecommended(
      step.type === 'code-challenge' ? (stored?.showRecommended ?? false) : false
    );
    setOptionalSkipped(stored?.skipped ?? false);
    setDebriefAcknowledged(stored?.debriefAcknowledged ?? false);
    setShowDebriefExpanded(stored?.showDebriefExpanded ?? false);

    if (step.type === 'text' || step.type === 'review-gate') {
      setTextAcknowledged(done);
      return;
    }

    if (step.type === 'code-demo') {
      setDemoAcknowledged(done);
      return;
    }

    if (step.type === 'predict-output') {
      setAnswerRevealed(stored?.answerRevealed ?? false);
      setPredictsError(
        stored?.predictsError ??
          (stored?.predictAnswer?.trim().toLowerCase() === 'error' ? true : false)
      );
      setSelectedErrorId(stored?.selectedErrorId ?? null);
      setWrongErrorId(null);
      setPredictAnswer(
        stored?.predictAnswer ??
          (done ? getPredictDisplayReference(step, stored?.predictReference) : '')
      );
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
        extractUserCodeFromStored(
          stored?.code ?? `${step.setupCode}\n${step.starterCode}`,
          step.setupCode,
          step.starterCode
        )
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
      stored?.skipped === true ||
      (step.type === 'predict-output' && stored?.predictPassed === true) ||
      (step.type === 'code-challenge' && stored?.codePassed === true) ||
      (step.type === 'choice' && stored?.choicePassed === true);

    const debrief = getChallengeDebrief(step);
    if (alreadyPassed && debrief && !stored?.debriefAcknowledged) {
      return;
    }

    if (alreadyPassed) {
      resumedCompletionRef.current = true;
      scheduleComplete();
    }
  }, [isActive, step, moduleId, scheduleComplete]);

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

    const fullCode = getChallengeFullCode(step, step.solutionCode);
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

    const useErrorPicker =
      predictsError &&
      stepExpectsError(step) &&
      availableLearnErrors.length > 0;

    if (useErrorPicker && !selectedErrorId) return;

    const selectedOption = findLearnErrorOptionInList(selectedErrorId, availableLearnErrors);
    const answer = useErrorPicker
      ? selectedOption?.matchValues[0] ?? selectedOption?.label ?? ''
      : predictsError
        ? 'error'
        : predictInputRef.current?.value ?? predictAnswer;

    const executed = runLearnCode(step.code);
    const reference = executed.ok
      ? executed.output
      : executed.error ?? executed.output;

    let passedFromValidation: boolean;
    let quoteMessage: string | null = null;

    if (useErrorPicker && selectedOption) {
      passedFromValidation = isCorrectLearnErrorPick(
        selectedOption,
        reference,
        step.expectedOutput
      );
    } else {
      const validation = validatePredictOutput(
        answer,
        step.expectedOutput,
        step.id,
        step.code,
        step.acceptErrorShorthand || predictsError
      );
      passedFromValidation = validation.passed;
      quoteMessage = validation.needsStringQuotes ? validation.message : null;
    }

    setPredictReference(reference);
    setPredictResult(passedFromValidation);
    setPredictFeedbackMessage(quoteMessage);
    setWrongErrorId(passedFromValidation || !selectedErrorId ? null : selectedErrorId);

    persistStepState({
      predictAnswer: useErrorPicker
        ? selectedOption?.label ?? answer
        : predictsError
          ? 'error'
          : answer,
      predictReference: reference,
      predictPassed: passedFromValidation,
      predictsError,
      selectedErrorId: useErrorPicker ? selectedErrorId : null,
    });

    if (passedFromValidation) {
      logSuccess('predict-output');
      advanceAfterOptionalStep();
      return;
    }

    const mistakeKind = classifyPredictMistake(
      answer,
      reference,
      step.expectedOutput,
      {
        acceptErrorShorthand: step.acceptErrorShorthand,
        expectsError: step.expectsError,
        stepId: step.id,
        sourceCode: step.code,
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
      hintsShown: hintLevel,
      revealed,
    });
    if (useErrorPicker) {
      setErrorPickerOpen(true);
    }
  }, [
    step,
    predictAnswer,
    predictsError,
    availableLearnErrors.length,
    selectedErrorId,
    scheduleComplete,
    advanceAfterOptionalStep,
    logSuccess,
    moduleId,
    hintLevel,
    revealed,
    persistStepState,
  ]);

  const handleCodeRun = useCallback(() => {
    if (step.type !== 'code-challenge') return;
    const userCode = codeRef.current?.getValue() ?? code;
    const source = getChallengeFullCode(step, userCode);
    const result = validateCodeChallenge(
      source,
      step.expectedOutput,
      step.id,
      step.goalType ?? 'output',
      getCodeChallengeDisplayReference(step),
      step.outputFlex
    );
    const ran = runLearnCode(source);
    const actual =
      result.actual ||
      (result.passed
        ? step.goalType === 'error'
          ? step.expectedOutput
          : ran.output || step.expectedOutput
        : '');
    setCodeResult({ passed: result.passed, actual, message: result.message });
    persistStepState({
      code: source,
      codeActual: actual,
      codePassed: result.passed,
      codeMessage: result.message,
    });
    if (result.passed) {
      setCodeHighlightLine(undefined);
      logSuccess('code-challenge');
      advanceAfterOptionalStep();
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

    const setupLineCount = getSetupLineCount(step.setupCode);
    const errorMessage = ran.error ?? actual;
    const fullErrorLine = !ran.ok
      ? ran.errorLine ?? findErrorLineInCode(source, errorMessage) ?? undefined
      : ran.errorLine ?? findOutputMismatchLine(source);
    setCodeHighlightLine(
      learningSettings.errorLineHighlight
        ? mapFullCodeLineToUserLine(fullErrorLine, setupLineCount) ?? undefined
        : undefined
    );

    void recordHintEvent({
      moduleId,
      stepId: step.id,
      stepType: 'code-challenge',
      eventType: 'wrong_attempt',
      mistakeKind,
      answerFingerprint: fingerprintAnswer(actual),
      hintsShown: hintLevel,
      revealed,
    });
  }, [
    step,
    code,
    scheduleComplete,
    advanceAfterOptionalStep,
    logSuccess,
    moduleId,
    hintLevel,
    revealed,
    persistStepState,
    learningSettings.errorLineHighlight,
  ]);

  const handlePredictAnswerChange = useCallback(
    (value: string) => {
      setPredictAnswer(value);
      setSelectedErrorId(null);
      setWrongErrorId(null);
      setPredictFeedbackMessage(null);
      persistStepState({ predictAnswer: value, predictsError: false, selectedErrorId: null });
      setPredictsError(false);
    },
    [persistStepState]
  );

  const handleSelectPredictError = useCallback(() => {
    setPredictsError(true);
    setWrongErrorId(null);
    setPredictResult(null);
    setErrorPickerOpen(true);

    if (!predictsError) {
      setPredictAnswer('');
      setSelectedErrorId(null);
      persistStepState({
        predictsError: true,
        predictAnswer: '',
        selectedErrorId: null,
        predictPassed: null,
      });
      return;
    }

    persistStepState({ predictsError: true });
  }, [predictsError, persistStepState]);

  const handleSelectPredictOutput = useCallback(() => {
    setPredictsError(false);
    setSelectedErrorId(null);
    setWrongErrorId(null);
    setErrorPickerOpen(false);
    persistStepState({ predictsError: false, selectedErrorId: null });
    window.setTimeout(() => predictInputRef.current?.focus(), 0);
  }, [persistStepState]);

  const handleErrorPick = useCallback(
    (id: string) => {
      setSelectedErrorId(id);
      setWrongErrorId(null);
      setPredictResult(null);
      persistStepState({ selectedErrorId: id, predictPassed: null });
    },
    [persistStepState]
  );

  const selectedErrorOption = findLearnErrorOptionInList(selectedErrorId, availableLearnErrors);
  const showErrorPicker =
    step.type === 'predict-output' &&
    stepExpectsError(step) &&
    availableLearnErrors.length > 0;
  const predictDisplayAnswer = predictsError
    ? selectedErrorOption?.label ??
      (showErrorPicker ? '—' : 'Error')
    : predictAnswer;

  const handleCodeChange = useCallback(
    (value: string) => {
      setCode(value);
      setCodeHighlightLine(undefined);
      if (step.type !== 'code-challenge') return;
      persistStepState({ code: getChallengeFullCode(step, value) });
    },
    [persistStepState, step]
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
  }, [
    step,
    choiceIndex,
    scheduleComplete,
    persistStepState,
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
    persistStepState({ hintLevel: nextLevel });
  }, [step, moduleId, hints.length, hintLevel, lastMistakeKind, revealed, persistStepState]);

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
      const matchingError = findLearnErrorOptionForReference(
        answer,
        step.expectedOutput,
        availableLearnErrors
      );
      const structure = getPredictOutputStructure(step.code);
      const quotedAnswer =
        !stepExpectsError(step) && structure.length > 0
          ? formatQuotedPredictAnswer(structure)
          : answer;
      setPredictAnswer(matchingError?.label ?? quotedAnswer);
      setPredictReference(answer);
      setPredictResult(true);
      setAnswerRevealed(true);
      setPredictsError(Boolean(matchingError || stepExpectsError(step)));
      setSelectedErrorId(matchingError?.id ?? null);
      setWrongErrorId(null);
      setPredictFeedbackMessage(null);
      persistStepState({
        predictAnswer: matchingError?.label ?? quotedAnswer,
        predictReference: answer,
        predictPassed: true,
        answerRevealed: true,
        predictsError: Boolean(matchingError || stepExpectsError(step)),
        selectedErrorId: matchingError?.id ?? null,
        revealed: true,
        hintLevel,
      });
    }

    if (step.type === 'code-challenge') {
      setCodeBeforeReveal(codeRef.current?.getValue() ?? code);
      const fullCode = getChallengeFullCode(step, step.solutionCode);
      const ran = runLearnCode(fullCode);
      const actual =
        step.goalType === 'error'
          ? ran.error ?? ran.output ?? step.expectedOutput
          : ran.output || step.expectedOutput;
      setCode(step.solutionCode);
      setCodeResult({ passed: true, actual, message: '' });
      setCodeHighlightLine(undefined);
      setAnswerRevealed(true);
      persistStepState({
        code: fullCode,
        codeActual: actual,
        codePassed: true,
        codeMessage: '',
        answerRevealed: true,
        revealed: true,
        hintLevel,
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
    availableLearnErrors,
  ]);

  const completeWithRecommendedAnswer = useCallback(() => {
    if (!isActive || done) return;

    if (step.type === 'text' || step.type === 'review-gate') {
      setTextAcknowledged(true);
      onComplete();
      return;
    }

    if (step.type === 'code-demo') {
      setDemoAcknowledged(true);
      onComplete();
      return;
    }

    if (step.type === 'predict-output') {
      const reference = getRuntimeReferenceForPredictStep(step, predictReference);
      const expectsError = stepExpectsError(step);
      const matchingError = findLearnErrorOptionForReference(
        reference,
        step.expectedOutput,
        availableLearnErrors
      );
      const structure = getPredictOutputStructure(step.code);
      const quotedAnswer =
        !expectsError && structure.length > 0
          ? formatQuotedPredictAnswer(structure)
          : reference || step.expectedOutput;
      const answer = expectsError
        ? matchingError?.label ?? reference
        : quotedAnswer;

      setPredictAnswer(answer);
      setPredictReference(reference);
      setPredictResult(true);
      setPredictsError(expectsError);
      setSelectedErrorId(matchingError?.id ?? null);
      setWrongErrorId(null);
      setPredictFeedbackMessage(null);
      persistStepState({
        predictAnswer: answer,
        predictReference: reference,
        predictPassed: true,
        predictsError: expectsError,
        selectedErrorId: matchingError?.id ?? null,
      });
      advanceAfterOptionalStep();
      return;
    }

    if (step.type === 'code-challenge') {
      const fullCode = getChallengeFullCode(step, step.solutionCode);
      const result = validateCodeChallenge(
        fullCode,
        step.expectedOutput,
        step.id,
        step.goalType ?? 'output',
        fullCode,
        step.outputFlex
      );
      const actual =
        result.actual ||
        (step.goalType === 'error'
          ? step.expectedOutput
          : runLearnCode(fullCode).output || step.expectedOutput);

      setCode(step.solutionCode);
      setCodeResult({
        passed: true,
        actual,
        message: result.passed ? 'Correct!' : '',
      });
      setCodeHighlightLine(undefined);
      persistStepState({
        code: fullCode,
        codeActual: actual,
        codePassed: true,
        codeMessage: result.passed ? 'Correct!' : '',
      });
      advanceAfterOptionalStep();
      return;
    }

    if (step.type === 'choice') {
      setChoiceIndex(step.correctIndex);
      setChoiceResult(true);
      persistStepState({
        choiceIndex: step.correctIndex,
        choicePassed: true,
      });
      scheduleComplete();
    }
  }, [
    isActive,
    done,
    step,
    predictReference,
    availableLearnErrors,
    persistStepState,
    advanceAfterOptionalStep,
    onComplete,
  ]);

  useEffect(() => {
    if (!isActive) return;
    lastDevSkipRef.current = devSkipNonce ?? 0;
  }, [isActive, step.id]);

  useEffect(() => {
    if (!isActive || devSkipNonce == null || devSkipNonce === lastDevSkipRef.current) {
      return;
    }

    lastDevSkipRef.current = devSkipNonce;
    completeWithRecommendedAnswer();
  }, [devSkipNonce, isActive, completeWithRecommendedAnswer]);

  useEffect(() => {
    if (!isActive) return;

    const timer = window.setTimeout(() => {
      if (step.type === 'predict-output') {
        predictInputRef.current?.focus();
      } else if (step.type === 'code-challenge' && codeRef.current) {
        focusCodeEditorAtEnd(codeRef.current);
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

      if (tag === 'TEXTAREA' || tag === 'INPUT' || target.closest('.monaco-editor')) return;

      if (plainEnter && showContinue) {
        e.preventDefault();
        handleContinue();
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [isActive, showContinue, handleContinue]);

  const codeChallengeFullCode =
    step.type === 'code-challenge' ? getChallengeFullCode(step, code) : '';
  const codeRawOutput =
    step.type === 'code-challenge' && codeResult.passed !== null
      ? codeResult.actual || (codeResult.passed ? step.expectedOutput : '')
      : undefined;
  const codeDisplayOutput =
    codeRawOutput !== undefined && step.type === 'code-challenge'
      ? step.goalType === 'error' || isErrorLabel(codeRawOutput)
        ? codeRawOutput
        : formatQuotedDisplayOutput(codeChallengeFullCode, codeRawOutput)
      : undefined;
  const codeExpectedDisplay =
    step.type === 'code-challenge'
      ? getCodeChallengeGoalDisplay(step.expectedOutput, {
          goalType: step.goalType,
          outputFlex: step.outputFlex,
          stepId: step.id,
          displayReferenceCode: getCodeChallengeDisplayReference(step),
        })
      : undefined;

  const predictIsError =
    step.type === 'predict-output' && stepExpectsError(step);
  const predictDisplayReference =
    step.type === 'predict-output' ? getPredictDisplayReference(step, predictReference) : '';
  const demoRawOutput =
    step.type === 'code-demo' ? demoOutput ?? step.expectedOutput : '';
  const demoDisplayOutput =
    step.type === 'code-demo' &&
    !(step.expectsError ?? isErrorExpectedOutput(step.expectedOutput))
      ? formatQuotedDisplayOutput(step.code, demoRawOutput)
      : demoRawOutput;
  const choiceRuntimeReference =
    step.type === 'choice' && step.code
      ? getPredictRuntimeReference(step.code, step.choices[step.correctIndex] ?? '')
      : step.type === 'choice'
        ? step.choices[step.correctIndex] ?? ''
        : '';
  const choiceDisplayReference =
    step.type === 'choice' && step.code && choiceRuntimeReference
      ? formatQuotedDisplayOutput(step.code, choiceRuntimeReference)
      : choiceRuntimeReference;
  const showPredictFeedback =
    step.type === 'predict-output' &&
    predictResult !== null &&
    !(isActive && revealed);
  const predictShowResultOnly =
    predictIsError && predictResult === true && !answerRevealed;
  const showCodeEditor =
    step.type === 'code-challenge' &&
    isActive &&
    codeResult.passed !== true &&
    !optionalSkipped;
  const showCodeHistory =
    step.type === 'code-challenge' && !showCodeEditor && codeChallengeFullCode.trim().length > 0;
  const showExpectedErrorPanel =
    step.type === 'code-challenge' &&
    step.goalType === 'error' &&
    learningSettings.expectedErrorPanel;
  const outputDiffMode = learningSettings.outputDiffMode;
  const predictResultMode =
    predictShowResultOnly
      ? 'output-only'
      : predictResult === false && outputDiffMode !== 'off'
        ? 'full'
        : 'feedback-only';
  const hintsEnabled = learningSettings.hintsEnabled && learnStepHintsAllowed(step);
  const revealEnabled = learningSettings.revealEnabled && learnStepRevealAllowed(step);
  const optionalFinished =
    optionalSkipped ||
    (step.type === 'predict-output' && predictResult === true) ||
    (step.type === 'code-challenge' && codeResult.passed === true);
  const showOptionalSkip =
    isActive &&
    isOptionalLearnStep(step) &&
    !revealed &&
    !optionalFinished;

  const scrollContentRefs = useRef({
    predictFeedback: predictFeedbackRef,
    predictResult: predictResultRef,
    codeResult: codeResultRef,
    latestHint: latestHintRef,
    reveal: revealRef,
    recommended: recommendedRef,
    debrief: debriefRef,
    choiceFeedback: choiceFeedbackRef,
    choiceExplanation: choiceExplanationRef,
  }).current;

  useScrollToNewActiveStepContent(step.id, isActive, {
    hintLevel,
    revealed,
    predictResult,
    predictFeedbackMessage,
    showPredictFeedback,
    codeResultPassed: codeResult.passed,
    showRecommended,
    optionalFinished,
    showDebriefExpanded,
    choiceResult,
  }, scrollContentRefs);

  if (!isActive && !isCompleted) return null;

  const optionalChallengeDebrief =
    challengeDebrief && optionalFinished ? (
      <div ref={debriefRef} className="scroll-mt-24">
        <LearnOptionalChallengeDebrief
          debrief={challengeDebrief}
          skipped={optionalSkipped}
          solutionCode={
            step.type === 'code-challenge' ? step.solutionCode : undefined
          }
          debriefAcknowledged={debriefAcknowledged}
          open={showDebriefExpanded}
          onToggle={toggleDebriefExpanded}
          onContinue={handleChallengeDebriefContinue}
        />
      </div>
    ) : null;

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
      className={learnStepSectionClass(spacing, step)}
    >
      {step.type === 'text' && (
        <>
          {isChallengeYourselfSection(step) ? (
            <div className="rounded-xl border-2 border-dashed border-warning/50 bg-warning/5 p-6 space-y-4">
              <p className="font-body text-sm font-bold uppercase tracking-wide text-warning">
                Optional
              </p>
              {step.title && (
                <h2 className="font-display font-bold text-2xl text-text-primary">{step.title}</h2>
              )}
              <LearnInlineText content={step.content} />
            </div>
          ) : (
            <>
              {step.title && (
                <h2 className="font-display font-bold text-2xl text-text-primary">{step.title}</h2>
              )}
              {isTeachingIntroText(step) && !step.typeReference?.length ? (
                <LearnConceptNote content={step.content} />
              ) : (
                <LearnInlineText content={step.content} />
              )}
              {step.typeReference && step.typeReference.length > 0 && (
                <LearnTypeReferenceTable rows={step.typeReference} className="mt-6" />
              )}
              {step.footer && (
                <LearnInlineText content={step.footer} className="mt-6" />
              )}
            </>
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
            goal={demoDisplayOutput}
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
          {step.prompt && <LearnPromptText content={step.prompt} />}
          <LearnCodeBlock code={step.code} />

          {predictFeedbackMessage && showPredictFeedback && (
            <div ref={predictFeedbackRef} className="scroll-mt-24">
              <p className="font-body text-base text-text-primary border-l-4 border-error bg-error/5 rounded-r-lg px-4 py-3">
                {predictFeedbackMessage}
              </p>
            </div>
          )}

          {showPredictFeedback && (
            <div ref={predictResultRef} className="scroll-mt-24">
              <ResultPanel
              mode={predictResultMode}
              goal={
                predictShowResultOnly
                  ? predictDisplayReference
                  : predictResult === false && outputDiffMode !== 'off'
                    ? predictDisplayReference
                    : undefined
              }
              goalLabel={predictShowResultOnly ? 'Result' : undefined}
              yours={predictShowResultOnly ? undefined : predictDisplayAnswer}
              passed={predictResult}
              isError={predictIsError && predictResult !== true && !predictFeedbackMessage}
              yoursNote={answerRevealed ? 'revealed answer' : undefined}
              outputDiffMode={outputDiffMode}
            />
            </div>
          )}

          {isActive && !optionalFinished && !revealed && (
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
                  disabled={predictsError && showErrorPicker}
                  mutedShell={predictsError && showErrorPicker}
                  header={
                    predictIsError && !multilinePredict ? (
                      <div className="space-y-2">
                        <div className="inline-flex rounded-lg border border-border-subtle bg-bg-subtle p-1">
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
                          <div className="relative">
                            <button
                              ref={throwsErrorBtnRef}
                              type="button"
                              aria-pressed={predictsError}
                              aria-expanded={errorPickerOpen}
                              aria-haspopup="dialog"
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
                            {showErrorPicker && (
                              <LearnErrorPickerPopover
                                open={predictsError && errorPickerOpen}
                                onOpenChange={setErrorPickerOpen}
                                anchorRef={throwsErrorBtnRef}
                                options={availableLearnErrors}
                                selectedId={selectedErrorId}
                                wrongId={wrongErrorId}
                                onSelect={handleErrorPick}
                              />
                            )}
                          </div>
                        </div>
                        {predictsError && showErrorPicker && selectedErrorOption && !errorPickerOpen && (
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-body text-sm text-text-primary truncate">
                              {selectedErrorOption.label}
                            </span>
                            <button
                              type="button"
                              onClick={() => setErrorPickerOpen(true)}
                              className="font-body text-sm font-semibold text-brand shrink-0 hover:underline"
                            >
                              Change
                            </button>
                          </div>
                        )}
                      </div>
                    ) : undefined
                  }
                  placeholder={
                    multilinePredict
                      ? 'Type each line of output…'
                      : predictsError && showErrorPicker
                        ? selectedErrorOption
                          ? 'Press Run to check your pick'
                          : 'Pick an error beside Throws error'
                        : predictsError
                          ? 'Throws error — press Run to check'
                          : 'Type the output…'
                  }
                  aria-label="Your answer"
                  actions={
                    <>
                      <Button
                        onClick={handlePredictRun}
                        disabled={predictsError && showErrorPicker && !selectedErrorId}
                      >
                        Run ↵
                      </Button>
                      {hintsEnabled &&
                        hints.length > 0 &&
                        hintLevel < hints.length && (
                        <Button variant="secondary" onClick={handleHintClick}>
                          Hint
                        </Button>
                      )}
                      {revealEnabled &&
                        hints.length > 0 &&
                        hintLevel >= hints.length && (
                        <Button variant="secondary" onClick={handleReveal}>
                          Reveal answer
                        </Button>
                      )}
                      {showOptionalSkip && (
                        <Button variant="secondary" onClick={handleSkipOptional}>
                          Skip challenge →
                        </Button>
                      )}
                    </>
                  }
                />
                <p className="font-body text-sm text-text-muted">
                  {predictIsError && !multilinePredict ? (
                    predictsError && showErrorPicker ? (
                      predictResult === false
                        ? 'Wrong error — pick another option and Run again.'
                        : 'Throws error — pick the matching error, then Run.'
                    ) : predictsError ? (
                      'Throws error — press Run to check. · ⌘/Ctrl + Enter to run'
                    ) : (
                      'Prints output — wrap strings in quotes (e.g. `\'Paris\' 2`). · Press Enter for new line · ⌘/Ctrl + Enter to run'
                    )
                  ) : (
                    'Press Enter for a new line · ⌘/Ctrl + Enter to run'
                  )}
                </p>
              </div>

              {hintCallouts}
            </>
          )}

          {revealed && (
            <div ref={revealRef} className="scroll-mt-24">
            <LearnCallout title="Answer" variant="reveal">
              <p className="font-mono text-lg bg-bg-subtle rounded-lg px-4 py-3 whitespace-pre-wrap">
                {predictDisplayReference}
              </p>
              {step.revealExplanation && (
                <LearnInlineText content={step.revealExplanation} />
              )}
              <Button onClick={onComplete} className="mt-2">
                Got it — Continue →
              </Button>
            </LearnCallout>
            </div>
          )}

          {optionalChallengeDebrief}
        </>
      )}

      {step.type === 'choice' && (
        <>
          <LearnPromptText content={step.prompt} />
          {step.code && <LearnCodeBlock code={step.code} />}

          {choiceRuntimeReference && (choiceResult === true || done) && (
            <ResultPanel
              mode="output-only"
              goal={choiceDisplayReference}
              goalLabel="Result"
              passed
            />
          )}

          {choiceResult === false && choiceIndex !== null && (
            <div ref={choiceFeedbackRef} className="scroll-mt-24">
              <ResultPanel
                mode="feedback-only"
                yours={step.choices[choiceIndex] ?? ''}
                passed={false}
              />
            </div>
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
                <div ref={choiceExplanationRef} className="scroll-mt-24">
                <LearnCallout title="Not quite" variant="hint">
                  <LearnInlineText
                    content={step.explanation ?? 'Try again — pick the message that matches this error.'}
                  />
                </LearnCallout>
                </div>
              )}

              {hintCallouts}
            </>
          )}
        </>
      )}

      {step.type === 'code-challenge' && (
        <>
          {step.prompt && !isCodeProblemIntro(previousStep) && (
            <LearnPromptText content={step.prompt} />
          )}
          <div className="space-y-2">
            {showCodeEditor ? (
              <LearnCodeBlock
                ref={codeRef}
                code=""
                editable
                setupCode={learningSettings.setupCodeSplit ? step.setupCode : undefined}
                value={code}
                onChange={handleCodeChange}
                onRun={handleCodeRun}
                onHint={hintsEnabled ? handleHintClick : undefined}
                showHintButton={
                  hintsEnabled &&
                  hints.length > 0 &&
                  hintLevel < hints.length
                }
                highlightLine={codeHighlightLine}
                editorSettings={learningSettings}
                actions={
                  <>
                    <Button onClick={handleCodeRun}>Run ↵</Button>
                    {hintsEnabled &&
                      hints.length > 0 &&
                      hintLevel < hints.length && (
                      <Button variant="secondary" onClick={handleHintClick}>
                        Hint
                      </Button>
                    )}
                    {revealEnabled &&
                      hints.length > 0 &&
                      hintLevel >= hints.length &&
                      !revealed && (
                      <Button variant="secondary" onClick={handleReveal}>
                        Reveal answer
                      </Button>
                    )}
                    {!isOptionalLearnStep(step) && (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        handleCodeChange(step.starterCode);
                        setCodeResult({ passed: null, actual: '', message: '' });
                        setCodeHighlightLine(undefined);
                        setLastMistakeKind(null);
                        persistStepState({
                          code: getChallengeFullCode(step, step.starterCode),
                          codeActual: '',
                          codePassed: null,
                          codeMessage: '',
                        });
                      }}
                    >
                      Reset
                    </Button>
                    )}
                    {showOptionalSkip && (
                      <Button variant="secondary" onClick={handleSkipOptional}>
                        Skip challenge →
                      </Button>
                    )}
                  </>
                }
              />
            ) : showCodeHistory ? (
              <LearnCodeBlock code={codeChallengeFullCode} />
            ) : (
              <LearnCodeBlock
                ref={codeRef}
                code=""
                editable
                setupCode={learningSettings.setupCodeSplit ? step.setupCode : undefined}
                value={code}
                onChange={handleCodeChange}
                onRun={handleCodeRun}
                highlightLine={codeHighlightLine}
                editorSettings={learningSettings}
              />
            )}
            {showCodeEditor && (
              <p className="font-body text-sm text-text-muted">
                Tab to indent · Enter for a new line · ⌘/Ctrl + Enter to run
                {learningSettings.editorShortcuts && (
                  <span className="hidden sm:inline">
                    {' '}
                    · ⌘/Ctrl + / comment · ⌘/Ctrl + Shift + D duplicate line
                  </span>
                )}
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
            <div ref={codeResultRef} className="scroll-mt-24">
              <ResultPanel
              mode={
                codeResult.passed === false && outputDiffMode !== 'off'
                  ? 'full'
                  : 'feedback-only'
              }
              goal={
                codeResult.passed === false && outputDiffMode !== 'off'
                  ? codeExpectedDisplay
                  : undefined
              }
              yours={codeDisplayOutput}
              passed={codeResult.passed}
              isError={step.goalType === 'error' && codeResult.passed !== true}
              yoursNote={answerRevealed ? 'revealed answer' : undefined}
              outputDiffMode={outputDiffMode}
            />
            </div>
          )}

          {codeResult.message && codeResult.passed === false && outputDiffMode === 'off' && (
            <p className="font-body text-base text-error">{codeResult.message}</p>
          )}

          {codeResult.passed === true && !isOptionalLearnStep(step) && (
            <div ref={recommendedRef} className="scroll-mt-24">
            <LearnRecommendedAnswer open={showRecommended} onToggle={toggleRecommended}>
              <LearnCodeBlock code={step.solutionCode} />
              {step.revealExplanation && (
                <LearnInlineText content={step.revealExplanation} className="mt-3" />
              )}
            </LearnRecommendedAnswer>
            </div>
          )}

          {showCodeEditor && (
            <>
              {hintCallouts}
              {revealed && (
                <div ref={revealRef} className="scroll-mt-24">
                <LearnCallout title="Solution" variant="reveal">
                  {learningSettings.formatOnRevealComparison ? (
                    <LearnRevealComparison
                      setupCode={step.setupCode}
                      userCode={codeBeforeReveal || code}
                      solutionCode={step.solutionCode}
                    />
                  ) : (
                    <LearnCodeBlock
                      code={getChallengeFullCode(step, step.solutionCode)}
                    />
                  )}
                  {step.revealExplanation && (
                    <LearnInlineText content={step.revealExplanation} />
                  )}
                  <Button onClick={onComplete} className="mt-2">
                    Got it — Continue →
                  </Button>
                </LearnCallout>
                </div>
              )}
            </>
          )}

          {optionalChallengeDebrief}
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
