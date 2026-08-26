export const STAGE_DEFINITIONS = {
  1: {
    label: 'Stage 1',
    name: 'Pass a Phone Screen',
    description:
      'The fundamentals a recruiter or hiring manager will probe in a first call. Complete this before anything else.',
    unlockMessage: "Stage 2 unlocked — you're ready for a technical round.",
    color: 'success' as const,
  },
  2: {
    label: 'Stage 2',
    name: 'Pass a Technical Round',
    description:
      'The depth a senior engineer interviewer will expect. This is where most candidates are separated.',
    unlockMessage: "Stage 3 unlocked — you're ready for system design.",
    color: 'warning' as const,
  },
  3: {
    label: 'Stage 3',
    name: 'Pass a System Design Round',
    description:
      'Architecture, trade-offs, and scaling. This is what separates senior engineers from staff.',
    unlockMessage: "Path complete — you're interview ready. 💪",
    color: 'brand' as const,
  },
} as const;

export type StageNumber = keyof typeof STAGE_DEFINITIONS;
