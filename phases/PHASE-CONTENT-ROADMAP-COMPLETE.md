# 🏋️ Content Roadmap Complete — Platform Handoff

> **Phase 8** of the content/platform roadmap. Summarizes everything from taxonomy through full bucket fill.
>
> This is separate from the numbered **product** phase docs (`PHASE-01` … `PHASE-12`). See [`PHASE-07-CONTENT-COMPLETE.md`](./PHASE-07-CONTENT-COMPLETE.md) and [`PHASE-07B-COMPLETE.md`](./PHASE-07B-COMPLETE.md) for content-specific detail.

## What You Built (Phases 1–8)

| # | Area | Status | Key locations |
|---|------|--------|---------------|
| 1 | **Taxonomy & data model** | ✅ | `data/types.ts`, `lib/categories.ts`, `AGENTS.md` |
| 2 | **Shared list UI & filters** | ✅ | `CollapsibleContentFilters`, `ContentListToolbar`, challenges/lessons/questions lists |
| 3 | **Breadcrumbs** | ✅ | `ContentBreadcrumbs` on challenge, lesson, question, simulator, study plan pages |
| 4 | **Most Asked** | ✅ | Curated flags in data + personal overrides via `⋯` menu |
| 5 | **Study plan** | ✅ | `/study-plan`, `/study-plan/[id]`, `StudyPlanProvider`, Prisma `StudyPlanItem` |
| 6 | **Deepgram audio** | ✅ | TTS listen buttons, voice chat (Flux STT), `DEEPGRAM_API_KEY` |
| 7 | **New bucket content** | ✅ | TypeScript, CSS, Vitest, AI — 123 challenges + 123 lessons |
| 7b | **Legacy bucket backfill** | ✅ | be/fe/fea/nj 21–30 — 40 challenges + 40 lessons |
| 8 | **Docs & handoff** | ✅ | This file |

---

## Content counts (as of Phase 8)

Run anytime:

```bash
npm run content:audit
```

### Challenges by bucket (target: 10 easy / 10 intermediate / 10 advanced)

| Bucket | Easy | Int | Adv | Total |
|--------|------|-----|-----|-------|
| Backend (general) | 10 | 10 | 10 | **30** |
| Frontend (general) | 10 | 10 | 10 | **30** |
| Frontend → React | 10 | 10 | 10 | **30** |
| Frontend → Next.js | 10 | 10 | 10 | **30** |
| Frontend → CSS | 10 | 10 | 10 | **30** |
| Frontend → AI | 11 | 11 | 11 | **33** |
| Stack → TypeScript | 10 | 10 | 10 | **30** |
| Stack → Vitest | 10 | 10 | 10 | **30** |

**243 coding challenges** total (all live, no stubs).

### Other content

| Type | Count |
|------|-------|
| Lessons | **205** |
| Conceptual questions | **55** (20 BE + 20 FE + 15 Next.js) |

Registry files: `data/*-challenges.ts`, `data/lessons/registry.ts`, `data/*-questions.ts`.
`CATEGORY_TOTALS` in `data/index.ts` is derived from array lengths — never edit manually.

---

## Taxonomy quick reference

**Top levels:** Backend · Frontend · Stack & Tooling

**Subcategories:**

| Top level | Subcategories |
|-----------|---------------|
| Backend | *(general only — `subcategory: null`)* |
| Frontend | React, Next.js, CSS, AI |
| Stack & Tooling | TypeScript, Vitest |

**Legacy mapping:** `fe-advanced` → Frontend/React, `nextjs` → Frontend/Next.js.

Full rules (10/10/10 launch minimum, Most Asked policy, file-per-challenge convention): **`AGENTS.md`**.

---

## Study plan

| What | Where |
|------|-------|
| List page | `/study-plan` |
| Detail + AI launch | `/study-plan/[id]` |
| Add from content | `StudyPlanBadge`, `StudyPlanQuickAdd` on challenge/lesson/simulator pages |
| API | `/api/study-plan`, `/api/study-plan/[id]` |
| DB | `StudyPlanItem` in Prisma schema |

Each item resolves linked lesson + challenge IDs when both exist.

---

## Audio & voice

| Feature | Env | Components |
|---------|-----|------------|
| Read-along TTS | `DEEPGRAM_API_KEY` | `ListenButton`, `NarrationPanel`, `LessonStepRenderer` |
| Voice chat (sidebar) | `DEEPGRAM_API_KEY` | `useFluxVoiceInput`, `useVoiceChatController`, `AiChat` |
| Settings | — | `/settings` → Audio settings |

Grant-token flow: browser connects directly to Deepgram Flux via `POST /api/ai/stt/token`.

---

## Adding new content later

No generators — add content manually:

1. **Challenge:** create folder under `data/challenges/{id}/` (5 files per `AGENTS.md`)
2. **Register:** import in the relevant `*-challenges.ts` array
3. **Lesson:** add file under `data/lessons/` + import in `registry.ts`
4. **Verify:** `npm run content:audit` — bucket must stay at 10/10/10 before marking live
5. **Tests:** `npm run test` — validator tests auto-cover registered challenges

---

## Verify everything works

```bash
npm run dev
npm run type-check
npm run test
npm run content:audit
```

**Smoke checklist:**

1. `/challenges` — filters: Backend, Frontend subcategories, Stack & Tooling, difficulty, Most Asked
2. `/lessons` — same filter pattern, progress ring, mini-challenges
3. `/study-plan` — add item, open detail, launch AI with context
4. Any challenge → 🔊 listen button on instructions; voice mode in AI sidebar
5. `/leaderboard` — new taxonomy labels in category breakdown
6. `/settings` — reminder preferences (product Phase 8)

**682 tests** should pass.

---

## Related docs

| Doc | Covers |
|-----|--------|
| [`AGENTS.md`](../AGENTS.md) | ADHD design rules, taxonomy, content conventions |
| [`PHASE-07-CONTENT-COMPLETE.md`](./PHASE-07-CONTENT-COMPLETE.md) | New buckets (ts/css/vt/ai) |
| [`PHASE-07B-COMPLETE.md`](./PHASE-07B-COMPLETE.md) | Legacy backfill (be/fe/fea/nj 21–30) |
| [`PHASE-06-COMPLETE.md`](./PHASE-06-COMPLETE.md) | Simulator |
| [`PHASE-08-COMPLETE.md`](./PHASE-08-COMPLETE.md) | Email reminders (product phase) |

## What's next

Product roadmap continues at Phase 13 (Systems Design) per [`PHASE-12-COMPLETE.md`](./PHASE-12-COMPLETE.md). Content buckets are launch-ready — future work is new features, not bucket fill.
