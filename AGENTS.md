# Interview Gym — Agent Instructions

---

## ⚠️ CRITICAL: ADHD-First Design — THIS IS NON-NEGOTIABLE

**The primary user of this application has ADHD. Every single UI decision must be made through this lens. This is not a preference — it is a hard requirement that overrides all other aesthetic choices.**

### Why this matters
Walls of text, low contrast, poor hierarchy, and visual clutter are not just aesthetically bad — they actively prevent the user from engaging with the content. Every screen must be immediately parseable and visually guided.

### Mandatory ADHD-friendly design rules — apply everywhere, always:

1. **NO WALLS OF TEXT.** Every block of instructional content must be chunked into visually distinct sections. If you have more than 3 sentences in a row, break it up.

2. **STRONG VISUAL HIERARCHY.** Every section must have a clear heading. Headings must be visually distinct from body text — different size, weight, or color. The user must be able to scan a page and understand its structure in 2 seconds.

3. **COLOR-CODED SECTIONS.** Use background colors, left-border accents, or colored labels to distinguish types of information. Key info (expected output, requirements) must stand out with a colored callout box — never buried in paragraph text.

4. **LARGE ENOUGH TEXT.** Body text must never be smaller than `text-sm` (0.875rem). Prefer `text-base` for instructional content. Tiny text causes eye strain and loss of focus.

5. **HIGH CONTRAST.** Use `text-text-primary` for all primary instructional content — never `text-text-secondary` or `text-text-muted` for content the user must actually read. Muted colors are for metadata only (timestamps, labels, placeholders).

6. **CHUNKED LISTS.** Bullet points and numbered steps must have generous spacing between items (`space-y-2` or more). Never tight-packed lists. Each item should feel like its own unit.

7. **VISUAL CALLOUT BOXES.** Anything the user must not miss — expected output, requirements, warnings — must live inside a styled callout box with a background color and border. Never inline in prose.

8. **GENEROUS WHITESPACE.** Sections must breathe. Use `space-y-6` or more between major sections. Padding inside cards/boxes must be at least `p-4`.

9. **PROGRESSIVE DISCLOSURE.** Show the most important info first. Secondary info (hints, explanations, "why this matters") can be collapsed or de-emphasized visually.

10. **CLEAR INTERACTIVE AFFORDANCES.** Buttons, links, and interactive elements must be obviously interactive — strong contrast, hover states, and unambiguous labels. Never ghost-style buttons for primary actions.

### In practice, this means:
- Challenge instructions are rendered as structured, sectioned layouts — NOT raw markdown prose
- Expected output and requirements get highlighted callout boxes (colored background + left border)
- "What you need to know" renders as a scannable list with visual markers, not a paragraph
- Concept tags and metadata are secondary — the primary content is what the user must DO
- Every component you touch must pass the "2-second scan test": can someone with ADHD understand the structure in 2 seconds?

**If you are ever unsure whether a design choice is ADHD-friendly, err on the side of MORE visual structure, MORE whitespace, and MORE contrast. Never err toward minimalism when it reduces scannability.**

---

## Design System

The visual system is **modular and swappable**. All aesthetic decisions live in centralized token files — never hardcode colors, fonts, or radii in components.

### Source of truth (update together)

When changing the overall design aesthetic, update **all** of these files:

| File | What it controls |
|------|------------------|
| `tailwind.config.ts` | Semantic color, font, radius, shadow, and spacing tokens for the entire app |
| `apps/web/app/globals.css` | CSS-var utility classes that override Tailwind static colors at runtime |
| `apps/web/lib/themes/the-zen.ts` + `the-grind.ts` | Per-look light/dark token values (including callout backgrounds) |
| `apps/web/lib/clerk-appearance.ts` | Clerk sign-in/sign-up UI — colors, fonts, buttons, inputs |

**Rule:** Values in `clerk-appearance.ts` must mirror the tokens in `tailwind.config.ts`. If you change `brand` from `#FF6B35` to something else in Tailwind, update `colorPrimary` (and related Clerk variables) to the same hex value.

### Theme-aware vs static colors

**Always theme-aware (CSS vars via `applyTheme()`):** `bg-bg-*`, `text-text-*`, `border-border-*`, `bg-brand-light`, `bg-success-light`, `bg-error-light`, `bg-warning-light`.

**Still static in Tailwind (avoid as full callout backgrounds with `text-text-primary`):** difficulty badges (`easy-light`, `medium-light`, `hard-light`), category badges (`cat-*-light`). These are fine for small chips with matching accent text (`text-easy`, etc.) but not for readable body copy.

**Never** pair a static light-mode pastel background with `text-text-primary` without verifying dark mode. Status callouts (`success-light`, `error-light`, `warning-light`) are theme-aware — use those for warning/error/success boxes with body text.

### Component rules

- Use Tailwind **semantic token classes** in components (`bg-brand`, `text-text-primary`, etc.) — never raw hex or font names in JSX.
- `font-display` for headings; `font-body` for UI copy; `font-mono` only inside Monaco/code.
- Auth pages wrap Clerk's `<SignIn />` / `<SignUp />` in a single card (`bg-bg-surface rounded-xl shadow-modal`). Clerk's internal card containers are transparent — styling lives in our wrapper + `clerk-appearance.ts`.

### Design swap checklist

1. Edit token values in `tailwind.config.ts` (`theme.extend.colors`, `fontFamily`, `borderRadius`, `boxShadow`).
2. Sync matching values in `apps/web/lib/themes/the-zen.ts` and `the-grind.ts` (light + dark for each look).
3. Sync matching hex/font values in `apps/web/lib/clerk-appearance.ts` (`variables` and `elements` classes).
4. Restart the dev server and verify: dashboard, challenge pages, and `/sign-in` in **both light and dark mode**.
5. No component files should need changes if tokens are used correctly.

See swap examples in the comments at the bottom of `tailwind.config.ts`.

## Auth (Clerk)

- Sign-in/sign-up use Clerk prebuilt components with custom appearance (`lib/clerk-appearance.ts`).
- Google + Email auth are configured in the Clerk Dashboard, not in `.env.local`.
- SSO callback routes: `/sign-in/sso-callback`, `/sign-up/sso-callback`.
- Env files live at the **monorepo root** (`.env.local`). Run `npm run setup` to symlink into `apps/web/`.

## Project structure

- `apps/web/` — Next.js app
- `packages/db/` — Prisma schema
- `phases/` — Phase completion docs

## Learn modules — cross-device continuity

**Driving factor:** Signed-in users must resume learn modules on any device with the same step answers, code drafts, pass/fail status, hints shown, and reveal state.

- **Source of truth:** PostgreSQL (`LearnModuleProgress`, `LearnStepState`, `LearnConceptReview`, …).
- **localStorage:** Cache and offline fallback only (`step-storage.ts`). Never the sole store for learner state.
- **On module load:** Server state hydrates local cache via `hydrateLearnModuleStepStates()`.
- **On step save:** Write local immediately; debounce remote sync (immediate on pass/reveal/complete).
- **On reset / step back:** Clear both local and remote state.
- **Device-local OK:** Reference panel width, theme, audio — not learning progress.

When adding new learn persistence, ask: “Would the user expect this on another device?” If yes → DB.

## Learn modules — string output convention

Predict-output steps require learners to type what `console.log` would print. **String values must be quoted in their answer** (`'Paris' 2` or `"Paris" 2` — both accepted). Numbers, booleans, and errors stay unquoted.

**Display the same way everywhere else** — use **single quotes** for string log values in all UI and authored copy:

| Context | Rule |
|---------|------|
| Result panels, reveal answers, demos, review goals | Call `formatQuotedDisplayOutput(sourceCode, rawOutput)` from `apps/web/lib/learn/execute-code.ts` — never render raw `expectedOutput` for string logs |
| Reference panel “Result:” | Same helper (already wired in `LearnReferencePanel`) |
| Validation failure messages | `validateCodeChallenge(..., displayReferenceCode)` formats expected/got with quoted strings |
| `hints`, `revealExplanation`, mistake hints | Write string log output in backticks with single quotes: `` `'Paris' 2` ``, `` `'JavaScript'` ``, `` `'boolean'` `` |
| `expectedOutput` in step data | Keep **raw runtime text** (no quotes) — matching only; not for direct display |

When adding learn steps or UI that shows console output, follow this convention. See `validatePredictStringQuotes` and `STRING_QUOTES_MESSAGE` for answer validation.

## Learn modules — error picker (`predict-output` + `expectsError`)

When a predict step throws at runtime, learners pick from **`getErrorPickerOptions()`** in `apps/web/lib/learn/learned-errors.ts` — not a free-text field.

**Hard rule:** If the step’s runtime reference matches a catalog option (`LEARN_ERROR_OPTIONS`), that option **must always appear in the picker**, even when:
- The module is not yet in `coveredModuleIds` (first visit / in-progress),
- The error is excluded from “decoys” because it is the correct answer,
- Only generic decoys would otherwise fill the list.

Use `ensureCorrectOptionInPicker()` when changing picker logic. Add a test whenever you add a new taught error or change decoy padding.

**Catalog vs runtime text:** Catalog labels are fallbacks (e.g. `ReferenceError: <name> is not defined`). On predict-error steps, **`applyRuntimeLabelsToPickerOptions()`** replaces the correct option’s label with the **exact runtime string** from `getPredictRuntimeReference()` so the picker matches the RESULT panel. Hints for a step should quote that runtime text, not the generic catalog label.

When adding a new error type: add to `LEARN_ERROR_OPTIONS` with `introducedAt`, `matchValues`, and confusion scores; extend `referenceMatchesOption` if the pattern is not covered by `matchValues` alone.

## Learn modules — code challenge prompts vs validation

**Prompts and the test runner must agree.** If copy says the learner may use their own value (name, wording, etc.), validation must accept any valid answer — not only the canonical `expectedOutput` / `solutionCode` example.

- Set **`outputFlex`** on `code-challenge` steps when multiple outputs are valid:
  - `logged-const-name` — `const name = '…'` + `console.log(name)`; any non-empty logged string passes.
  - `name-then-2026` — line 1: any name; line 2: exactly `2026`.
- Keep **`expectedOutput`** / **`solutionCode`** as the **example** for reveal and recommended answers.
- Diff / failure copy uses `getCodeChallengeGoalDisplay()` — not a hard-coded example string when `outputFlex` is set.

Before shipping a challenge, read the prompt, hints, and text steps leading into it. If any say “your own name” or “replace with yours”, you must add `outputFlex` (or exact-output copy only).

## Learn modules — Challenge Yourself

Every authored module **after Introduction** should include **two** optional **Challenge Yourself** sections (Introduction is exempt — learners are still onboarding).

**Structure:**

1. A **text** step with `title: CHALLENGE_YOURSELF_SECTION_TITLE` (`'Challenge Yourself'`), `sectionKind: 'challenge-yourself'`, and copy explaining the block is optional.
2. One or more **interactive** steps with `optional: true` immediately after each intro.

Import the title from `apps/web/data/learn/challenge-yourself.ts`.

**Rules:**

- **Optional to proceed** — learners can use **Skip challenge →** without solving. Do not gate module completion on these steps.
- **Extra hard** — gotchas and stretch problems tightly relevant to the module topic.
- **No hints, no reveal, no starter code** on optional steps — omit `hints`, `revealExplanation`, `setupCode`, and `starterCode` (empty strings are fine for code challenges).
- **Prefer `code-challenge`** from a blank editor when the learner must write code. Use **`predict-output`** (single typed answer) when a gotcha is best shown as “what happens when this runs?” Avoid **`choice`** for Challenge Yourself — too easy.
- Place sections at **meaningful breakpoints** (mid-module and near the end), not clustered together.
- **Required `challengeDebrief`** on every optional step — shown after **pass or skip**, before the learner continues. Three fields:
  - **`gotcha`** — what made this hard / the trap
  - **`greatSolution`** — how to reason through it (not just the raw answer)
  - **`watchFor`** — what to notice in similar real-world code
  - Optional **`solutionCode`** on code-challenge debriefs (reference implementation)
  - Optional **`evaluationSteps`** — `{ expression, yields }[]` rendered as a numbered trace (prefer over long prose for predict-style challenges)

The UI renders this as a **Challenge breakdown** panel (`LearnChallengeDebriefPanel`) — learners must click **Got it — Continue →** after reading, whether they solved it or skipped.

**Example:**

```typescript
{
  id: 'mod-cy-1-intro',
  type: 'text',
  title: CHALLENGE_YOURSELF_SECTION_TITLE,
  sectionKind: 'challenge-yourself',
  conceptTags: ['typeof'],
  content: 'Optional extra-hard typeof gotchas. Skip anytime.',
},
{
  id: 'mod-cy-1',
  type: 'predict-output',
  optional: true,
  conceptTags: ['typeof'],
  prompt: 'What gets logged?',
  code: `console.log(typeof typeof 1);`,
  expectedOutput: 'string',
  challengeDebrief: {
    gotcha: '`typeof` always returns a string — even when applied to another typeof result.',
    greatSolution: 'Evaluate inside out: `typeof 1` → `"number"`, then `typeof "number"` → `"string"`.',
    watchFor: 'When you see nested typeof, evaluate one layer at a time.',
  },
},
```

## Learn modules — scannable reference tables

For type lists, operator comparisons, or other reference material that would become a wall of text as markdown bullets, use **`typeReference`** on a `text` step.

- Short intro in **`content`**, closing note in **`footer`**
- Each row: `name`, `description`, optional `example`, optional `accent` (`fe` | `brand` | `success` | `warning` | `muted`)
- Rendered by `LearnTypeReferenceTable` — type badge plus description; **example code on its own line** with full width (never a cramped third column)

## Learn modules — dev step labels

The **Jump** menu (development builds only) uses `devTitle` and `devDescription` on every step. These help you navigate modules without opening each step — they must **describe the topic**, not the problem or answer.

**Required:** Set both fields on **every** step when authoring or editing a learn module. A test fails if any authored step is missing them.

**Do:**

- Name the concept: `Predict: TDZ error`, `Demo: typeof on variables`, `Challenge: typeLabel function`
- One-line topic summary: `What happens when you log a variable before it is declared.`
- Use `CY:` prefix on optional Challenge Yourself interactive steps; use `Challenge Yourself` for the section intro text step
- Keep titles under ~40 characters; descriptions under ~100 characters

**Do not:**

- Copy the step `prompt` (`What gets logged?`, `What happens when this runs?`)
- Quote code from the step (`console.log(x)`, `let x = 1`)
- Reveal `expectedOutput`, error names, correct choice text, or solution hints
- Repeat the learner-facing `title` verbatim when it is generic (`Here's a code problem:`)

**Examples:**

| Step type | Good devTitle | Good devDescription |
|-----------|---------------|---------------------|
| `text` | `Temporal dead zone` | `Using const/let before its line throws ReferenceError.` |
| `code-demo` | `Demo: mutating an array` | `Runnable example — push to a const array binding.` |
| `predict-output` | `Predict: typeof null` | `What typeof returns for null.` |
| `code-challenge` | `Challenge: declare then log` | `Add a const declaration so logging a name succeeds.` |
| `choice` | `Choice: dynamic typing` | `Can the same let hold a number and later a string?` |

Fallback inference in `dev-tools.ts` is generic and topic-only — never rely on it instead of writing explicit labels.

**Dev jump behavior** (development builds): Jumping to step *N* clears saved state for step *N* and every step after it. Jumping **forward** (target > current) also auto-fills steps from current through *N − 1* with recommended answers. Jumping backward only clears — it does not fill.

## Challenge content — file-per-challenge convention

**Every real (non-stub) challenge lives in its own folder under `apps/web/data/challenges/`.**

```
apps/web/data/challenges/
  be-01-list-files/
    description.md   ← human-readable challenge description (markdown)
    hints.md         ← numbered list of hints (parsed by parseHints())
    code.ts          ← starter and solution code exported as strings
    validate.ts      ← exports a validate() function
    index.ts         ← assembles the Challenge object and exports it
  be-02-read-write-file/
    ...
```

### Rules for adding a new challenge

1. Create a new folder: `apps/web/data/challenges/{id}/`
2. Add all 5 files: `description.md`, `hints.md`, `code.ts`, `validate.ts`, `index.ts`
3. Import the challenge in the relevant category file (`be-challenges.ts`, `fe-challenges.ts`, etc.) and add it to the array
4. Stub challenges (not yet built) stay inline in the category file using `stubChallenge()`

### Why this structure
- `description.md` opens as clean, distraction-free markdown — easy to read and edit
- The folder name makes every challenge visible and scannable in the file tree
- Adding a challenge = adding a folder. Finding a challenge = opening the folder.
- `CATEGORY_TOTALS` in `data/index.ts` is derived from array lengths — never manually maintained

### Shared utilities
- `apps/web/data/challenges/_utils.ts` — exports `errorResult()` and `parseHints()`
- Import these in every `validate.ts` and `index.ts` — do not duplicate them

## Content taxonomy

**Source of truth:** `apps/web/data/types.ts` (types) and `apps/web/lib/categories.ts` (filter/display helpers).

### Top-level categories (filter tabs)

| Value | UI label |
|-------|----------|
| `be` | Backend |
| `fe` | Frontend |
| `stack` | Stack & Tooling |

`all` is a filter-only value — not stored on content.

### Subcategories (multi-select toggles under a top level)

| Top level | Subcategories |
|-----------|---------------|
| Backend | *(none for now)* |
| Frontend | `react`, `nextjs`, `css`, `ai` |
| Stack & Tooling | `typescript`, `vitest` |

**Rules:**
- `subcategory: null` = **general** content for that top level. No "General" label in the UI.
- No subcategory toggles selected under a top level → show **all** content for that top level (general + every subcategory).
- One or more subcategory toggles selected → show **general + selected subcategories only**.

### Legacy category migration

Existing data files still use `category: ChallengeCategory`. Map at read time via `resolveTaxonomy()`:

| Legacy `category` | Taxonomy |
|-------------------|----------|
| `be` | Backend (general) |
| `fe` | Frontend (general) |
| `fe-advanced` | Frontend → React |
| `nextjs` | Frontend → Next.js |

New content should set explicit `topLevel` + `subcategory` on challenges, lessons, and questions when the legacy field is insufficient (e.g. CSS, AI, TypeScript, Vitest).

### Launch requirement — 10 / 10 / 10

Every **new** top-level bucket or subcategory must ship with:

- **10 easy** lessons + **10 easy** challenges
- **10 intermediate** lessons + **10 intermediate** challenges
- **10 advanced** lessons + **10 advanced** challenges

Constants: `CONTENT_LAUNCH_MIN_PER_DIFFICULTY` and `CONTENT_LAUNCH_DIFFICULTIES` in `lib/categories.ts`.

Do not mark a bucket "live" in filters until it meets this minimum.

### Most Asked

- **Default:** Curated in data files (`mostAsked: true` + optional `mostAskedReason`) based on real interview frequency — set when content is authored or reviewed, not by users in the list UI.
- **Lessons:** Inherit from explicit `mostAsked` on the lesson, or from any related challenge marked most asked (`getCuratedMostAskedForLesson()`).
- **Personal override:** Signed-in users can mark/unmark via the `⋯` menu on challenge, lesson, and question **detail pages only**. Overrides are stored per user in `MostAskedOverride` (not canonical data).
- **Reset:** “Reset to default” removes the personal override and restores curated flags.
- List filters and badges use **effective** most asked (curated + personal override).

## Commands

```bash
npm run dev          # Start dev server
npm run setup        # Symlink .env.local into apps/web
npm run db:migrate   # Apply database migrations
npm run type-check   # TypeScript check
npm run content:audit # Report per-bucket easy/int/advanced counts vs 10/10/10
```
