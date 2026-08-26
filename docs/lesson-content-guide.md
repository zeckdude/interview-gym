# Lesson Content Guide

Standards for authoring Interview Gym lessons. Every lesson must teach *why* the concept matters in interviews, not just how to implement it.

## Required step structure (5–7 steps)

| Order | Step type | Title pattern | Purpose |
|-------|-----------|---------------|---------|
| 1 | `explanation` | Why This Matters | Concrete interview scenario — not "shows up often in interviews" |
| 2 | `explanation` | How It Works | Concept fundamentals, chunked into scannable bullets |
| 3 | `code-example` | Basic Example | Minimal working code |
| 4 | `code-example` | Interview Variation | Harder twist or edge-case handling |
| 5 | `gotcha` | Common Interview Trap | One specific wrong answer or edge case |
| 6 | `gotcha` | When NOT to Use This | Wrong tool for the job |

Steps 5–6 can be combined into one gotcha when the lesson is short. Never fewer than 5 steps.

## ADHD-friendly formatting rules

Apply these inside every `content` field (see also `AGENTS.md`):

- **Chunk prose.** No more than 3 sentences in a row without a break, heading, or list.
- **Use bold for key terms** the user must remember.
- **Use bullet lists** for comparisons, steps, and edge cases — never inline comma chains.
- **Use backticks** for code identifiers (`clamp`, `Array.isArray`).
- **Specific gotchas only.** Never write "mention edge cases" without naming the actual edge case.
- **Real links in `mdnLinks`.** No placeholder `developer.mozilla.org/` URLs.

## Interview framing template

**Why This Matters** should answer:

1. What real product or interview task needs this?
2. What would an interviewer ask you to build or explain?
3. What breaks if you get it wrong?

Example (good):

> You're building a file upload UI. Users drag a slider from 0–100 but the API only accepts 1–10. You need `clamp` to keep values in range without scattered `if` checks.

Example (bad — do not use):

> **Chunk Array** shows up often in interviews. Key concepts: arrays, slicing

## Exercism attribution

When adapting concept material from [exercism/javascript](https://github.com/exercism/javascript) (MIT license):

1. **Adapt, don't copy.** Restructure for interview context and ADHD-friendly layout.
2. **Add attribution** to `mdnLinks`:
   ```typescript
   { label: 'Exercism JavaScript Track (MIT)', url: 'https://github.com/exercism/javascript' }
   ```
3. Reference source concepts in `scripts/exercism-concept-map.json` during authoring.

User-submitted Exercism solutions (CC BY-NC-SA) must **not** be reused.

## `mdnLinks` requirements

Every lesson needs:

- At least one relevant MDN or official docs link
- Exercism attribution when concept material was adapted
- Labels that describe the resource, not the lesson title

## Quality checklist before shipping

- [ ] No phrase "shows up often in interviews"
- [ ] 5+ steps with distinct titles
- [ ] Gotcha names a specific trap (not generic "edge cases")
- [ ] Code examples are read-only teaching code, not just the mini-challenge solution pasted in
- [ ] `estimatedMinutes` reflects actual reading time (10–14 for easy, 12–16 for advanced)
- [ ] Mini-challenge `validate` still passes with the reference solution

## Thin-content audit

Run to find lessons that still need rewriting:

```bash
rg "shows up often in interviews" apps/web/data/lessons/
```

Any match outside intentionally stubbed content is incomplete.

## File locations

| What | Path |
|------|------|
| Lesson data | `apps/web/data/lessons/lesson-*.ts` |
| Lesson schema | `apps/web/data/lessons/types.ts` |
| Exercism concept map | `scripts/exercism-concept-map.json` |
| Legacy generator (do not use for new lessons) | `scripts/generate-lessons.mjs` |

New lessons should be authored manually following this guide — not regenerated from `generate-lessons.mjs`.

## JavaScript curriculum order

The **stack:javascript** learning path is defined in [`apps/web/lib/curriculum/javascript.ts`](../apps/web/lib/curriculum/javascript.ts).

- Lessons list defaults to **Learning path (recommended)** sort when viewing JS content
- Order runs: variables/types → functions → strings → arrays → objects → patterns → async → classes/prototypes → advanced utilities
- When adding a JS lesson, register its ID in `JAVASCRIPT_LESSON_SEQUENCE` with the correct position

