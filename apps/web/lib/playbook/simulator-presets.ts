import type { PlaybookCategoryId } from '@/lib/playbook/categories';

export interface SimulatorPreset {
  id: string;
  label: string;
  icon: string;
  description: string;
  categories: PlaybookCategoryId[];
  difficulty: 'easy' | 'intermediate' | 'advanced' | 'mixed';
  questionCount: number;
  includeFollowUps: boolean;
}

export const SIMULATOR_PRESETS: SimulatorPreset[] = [
  {
    id: 'recruiter-screen',
    label: 'Recruiter Screen',
    icon: '📞',
    description: 'First call with an in-house recruiter. Background, motivation, logistics.',
    categories: ['story', 'values', 'company'],
    difficulty: 'easy',
    questionCount: 5,
    includeFollowUps: true,
  },
  {
    id: 'technical-round',
    label: 'Technical Round',
    icon: '💻',
    description: 'Deep dive on your technical knowledge and how you think.',
    categories: ['technical', 'work', 'thinking'],
    difficulty: 'advanced',
    questionCount: 5,
    includeFollowUps: true,
  },
  {
    id: 'culture-fit',
    label: 'Culture Fit',
    icon: '🤝',
    description: 'Values alignment, working style, team dynamics.',
    categories: ['values', 'leadership', 'learning'],
    difficulty: 'intermediate',
    questionCount: 5,
    includeFollowUps: true,
  },
  {
    id: 'behavioral-round',
    label: 'Behavioral Round',
    icon: '🎯',
    description: 'STAR method stories, accomplishments, and failures.',
    categories: ['accomplishments', 'learning', 'leadership'],
    difficulty: 'intermediate',
    questionCount: 5,
    includeFollowUps: true,
  },
  {
    id: 'full-loop',
    label: 'Full Loop',
    icon: '🔄',
    description: 'A complete interview simulation across all categories.',
    categories: [
      'story',
      'work',
      'thinking',
      'values',
      'technical',
      'leadership',
      'company',
      'accomplishments',
      'learning',
    ],
    difficulty: 'mixed',
    questionCount: 10,
    includeFollowUps: true,
  },
];

export function getPresetById(id: string): SimulatorPreset | undefined {
  return SIMULATOR_PRESETS.find((p) => p.id === id);
}
