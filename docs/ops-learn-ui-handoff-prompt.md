# Handoff: Build `/ops/learn-ui` — Learn path UI showcase

You are continuing work on **Interview Gym**, a Next.js monorepo. Do **not** rebuild `/ops/learn-problems` — that page already exists and covers **problem-type interactions** (predict output, pick one, write code, + 10 prototypes). Your job is a **sibling ops page** for everything else in the learn path: navigation, framing, feedback chrome, review/SRS, reference panel, settings, etc.

---

## Goal

Create **`/ops/learn-ui`** — a password-protected internal showcase (same auth as `/ops/ui` and `/ops/learn-problems`) where each recommended learn UI surface is demoed in isolation with mock data where needed. Purpose: design review, iteration, and deciding what to polish before production — same rationale as `/ops/learn-problems` (prefer ops over Storybook for full-context interactions).

Link it from:

- `apps/web/app/ops/page.tsx` (hub card)
- `apps/web/components/ops/OpsHeader.tsx` nav ("Learn UI" or similar)

Follow existing ops showcase patterns:

- `apps/web/components/ops/UiShowcaseClient.tsx`
- `apps/web/components/ops/LearnProblemsShowcaseClient.tsx`

Use a sticky jump nav, `ShowcaseSection` wrappers, Shipped vs Prototype badges where relevant, and mock data files under `apps/web/components/ops/learn-ui/`.

---

## Auth & testing

- Route lives under `apps/web/app/ops/` → uses `apps/web/app/ops/layout.tsx` (ops password via `OPS_PASSWORD` in root `.env.local`)
- No Clerk auth required for `/ops`
- Test: `npm run setup && npm run dev` → `http://localhost:3000/ops/learn-ui`

---

## Sibling page (already built — do not duplicate)

**`/ops/learn-problems`** — problem-type demos only:

- `apps/web/app/ops/learn-problems/page.tsx`
- `apps/web/components/ops/LearnProblemsShowcaseClient.tsx`
- `apps/web/components/ops/learn-problems/` (showcase-data, ShippedStepDemo, ProblemPrototypes)

Problem types belong there, **not** on learn-ui.

---

## What to build on `/ops/learn-ui`

Implement **all sections below** (A–G). Each gets its own anchored section with a short blurb and a working visual demo.

### A. Path & progression

| ID | Section title | Demo should show |
|----|---------------|------------------|
| A1 | Path map | Mini or full `PathMap` with mock `LEARN_GRAPH_NODES` subset + mock `moduleProgress` |
| A2 | Module node states | Side-by-side or labeled examples: locked · available · in_progress · completed |
| A3 | Review module nodes | `kind: 'review'` node styling (brand border, larger card) |
| A4 | Extra module nodes | `isExtra: true` dashed-border nodes |
| A5 | Coming soon | Node with `contentAvailable: false` but not locked |
| A6 | Path stats card | Progress ring %, lessons completed/total, live count, reviews due link |
| A7 | Reset progress dialogs | `ConfirmDialog` for reset module + reset all (interactive, no real API needed or use mock handlers) |

**Real components:** `apps/web/components/learn/PathMap.tsx`, `PathMapClient.tsx`  
**Data:** `apps/web/data/learn/graph.ts` (`LEARN_GRAPH_NODES`, `LEVEL_LABELS`)  
**Types:** `ModuleProgressView` in `apps/web/data/learn/types.ts`

---

### B. Module runner shell

| ID | Section title | Demo should show |
|----|---------------|------------------|
| B1 | Module header | Level label + title pattern from `ModuleRunner` |
| B2 | Sticky progress bar | % bar from runner header |
| B3 | Runner toolbar | Back · Reset · Settings buttons row |
| B4 | Module complete card | Green success card + "Back to path" |
| B5 | Progressive step list | 3 fake steps: completed (dimmed), active, hidden — explain pattern |
| B6 | Step back | Button + brief note that it clears step state |

**Real component:** `apps/web/components/learn/ModuleRunner.tsx`  
**Tip:** Extract small presentational subcomponents if needed to avoid mounting full ModuleRunner with DB/auth. Mock props are fine.

---

### C. Framing steps (NOT problems — teaching chrome only)

| ID | Section title | Demo should show |
|----|---------------|------------------|
| C1 | Text step | `LearnStepView` with `type: 'text'` sample + Continue button |
| C2 | Concept note | `LearnConceptNote` teaching intro style |
| C3 | Type reference table | `LearnTypeReferenceTable` with sample rows (primitives) |
| C4 | Code demo step | `type: 'code-demo'` — read-only code + `ResultPanel` output-only |
| C5 | Code problem intro | Text step with `title: "Here's a code problem:"` pattern |
| C6 | Challenge Yourself | Dashed optional section wrapper (`sectionKind: 'challenge-yourself'`) |
| C7 | Review gate step | `type: 'review-gate'` — type exists, no authored content in production yet; demo the UI shell |

**Real component:** `LearnStepView` for C1, C4, C5, C6, C7  
**Also:** `LearnConceptNote`, `LearnTypeReferenceTable` in `apps/web/components/learn/`  
**Sample step data:** copy patterns from `apps/web/data/learn/modules/js-01-introduction.ts`, `js-03-types.ts`

Use `ShippedStepDemo` pattern from learn-problems OR a thin wrapper with `getDefaultResolvedLearningSettings()` and `moduleId="ops-learn-ui-showcase"`.

---

### D. Feedback & scaffolding (shared across problem types)

| ID | Section title | Demo should show |
|----|---------------|------------------|
| D1 | Result panel | All modes: full (goal+yours+pass), output-only, feedback-only, expected-error variant |
| D2 | Output diff | `OutputDiffView` — off vs subtle vs full (wrong answer example) |
| D3 | Hint progression | Hint callouts 1→2→3 (`LearnCallout` variant hint) |
| D4 | Reveal answer | Reveal callout block + explanation text |
| D5 | Recommended answer | `LearnRecommendedAnswer` disclosure toggle |
| D6 | Reveal comparison | `LearnRevealComparison` — your attempt vs solution side-by-side |
| D7 | Error mode toggle | "Prints output" vs "Throws error" segmented control |
| D8 | Error picker popover | `LearnErrorPickerPopover` with sample `LearnErrorOption[]` from `apps/web/lib/learn/learned-errors.ts` |
| D9 | Optional skip | "Skip challenge →" button styling/context |
| D10 | Challenge debrief | `LearnChallengeDebriefPanel` — Trap / Great solution / Watch for / evaluation trace; show both passed and skipped states |

**Key files:**

- `apps/web/components/learn/LearnCodeBlock.tsx` (`ResultPanel`, `LearnGrowTextarea`, `LearnInlineText`, `LearnPromptText`, `LearnConceptNote`)
- `apps/web/components/learn/OutputDiffView.tsx`
- `apps/web/components/learn/LearnReferencePanel.tsx` (`LearnCallout`)
- `apps/web/components/learn/LearnRecommendedAnswer.tsx`
- `apps/web/components/learn/LearnRevealComparison.tsx`
- `apps/web/components/learn/LearnErrorPickerPopover.tsx`
- `apps/web/components/learn/LearnChallengeDebriefPanel.tsx`

**Debrief sample data:** see `LearnChallengeDebrief` in `apps/web/data/learn/types.ts` and `js-03-types.ts` optional steps.

---

### E. Spaced repetition / review

| ID | Section title | Demo should show |
|----|---------------|------------------|
| E1 | Review queue session | Mock review flow UI (predict + code_goal item types) — do not require real DB; mirror `ReviewClient` layout |
| E2 | Review empty states | "No items yet" and "All caught up" |
| E3 | Manual review toggle | Manual on/off button state |
| E4 | Concept weight controls | Less (-1) / Normal (0) / More (+1) per concept tag |
| E5 | Review item types | Labeled examples of `predict_output` vs `code_goal` resurfaced items |

**Real component:** `apps/web/components/learn/ReviewClient.tsx` (production route `/review` requires Clerk + DB)  
**API reference:** `apps/web/app/api/learn/review/route.ts`, `review/weights/route.ts`  
**Types:** `ReviewDueItem`, `ConceptWeight` in `apps/web/data/learn/types.ts`  
**Tip:** Build `ReviewShowcaseDemo.tsx` with static mock `ReviewItem[]` — don't depend on signed-in user.

---

### F. Reference & cheat sheet

| ID | Section title | Demo should show |
|----|---------------|------------------|
| F1 | Reference panel | `LearnReferencePanel` open with mock `coveredModuleIds` |
| F2 | Reference cards | Single `ReferenceCard` — description + code + result + MDN link |
| F3 | Reference search | Search/filter within panel |

**Real component:** `apps/web/components/learn/LearnReferencePanel.tsx`  
**Data:** `apps/web/data/learn/reference.ts` (`getReferencesForCoveredModules`, `LearnReferenceEntry`)  
**Layout hook:** `apps/web/components/learn/useReferencePanelLayout.ts`

---

### G. Learning preferences & settings

| ID | Section title | Demo should show |
|----|---------------|------------------|
| G1 | Global learn preferences | `LearningPreferencesSettings` card (or extracted demo) — Beginner / Standard / Challenge / Custom radios |
| G2 | Module settings popover | `LearnModuleSettings` with mock `moduleId` |
| G3 | Feature toggles | `LearningFeatureControls` — hints, reveal, output diff, diagnostics, indent guides, setup code split, etc. |
| G4 | Indent guide color | `IndentGuideColorControl` swatches |

**Real files:**

- `apps/web/components/settings/LearningPreferencesSettings.tsx`
- `apps/web/components/learn/LearnModuleSettings.tsx`
- `apps/web/components/learn/LearningFeatureControls.tsx`
- `apps/web/hooks/useLearningPreferences.ts`
- `apps/web/lib/learn/learning-preferences.ts` (presets, feature flags)

---

## Explicitly EXCLUDE from this page

- **Problem-type interactions** → already on `/ops/learn-problems`
- **H. Editor primitives** as standalone sections (code block, grow textarea, etc.) — they appear inside other demos
- **I. Dev-only tools** (dev navigator, skip step, floating controls) — unless user asks later
- **Dashboard `ReviewToday`** — that's challenge review, not learn SRS (`apps/web/components/dashboard/ReviewToday.tsx`)

---

## Architecture guidance

**Suggested file structure:**

```
apps/web/app/ops/learn-ui/page.tsx
apps/web/components/ops/LearnUiShowcaseClient.tsx
apps/web/components/ops/learn-ui/showcase-data.ts       # UI_SHOWCASE_SECTIONS metadata
apps/web/components/ops/learn-ui/PathDemos.tsx
apps/web/components/ops/learn-ui/RunnerDemos.tsx
apps/web/components/ops/learn-ui/FramingDemos.tsx
apps/web/components/ops/learn-ui/FeedbackDemos.tsx
apps/web/components/ops/learn-ui/ReviewDemos.tsx
apps/web/components/ops/learn-ui/ReferenceDemos.tsx
apps/web/components/ops/learn-ui/SettingsDemos.tsx
```

**Patterns:**

- Reuse production components wherever possible — don't reimplement styling
- Mock data in showcase files; avoid Clerk/Prisma for ops demos
- `moduleId` for step storage: use `ops-learn-ui-showcase` to avoid colliding with real progress
- ADHD-friendly design per `AGENTS.md` (chunked sections, high contrast, clear headings, no walls of text)
- Use semantic Tailwind tokens (`bg-brand`, `text-text-primary`, etc.) — never raw hex in components

**Status badges:**

- `shipped` — wired to real production component
- `prototype` — mock/stub or UI shell without full backend (e.g. review gate C7, review demos E*)

---

## Production learn system reference

| Concern | Location |
|---------|----------|
| Step types | `apps/web/data/learn/types.ts` |
| Step runner | `apps/web/components/learn/LearnStepView.tsx` |
| Module page | `apps/web/app/learn/[moduleId]/page.tsx` |
| Home path | `apps/web/app/page.tsx` → `PathMapClient` |
| Review page | `apps/web/app/review/page.tsx` → `ReviewClient` |
| Learn conventions | `AGENTS.md` sections under "Learn modules —" |
| Hint system | `phases/PHASE-LEARN-HINTS.md`, `apps/web/data/learn/hints.ts` |

**Module kinds on graph:** `lesson` | `review` | `extra`  
**Framing step types:** `text`, `code-demo`, `review-gate` (not problems)  
**Problem step types:** `predict-output`, `choice`, `code-challenge` (on the other ops page)

---

## Acceptance criteria

1. `/ops/learn-ui` loads behind ops auth
2. All sections A1–A7, B1–B6, C1–C7, D1–D10, E1–E5, F1–F3, G1–G4 are present with working interactive demos
3. Sticky jump nav links to every section
4. Hub + header link to the page
5. `npm run type-check` passes
6. No dependency on Clerk sign-in or populated review DB for demos to render

---

## After building

Leave a short note in the PR describing which demos use real components vs mocks. Future work may promote polished patterns into production or add Storybook stories for stable components — but the ops page is the design sandbox for now.
