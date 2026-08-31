'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  LearnCodeBlock,
  LearnGrowTextarea,
  LearnPromptText,
  ResultPanel,
} from '@/components/learn/LearnCodeBlock';
import { Button } from '@/components/ui/Button';
import { getDefaultResolvedLearningSettings } from '@/lib/learn/learning-preferences';
import { runLearnCode } from '@/lib/learn/execute-code';
import { cn } from '@/lib/utils';

function DemoFeedback({
  passed,
  message,
}: {
  passed: boolean | null;
  message: string;
}) {
  if (passed === null) return null;
  return (
    <p
      className={cn(
        'font-body text-base border-l-4 rounded-r-lg px-4 py-3',
        passed
          ? 'border-success bg-success/5 text-success'
          : 'border-error bg-error/5 text-error'
      )}
    >
      {message}
    </p>
  );
}

/** Step through — line-by-line trace */
export function StepThroughPrototype() {
  const lines = [
    { line: 1, code: "let total = 0;", question: 'What is `total` after this line?', options: ['0', 'undefined', 'null'], answer: '0' },
    { line: 2, code: 'total = total + 5;', question: 'What is `total` now?', options: ['0', '5', '55'], answer: '5' },
    { line: 3, code: "console.log(total);", question: 'What prints?', options: ['0', '5', 'total'], answer: '5' },
  ];
  const [stepIndex, setStepIndex] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [result, setResult] = useState<boolean | null>(null);
  const step = lines[stepIndex]!;
  const visibleCode = lines
    .slice(0, stepIndex + 1)
    .map((l) => l.code)
    .join('\n');

  const check = () => {
    if (!pick) return;
    const ok = pick === step.answer;
    setResult(ok);
    if (ok && stepIndex < lines.length - 1) {
      setTimeout(() => {
        setStepIndex((i) => i + 1);
        setPick(null);
        setResult(null);
      }, 700);
    }
  };

  return (
    <div className="space-y-4">
      <LearnCodeBlock code={visibleCode} />
      <LearnPromptText content={step.question} />
      <fieldset className="space-y-2">
        {step.options.map((opt) => (
          <label
            key={opt}
            className={cn(
              'flex items-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer',
              pick === opt ? 'border-brand bg-brand/5' : 'border-border-subtle'
            )}
          >
            <input
              type="radio"
              name="trace"
              checked={pick === opt}
              onChange={() => {
                setPick(opt);
                setResult(null);
              }}
            />
            <span className="font-mono text-base">{opt}</span>
          </label>
        ))}
      </fieldset>
      <div className="flex gap-2">
        <Button onClick={check} disabled={!pick}>
          Check
        </Button>
        {stepIndex === lines.length - 1 && result === true && (
          <span className="font-body text-success self-center">Trace complete ✓</span>
        )}
      </div>
      <DemoFeedback
        passed={result}
        message={result ? 'Correct — next line unlocked.' : 'Not quite — try another option.'}
      />
    </div>
  );
}

/** Find the bug — click a line */
export function FindBugPrototype() {
  const code = `const prices = [10, 20, 30];
let sum = 0;
for (let i = 0; i <= prices.length; i++) {
  sum += prices[i];
}
console.log(sum);`;
  const bugLine = 3;
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<boolean | null>(null);
  const codeLines = code.split('\n');

  return (
    <div className="space-y-4">
      <LearnPromptText content="This logs `NaN` instead of `60`. Click the line that causes the bug." />
      <div className="rounded-xl border border-border-subtle overflow-hidden font-mono text-sm">
        {codeLines.map((line, i) => {
          const lineNum = i + 1;
          const isSelected = selected === lineNum;
          return (
            <button
              key={lineNum}
              type="button"
              onClick={() => {
                setSelected(lineNum);
                setResult(lineNum === bugLine);
              }}
              className={cn(
                'w-full flex gap-4 px-4 py-2 text-left hover:bg-bg-subtle transition-colors',
                isSelected && result === true && 'bg-success/10',
                isSelected && result === false && 'bg-error/10'
              )}
            >
              <span className="text-text-muted w-6 shrink-0">{lineNum}</span>
              <span className="text-text-primary">{line || ' '}</span>
            </button>
          );
        })}
      </div>
      <DemoFeedback
        passed={result}
        message={
          result === true
            ? 'Right — `i <= prices.length` runs one past the last index.'
            : result === false
              ? 'That line looks fine — keep looking.'
              : ''
        }
      />
    </div>
  );
}

/** Put in order */
export function PutInOrderPrototype() {
  const correct = [
    "const name = 'Alex';",
    'const year = 2026;',
    'console.log(name);',
    'console.log(year);',
  ];
  const scrambled = [
    'console.log(year);',
    "const name = 'Alex';",
    'console.log(name);',
    'const year = 2026;',
  ];
  const [order, setOrder] = useState(scrambled);
  const [result, setResult] = useState<boolean | null>(null);

  const move = (index: number, dir: -1 | 1) => {
    const next = [...order];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    setOrder(next);
    setResult(null);
  };

  const check = () => {
    setResult(order.every((line, i) => line === correct[i]));
  };

  return (
    <div className="space-y-4">
      <LearnPromptText content="Reorder these lines so the program logs a name, then a year." />
      <ul className="space-y-2">
        {order.map((line, i) => (
          <li
            key={`${line}-${i}`}
            className="flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface p-3"
          >
            <div className="flex flex-col gap-1">
              <button
                type="button"
                aria-label="Move up"
                disabled={i === 0}
                onClick={() => move(i, -1)}
                className="text-xs px-2 py-0.5 rounded border border-border-subtle disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                aria-label="Move down"
                disabled={i === order.length - 1}
                onClick={() => move(i, 1)}
                className="text-xs px-2 py-0.5 rounded border border-border-subtle disabled:opacity-30"
              >
                ↓
              </button>
            </div>
            <code className="font-mono text-sm text-text-primary flex-1">{line}</code>
          </li>
        ))}
      </ul>
      <Button onClick={check}>Check order</Button>
      <DemoFeedback
        passed={result}
        message={result ? 'Correct order — declarations before logs.' : 'Not yet — think about what must run first.'}
      />
    </div>
  );
}

/** Fill the blank */
export function FillBlankPrototype() {
  const [blank, setBlank] = useState('');
  const [result, setResult] = useState<boolean | null>(null);

  return (
    <div className="space-y-4">
      <LearnPromptText content="Fill in the missing keyword so the value cannot be reassigned." />
      <div className="rounded-xl border border-border-subtle bg-code-bg p-4 font-mono text-base flex flex-wrap items-center gap-2">
        <span>___</span>
        <span>count = 3;</span>
        <input
          value={blank}
          onChange={(e) => {
            setBlank(e.target.value);
            setResult(null);
          }}
          className="w-24 px-2 py-1 rounded border border-brand/40 bg-bg-surface font-mono"
          placeholder="?"
          aria-label="Missing keyword"
        />
        <span>count = 4; // should throw</span>
      </div>
      <Button
        onClick={() => setResult(blank.trim().toLowerCase() === 'const')}
      >
        Check
      </Button>
      <DemoFeedback
        passed={result}
        message={result ? 'Yes — `const` blocks reassignment.' : 'Try the keyword for a constant binding.'}
      />
    </div>
  );
}

/** Smallest fix */
export function SmallestFixPrototype() {
  const fixes = [
    { id: 'a', label: "Change `let` to `const` on line 1", correct: false },
    { id: 'b', label: 'Change `i < 3` to `i <= 2`', correct: true },
    { id: 'c', label: 'Wrap the loop in try/catch', correct: false },
    { id: 'd', label: 'Delete the console.log', correct: false },
  ];
  const [pick, setPick] = useState<string | null>(null);
  const [result, setResult] = useState<boolean | null>(null);

  return (
    <div className="space-y-4">
      <LearnPromptText content="The loop runs one extra time. Pick the **smallest** fix." />
      <LearnCodeBlock
        code={`for (let i = 0; i <= 3; i++) {
  console.log(i);
}`}
      />
      <fieldset className="space-y-2">
        {fixes.map((fix) => (
          <label
            key={fix.id}
            className={cn(
              'flex items-start gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer',
              pick === fix.id ? 'border-brand bg-brand/5' : 'border-border-subtle'
            )}
          >
            <input
              type="radio"
              name="fix"
              checked={pick === fix.id}
              onChange={() => {
                setPick(fix.id);
                setResult(null);
              }}
            />
            <span className="font-body text-base">{fix.label}</span>
          </label>
        ))}
      </fieldset>
      <Button
        onClick={() => {
          const chosen = fixes.find((f) => f.id === pick);
          setResult(chosen?.correct ?? false);
        }}
        disabled={!pick}
      >
        Check
      </Button>
      <DemoFeedback
        passed={result}
        message={
          result
            ? 'Minimal change — fixes the off-by-one without extra noise.'
            : 'That might change behavior, but it is not the smallest correct fix.'
        }
      />
    </div>
  );
}

/** What changed? */
export function WhatChangedPrototype() {
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<boolean | null>(null);
  const acceptable = ['51', "'51'", '"51"', 'string concat', 'concatenation'];

  return (
    <div className="space-y-4">
      <LearnPromptText content="The code changed. What does `console.log(input + 1)` print now?" />
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="font-body text-sm font-bold uppercase text-text-secondary">Before</p>
          <LearnCodeBlock code={`const input = 5;\nconsole.log(input + 1);`} />
          <ResultPanel mode="output-only" goal="6" />
        </div>
        <div className="space-y-2">
          <p className="font-body text-sm font-bold uppercase text-text-secondary">After</p>
          <LearnCodeBlock code={`const input = '5';\nconsole.log(input + 1);`} />
        </div>
      </div>
      <LearnGrowTextarea
        value={answer}
        onChange={setAnswer}
        placeholder="Type the new output…"
        actions={
          <Button
            onClick={() => {
              const norm = answer.trim().toLowerCase();
              setResult(acceptable.some((a) => norm === a.toLowerCase() || norm.includes('51')));
            }}
          >
            Check
          </Button>
        }
      />
      <DemoFeedback
        passed={result}
        message={result ? "Right — string + number becomes string concat: `'51'`." : "Hint: `'5' + 1` is not numeric addition."}
      />
    </div>
  );
}

/** Try it yourself — sandbox */
export function TryItPrototype() {
  const starter = `const value = 10;
console.log(value);
// Change value to a string, then run again`;
  const [code, setCode] = useState(starter);
  const [observation, setObservation] = useState('');
  const [runOut, setRunOut] = useState('');
  const settings = getDefaultResolvedLearningSettings();

  const run = () => {
    const result = runLearnCode(code);
    setRunOut(result.ok ? result.output : (result.error ?? result.output));
  };

  return (
    <div className="space-y-4">
      <LearnPromptText content="Change `value` to a string (e.g. `'10'`), run the code, then describe what changed in the output." />
      <LearnCodeBlock
        code=""
        editable
        value={code}
        onChange={setCode}
        onRun={run}
        editorSettings={settings}
        actions={<Button onClick={run}>Run ↵</Button>}
      />
      {runOut && <ResultPanel mode="output-only" goal={runOut} goalLabel="Console" />}
      <LearnGrowTextarea
        value={observation}
        onChange={setObservation}
        placeholder="What did you observe when you changed the type?"
      />
      <p className="font-body text-sm text-text-muted">
        Prototype — observation is not auto-graded; focus is on running and noticing.
      </p>
    </div>
  );
}

/** Watch & tinker — Scrimba-style */
export function WatchTinkerPrototype() {
  const script = useMemo(
    () => ({
      lines: [
        "const greeting = 'Hello';",
        'console.log(greeting);',
        'console.log(greeting.length);',
      ],
      narration: [
        'We store a greeting string in a const.',
        'First we print the string itself.',
        'Then we log how many characters it has — 5.',
      ],
    }),
    []
  );

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tinkerMode, setTinkerMode] = useState(false);
  const [tinkerCode, setTinkerCode] = useState('');
  const [runOut, setRunOut] = useState('');
  const settings = getDefaultResolvedLearningSettings();

  const displayedLines = script.lines.slice(0, lineIndex);
  const partial =
    lineIndex < script.lines.length
      ? script.lines[lineIndex]!.slice(0, charIndex)
      : '';
  const animatedCode = [...displayedLines, partial].filter(Boolean).join('\n');
  const complete = lineIndex >= script.lines.length;
  const overlayText =
    lineIndex < script.narration.length ? script.narration[lineIndex] : 'Done — pause anytime to tinker.';

  useEffect(() => {
    if (paused || tinkerMode || complete) return;
    const timer = setInterval(() => {
      setCharIndex((c) => {
        const line = script.lines[lineIndex]!;
        if (c < line.length) return c + 1;
        setLineIndex((l) => l + 1);
        return 0;
      });
    }, 45);
    return () => clearInterval(timer);
  }, [paused, tinkerMode, complete, lineIndex, script.lines]);

  const handlePause = () => {
    setTinkerCode(animatedCode);
    setPaused(true);
    setTinkerMode(true);
  };

  const handleResume = () => {
    setTinkerMode(false);
    setPaused(false);
    setRunOut('');
  };

  const runTinker = () => {
    const result = runLearnCode(tinkerCode);
    setRunOut(result.ok ? result.output : (result.error ?? result.output));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-brand/30 bg-brand/5 p-4 space-y-2">
        <p className="font-body text-base text-text-primary">{overlayText}</p>
        <p className="font-body text-sm text-text-muted">
          Voiceover: site TTS (`/api/ai/tts`) can attach here — not wired in this prototype.
        </p>
      </div>

      {tinkerMode ? (
        <>
          <LearnCodeBlock
            code=""
            editable
            value={tinkerCode}
            onChange={setTinkerCode}
            onRun={runTinker}
            editorSettings={settings}
            actions={
              <>
                <Button onClick={runTinker}>Run ↵</Button>
                <Button variant="secondary" onClick={handleResume}>
                  Exit tinker — resume animation
                </Button>
              </>
            }
          />
          {runOut && <ResultPanel mode="output-only" goal={runOut} goalLabel="Your run" />}
        </>
      ) : (
        <LearnCodeBlock code={animatedCode || '// typing…'} />
      )}

      <div className="flex flex-wrap gap-2">
        {!complete && !tinkerMode && (
          <Button variant="secondary" onClick={handlePause}>
            Pause & tinker
          </Button>
        )}
        {!tinkerMode && (
          <Button
            variant="secondary"
            onClick={() => {
              setLineIndex(0);
              setCharIndex(0);
              setPaused(false);
              setTinkerMode(false);
              setRunOut('');
            }}
          >
            Restart animation
          </Button>
        )}
      </div>
    </div>
  );
}

/** What's next? — pattern */
export function WhatsNextPrototype() {
  const examples = [
    { in: 'typeof 42', out: "'number'" },
    { in: "typeof 'hi'", out: "'string'" },
    { in: 'typeof true', out: "'boolean'" },
  ];
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<boolean | null>(null);

  return (
    <div className="space-y-4">
      <LearnPromptText content="What will `typeof null` return?" />
      <ul className="space-y-2 rounded-xl border border-border-subtle divide-y divide-border-subtle">
        {examples.map((ex) => (
          <li key={ex.in} className="flex justify-between gap-4 px-4 py-3 font-mono text-sm">
            <span>{ex.in}</span>
            <span className="text-success">→ {ex.out}</span>
          </li>
        ))}
      </ul>
      <LearnGrowTextarea
        value={answer}
        onChange={(v) => {
          setAnswer(v);
          setResult(null);
        }}
        placeholder="Type the typeof result…"
        actions={
          <Button
            onClick={() =>
              setResult(answer.trim().toLowerCase().replace(/['"]/g, '') === 'object')
            }
          >
            Check
          </Button>
        }
      />
      <DemoFeedback
        passed={result}
        message={
          result
            ? "Classic gotcha — `typeof null` is `'object'`."
            : "Use the pattern from the examples — watch for the null surprise."
        }
      />
    </div>
  );
}

/** Match them up */
export function MatchUpPrototype() {
  const left = [
    { id: 'l1', text: 'ReferenceError' },
    { id: 'l2', text: "'5' + 1" },
    { id: 'l3', text: 'const x = 1;' },
  ];
  const right = [
    { id: 'r1', text: 'Undeclared variable' },
    { id: 'r2', text: "Prints '51'" },
    { id: 'r3', text: 'Cannot reassign' },
  ];
  const pairs: Record<string, string> = { l1: 'r1', l2: 'r2', l3: 'r3' };

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);

  const pickLeft = (id: string) => {
    setSelectedLeft(id);
    setWrong(null);
  };

  const pickRight = (rightId: string) => {
    if (!selectedLeft) return;
    if (pairs[selectedLeft] === rightId) {
      setMatched((m) => new Set(m).add(selectedLeft).add(rightId));
      setSelectedLeft(null);
      setWrong(null);
    } else {
      setWrong(rightId);
    }
  };

  const done = matched.size === left.length + right.length;

  return (
    <div className="space-y-4">
      <LearnPromptText content="Match each item on the left to the best description on the right." />
      <div className="grid md:grid-cols-2 gap-6">
        <ul className="space-y-2">
          {left.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                disabled={matched.has(item.id)}
                onClick={() => pickLeft(item.id)}
                className={cn(
                  'w-full text-left rounded-lg border-2 px-4 py-3 font-mono text-sm transition-colors',
                  matched.has(item.id) && 'opacity-40 border-success/30',
                  selectedLeft === item.id && 'border-brand bg-brand/5',
                  !matched.has(item.id) && selectedLeft !== item.id && 'border-border-subtle hover:border-border-strong'
                )}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
        <ul className="space-y-2">
          {right.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                disabled={matched.has(item.id)}
                onClick={() => pickRight(item.id)}
                className={cn(
                  'w-full text-left rounded-lg border-2 px-4 py-3 font-body text-base transition-colors',
                  matched.has(item.id) && 'opacity-40 border-success/30',
                  wrong === item.id && 'border-error bg-error/5',
                  !matched.has(item.id) && wrong !== item.id && 'border-border-subtle hover:border-border-strong'
                )}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {done && (
        <p className="font-body text-success text-base">All pairs matched ✓</p>
      )}
    </div>
  );
}
