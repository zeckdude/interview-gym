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
