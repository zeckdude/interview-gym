# 🏋️ Phase 7b Complete — Legacy Bucket Backfill

> Backfills **be**, **fe**, **fe:react**, and **fe:nextjs** to the launch target of **10 easy / 10 intermediate / 10 advanced** per bucket.

## What Was Done

### 1. Difficulty rebalance (13 existing challenges)

Promoted or demoted selected legacy challenges so new content could fill gaps without overshooting:

| Bucket | Moves |
|--------|-------|
| **be** | 4 intermediate → advanced (`be-16`…`be-20`) |
| **fe** | 4 intermediate → advanced (`fe-04`, `fe-05`, `fe-09`, `fe-20`) |
| **fea** | 5 intermediate → easy (`fea-01`…`fea-05`) |

Script: one-time rebalance applied directly to challenge `index.ts` files (no generator retained).

### 2. New content (40 challenges + 40 lessons)

| Bucket | IDs | Added | Difficulty mix |
|--------|-----|-------|----------------|
| **Backend** | `be-21`…`be-30` | 10 | 5 easy, 5 advanced |
| **Frontend** | `fe-21`…`fe-30` | 10 | 4 easy, 1 int, 5 advanced |
| **React** | `fea-21`…`fea-30` | 10 | 5 easy, 5 advanced |
| **Next.js** | `nj-21`…`nj-30` | 10 | 6 easy, 1 int, 3 advanced |

Appended to existing registries (`be-challenges.ts`, `fe-challenges.ts`, `fe-advanced.ts`, `nextjs-challenges.ts`) — no separate registry files.

### 3. Generator fixes

- `subcategory: null` renders correctly (not the string `"null"`)
- Factory functions no longer get spurious `async` when `await` only appears in nested methods
- Lesson mini-challenge validators support async tests
- `MiniChallengePanel` awaits async validate results

## Audit result

All 8 challenge buckets are **10/10/10** (AI bucket remains 11/11/11 from Phase 7).

**Total challenges:** 243 (was 203 after Phase 7)

## Verify

```bash
npm run dev
npm run test
```

1. **Challenges** → filter Backend → confirm 30 challenges with even difficulty tabs
2. Same for Frontend (30), React (30), Next.js (30)
3. Open `be-21-trim-string` or `nj-21-normalize-slug` → run solution → pass
4. **Lessons** → find paired lesson → mini-challenge submits correctly (including async factories)

## Next up

See [`PHASE-CONTENT-ROADMAP-COMPLETE.md`](./PHASE-CONTENT-ROADMAP-COMPLETE.md) — platform handoff doc (Phase 8 complete).
