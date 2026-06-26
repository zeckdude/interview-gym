import type { QuestionStub } from './types';

function createStub(
  id: string,
  title: string,
  category: 'be-question' | 'fe-question'
): QuestionStub {
  return {
    id,
    title,
    category,
    difficulty: 'medium',
    comingSoon: true,
  };
}

export const feQuestions: QuestionStub[] = Array.from({ length: 20 }, (_, i) =>
  createStub(
    `fe-q-${String(i + 1).padStart(2, '0')}`,
    `Frontend Concept ${i + 1}`,
    'fe-question'
  )
);
