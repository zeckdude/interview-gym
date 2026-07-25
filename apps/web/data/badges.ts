export interface BadgeDefinition {
  slug: string;
  name: string;
  emoji: string;
  description: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { slug: 'first-pass', name: 'First Rep', emoji: '🥇', description: 'Pass your first challenge' },
  { slug: 'first-lesson', name: 'Student Mindset', emoji: '📖', description: 'Complete your first lesson' },

  { slug: 'streak-3', name: '3-Day Streak', emoji: '🔥', description: 'Practice 3 days in a row' },
  { slug: 'streak-5', name: 'On Fire', emoji: '🔥🔥', description: 'Practice 5 days in a row' },
  { slug: 'streak-7', name: 'Week Warrior', emoji: '⚡', description: 'Practice 7 days in a row' },
  { slug: 'streak-14', name: 'Interview Ready', emoji: '🏆', description: 'Practice 14 days in a row' },

  { slug: 'attempts-10', name: 'Showing Up', emoji: '💪', description: 'Complete 10 challenges' },
  { slug: 'attempts-25', name: 'Grinding', emoji: '🏋️', description: 'Complete 25 challenges' },
  { slug: 'attempts-50', name: 'Halfway There', emoji: '🎯', description: 'Complete 50 challenges' },
  { slug: 'attempts-100', name: 'The Hundred', emoji: '💯', description: 'Complete 100 challenges' },

  { slug: 'all-be-passed', name: 'Backend Boss', emoji: '🖥️', description: 'Pass all 20 BE challenges' },
  { slug: 'all-fe-passed', name: 'Frontend Pro', emoji: '🎨', description: 'Pass all 20 FE Essential challenges' },
  { slug: 'all-advanced-passed', name: 'Elite', emoji: '🚀', description: 'Pass all 20 FE Advanced challenges' },
  { slug: 'all-questions-passed', name: 'Theory Master', emoji: '🧠', description: 'Pass all 40 conceptual questions' },
  { slug: 'full-sweep', name: 'Full Sweep', emoji: '🌟', description: 'Pass every single challenge and question' },

  { slug: 'speed-demon', name: 'Speed Demon', emoji: '⚡', description: 'Pass a hard challenge in under 3 minutes' },

  { slug: 'freeze-used', name: 'Rest Day', emoji: '❄️', description: 'Use your first streak freeze' },
];

export function getBadgeDefinition(slug: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find((b) => b.slug === slug);
}
