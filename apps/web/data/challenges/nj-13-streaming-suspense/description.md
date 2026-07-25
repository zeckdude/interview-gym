## The Challenge

Build a **streaming page planner** that decides which dashboard sections can render immediately vs which need Suspense boundaries.

Given section configs with `id`, `delayMs`, and `critical` flags, return:
- `shellSections` — sections that render in the initial shell (critical + delayMs === 0)
- `streamedSections` — non-critical sections sorted by delayMs ascending
- `totalBlockingMs` — always 0 when at least one shell section exists

## Requirements

- Critical sections with zero delay belong in the shell
- Non-critical sections stream independently via Suspense
- Unknown section ids are ignored