/** Classified mistake when a learn step answer is wrong. */
export type MistakeKind =
  | 'correct'
  | 'comma_separator'
  | 'wrong_numeric_value'
  | 'wrong_order'
  | 'missing_line'
  | 'extra_line'
  | 'type_error_expected'
  | 'error_when_output'
  | 'output_when_error'
  | 'empty_output'
  | 'syntax_error'
  | 'output_mismatch'
  | 'missing_string_quotes';

/** Default hint array index to show first after a wrong attempt (0-based). */
export const FIRST_HINT_INDEX: Partial<Record<MistakeKind, number>> = {
  comma_separator: 2,
  wrong_numeric_value: 1,
  wrong_order: 0,
  missing_line: 1,
  extra_line: 1,
  type_error_expected: 0,
  error_when_output: 1,
  output_when_error: 0,
  empty_output: 0,
  syntax_error: 0,
  missing_string_quotes: 0,
};

/** Phase 2 threshold: add per-step mistakeHints when generic fallback exceeds this. */
export const PHASE2_MISMATCH_THRESHOLD = 0.4;

/** Phase 2 threshold: add branches when reveal-after-hints exceeds this. */
export const PHASE2_REVEAL_THRESHOLD = 0.25;

/** Phase 3 threshold: enable AI tutor when global mismatch exceeds this. */
export const PHASE3_MISMATCH_THRESHOLD = 0.3;

/** Phase 3 threshold: enable AI tutor when reveal rate exceeds this after Phase 2. */
export const PHASE3_REVEAL_THRESHOLD = 0.15;
