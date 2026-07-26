# 🏋️ Phase 7 Complete — Content Taxonomy & New Buckets

> **Note:** This is the **content roadmap Phase 7** (taxonomy + bucket fill), distinct from the product Phase 7 doc (`PHASE-07-COMPLETE.md`) which covers leaderboard/analytics.

## What You Just Built

Phase 7 content work is done for the **four empty buckets** and the **taxonomy foundation**:

### New content (123 challenges + 123 lessons)

| Bucket | Prefix | Challenges | Lessons | Difficulty mix |
|--------|--------|------------|---------|----------------|
| **Stack → TypeScript** | `ts-` | 30 | 30 | 10 / 10 / 10 |
| **Frontend → CSS** | `css-` | 30 | 30 | 10 / 10 / 10 |
| **Stack → Vitest** | `vt-` | 30 | 30 | 10 / 10 / 10 |
| **Frontend → AI** | `ai-` | 33 | 33 | 11 / 11 / 11 |

Each challenge uses the file-per-challenge convention (`description.md`, `hints.md`, `code.ts`, `validate.ts`, `index.ts`) with explicit `topLevel` + `subcategory` fields.

Each lesson pairs 1:1 via `relatedChallengeIds` and includes explanation, code example, gotcha, and a mini-challenge.

### Foundation fixes

- **Taxonomy migration** — all pre-existing challenges + lessons now have explicit `topLevel` / `subcategory`
- **Broken lesson links fixed** — `fea-13`, `fea-14`, `fea-18`, `fea-20` short IDs → full challenge IDs
- **Orphan duplicate folders removed** — unused `fea-12-hoc-pattern`, `fea-13-virtual-dom-diff`, `fea-14-state-machine`
- **Leaderboard labels** — new categories appear in category breakdown

## Verify on your machine

```bash
npm run dev
```

1. **Challenges** → `/challenges` → Edit filters → **Stack & Tooling** → toggle **TypeScript** and **Vitest**
2. **Challenges** → **Frontend** → toggle **CSS** and **AI**
3. Open any new challenge (e.g. `ts-01-…`) → run tests → pass solution
4. **Lessons** → filter by same subcategories → open a paired lesson → complete mini-challenge

## Phase 7b — complete ✅

Legacy buckets are now balanced. See [`PHASE-07B-COMPLETE.md`](./PHASE-07B-COMPLETE.md).

**Total challenges:** 243

## What's Next

See [`PHASE-CONTENT-ROADMAP-COMPLETE.md`](./PHASE-CONTENT-ROADMAP-COMPLETE.md) — platform handoff doc (Phase 8 complete).
