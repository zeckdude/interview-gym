# Learn Path Smart Hints — Phase 1 Complete

> You can delete this file at any time.

## What Phase 1 Shipped

- **Mistake classifiers** (`apps/web/lib/learn/mistake-classifier.ts`) — detect common wrong-answer patterns (comma vs space, stale values, missing lines, error confusion, etc.)
- **Hint routing** (`apps/web/data/learn/hints.ts`) — reorder default hints or use `mistakeHints` branches so the first hint shown matches the mistake
- **Auto-hint on wrong attempt** — first relevant hint appears immediately after a failed Run (no extra click)
- **Event logging** (`LearnHintEvent` table + `/api/learn/hint-event`) — tracks wrong attempts, hints shown, reveals, and successes
- **Audit script** — `npm run hint:audit` reports when Phase 2/3 are needed

## How to Check Hint Health

```bash
npm run hint:audit
```

Run after ~2 weeks of learn-path usage or ~50+ signed-in learners. If no events exist yet, the script tells you to wait.

## Phase 2 — Add `mistakeHints` Branches (Per Step)

**Do this for a specific step when ANY threshold is hit:**

| Signal | Threshold | Meaning |
|--------|-----------|---------|
| Generic fallback | `output_mismatch` in **>40%** of wrong attempts on that step | Classifiers can't distinguish mistakes |
| Reveal after struggle | **>25%** reveal rate on that step | Hints didn't unblock learners |
| All hints exhausted | **>50%** of wrong attempts use all 3 hints | Progressive ladder too slow |

**How:** Add `mistakeHints` to the step in module data:

```ts
mistakeHints: {
  comma_separator: [
    '`console.log(a, b)` prints values separated by a **space**, not a comma.',
    'Try again without the comma between the values.',
  ],
},
```

Fix the worst 5–10 steps first (audit ranks them). Don't branch every step upfront.

## Phase 3 — Optional AI Tutor Fallback

**Turn on when ANY global threshold is hit (after Phase 2 fixes on worst steps):**

| Signal | Threshold |
|--------|-----------|
| Global `output_mismatch` | **>30%** of all wrong attempts |
| Global reveal rate | **>15%** of all wrong attempts |

Wire an optional "Ask tutor" on learn pages (like challenge `AiChat`) — not live AI replacing structured hints.

## Success Targets (Phase 1 + targeted Phase 2)

- Reveal rate: **<10%** of failed attempts
- `output_mismatch`: **<25%** of wrong attempts
- Most learners succeed after **0–1** hint clicks

## Key Files

| File | Purpose |
|------|---------|
| `apps/web/lib/learn/mistake-kind.ts` | Types + threshold constants |
| `apps/web/lib/learn/mistake-classifier.ts` | Wrong-answer classification |
| `apps/web/data/learn/hints.ts` | Hint ordering + branch resolution |
| `apps/web/app/api/learn/hint-event/route.ts` | Event logging API |
| `scripts/hint-audit.mjs` | Health check + Phase 2/3 recommendations |
