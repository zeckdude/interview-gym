import type { PlaybookCategoryId } from '@/lib/playbook/categories';

export interface SystemPlaybookQuestion {
  category: PlaybookCategoryId;
  questionText: string;
  isSystemDefault: true;
  mostAsked: boolean;
}

export const SYSTEM_PLAYBOOK_QUESTIONS: SystemPlaybookQuestion[] = [
  // YOUR STORY
  { category: 'story', questionText: 'Tell me about yourself', isSystemDefault: true, mostAsked: true },
  { category: 'story', questionText: 'Walk me through your resume', isSystemDefault: true, mostAsked: true },
  { category: 'story', questionText: 'Why are you looking for a new role?', isSystemDefault: true, mostAsked: true },
  { category: 'story', questionText: 'How did you get into frontend engineering?', isSystemDefault: true, mostAsked: false },
  { category: 'story', questionText: "What's the most important thing I should know about you?", isSystemDefault: true, mostAsked: false },
  { category: 'story', questionText: 'What do you consider your greatest professional strength?', isSystemDefault: true, mostAsked: true },
  { category: 'story', questionText: 'What are you looking for in your next role?', isSystemDefault: true, mostAsked: true },
  { category: 'story', questionText: 'Where do you see yourself in 5 years?', isSystemDefault: true, mostAsked: false },

  // YOUR WORK
  { category: 'work', questionText: "Tell me about a project you're most proud of", isSystemDefault: true, mostAsked: true },
  { category: 'work', questionText: 'Walk me through a technical decision you made and why', isSystemDefault: true, mostAsked: true },
  { category: 'work', questionText: "What's the most complex thing you've built?", isSystemDefault: true, mostAsked: true },
  { category: 'work', questionText: 'Tell me about a time you had to make a difficult trade-off', isSystemDefault: true, mostAsked: false },
  { category: 'work', questionText: 'Describe a feature you built from scratch', isSystemDefault: true, mostAsked: false },
  { category: 'work', questionText: 'Tell me about a time you improved an existing system significantly', isSystemDefault: true, mostAsked: false },
  { category: 'work', questionText: 'What project would you most like to revisit and improve?', isSystemDefault: true, mostAsked: false },

  // YOUR THINKING
  { category: 'thinking', questionText: "How do you approach a problem you've never seen before?", isSystemDefault: true, mostAsked: true },
  { category: 'thinking', questionText: "Walk me through how you'd debug a performance issue", isSystemDefault: true, mostAsked: true },
  { category: 'thinking', questionText: 'How do you decide between two architectural approaches?', isSystemDefault: true, mostAsked: false },
  { category: 'thinking', questionText: 'Tell me about a time you had to figure something out from scratch', isSystemDefault: true, mostAsked: false },
  { category: 'thinking', questionText: 'How do you handle ambiguity in requirements?', isSystemDefault: true, mostAsked: true },
  { category: 'thinking', questionText: 'Walk me through your code review process', isSystemDefault: true, mostAsked: false },
  { category: 'thinking', questionText: 'How do you approach technical debt?', isSystemDefault: true, mostAsked: true },

  // YOUR VALUES
  { category: 'values', questionText: 'What are your core values?', isSystemDefault: true, mostAsked: true },
  { category: 'values', questionText: 'How do you like to work?', isSystemDefault: true, mostAsked: false },
  { category: 'values', questionText: 'What kind of team culture do you thrive in?', isSystemDefault: true, mostAsked: true },
  { category: 'values', questionText: 'What does great engineering look like to you?', isSystemDefault: true, mostAsked: false },
  { category: 'values', questionText: 'How do you handle conflict with a colleague?', isSystemDefault: true, mostAsked: true },
  { category: 'values', questionText: 'What motivates you?', isSystemDefault: true, mostAsked: true },
  { category: 'values', questionText: 'How do you handle feedback?', isSystemDefault: true, mostAsked: false },
  { category: 'values', questionText: 'What does work-life balance mean to you?', isSystemDefault: true, mostAsked: false },

  // YOUR TECHNICAL DEPTH
  { category: 'technical', questionText: 'Explain how the React rendering lifecycle works', isSystemDefault: true, mostAsked: true },
  { category: 'technical', questionText: "What's your mental model for state management?", isSystemDefault: true, mostAsked: true },
  { category: 'technical', questionText: 'How do you think about performance optimization?', isSystemDefault: true, mostAsked: true },
  { category: 'technical', questionText: "What's the difference between SSR, SSG, and ISR?", isSystemDefault: true, mostAsked: true },
  { category: 'technical', questionText: 'How do you approach accessibility in your work?', isSystemDefault: true, mostAsked: false },
  { category: 'technical', questionText: 'How do you stay current with the frontend ecosystem?', isSystemDefault: true, mostAsked: true },
  { category: 'technical', questionText: "What's your testing philosophy?", isSystemDefault: true, mostAsked: false },

  // YOUR LEADERSHIP
  { category: 'leadership', questionText: 'Tell me about a time you led without formal authority', isSystemDefault: true, mostAsked: true },
  { category: 'leadership', questionText: 'How do you mentor junior engineers?', isSystemDefault: true, mostAsked: true },
  { category: 'leadership', questionText: 'Tell me about a time you drove a technical initiative', isSystemDefault: true, mostAsked: true },
  { category: 'leadership', questionText: 'How do you handle a team member who is underperforming?', isSystemDefault: true, mostAsked: false },
  { category: 'leadership', questionText: 'Tell me about a time you influenced a decision without being the decision-maker', isSystemDefault: true, mostAsked: false },
  { category: 'leadership', questionText: 'How do you get buy-in for a technical change?', isSystemDefault: true, mostAsked: true },
  { category: 'leadership', questionText: 'Tell me about a time you had to push back on a bad idea', isSystemDefault: true, mostAsked: false },

  // THE COMPANY
  { category: 'company', questionText: 'Why do you want to work here?', isSystemDefault: true, mostAsked: true },
  { category: 'company', questionText: 'What do you know about us?', isSystemDefault: true, mostAsked: true },
  { category: 'company', questionText: 'What questions do you have for us?', isSystemDefault: true, mostAsked: true },
  { category: 'company', questionText: 'Where do you see yourself in 2 years here?', isSystemDefault: true, mostAsked: false },
  { category: 'company', questionText: 'What excites you most about this role?', isSystemDefault: true, mostAsked: true },
  { category: 'company', questionText: 'What do you think we could be doing better?', isSystemDefault: true, mostAsked: false },
  { category: 'company', questionText: "How does your experience align with what we're building?", isSystemDefault: true, mostAsked: false },

  // YOUR ACCOMPLISHMENTS
  { category: 'accomplishments', questionText: 'Tell me about your biggest professional accomplishment', isSystemDefault: true, mostAsked: true },
  { category: 'accomplishments', questionText: 'Tell me about a time you delivered outsized impact', isSystemDefault: true, mostAsked: true },
  { category: 'accomplishments', questionText: "What's the most impactful thing you've shipped?", isSystemDefault: true, mostAsked: true },
  { category: 'accomplishments', questionText: 'Tell me about a time you went above and beyond', isSystemDefault: true, mostAsked: false },
  { category: 'accomplishments', questionText: 'Tell me about a time you solved a problem no one else could', isSystemDefault: true, mostAsked: false },

  // YOUR LEARNING MOMENTS
  { category: 'learning', questionText: 'Tell me about a time you failed', isSystemDefault: true, mostAsked: true },
  { category: 'learning', questionText: "What's your biggest professional regret?", isSystemDefault: true, mostAsked: false },
  { category: 'learning', questionText: 'Tell me about a production incident you caused', isSystemDefault: true, mostAsked: true },
  { category: 'learning', questionText: 'Tell me about a time you made a bad technical decision', isSystemDefault: true, mostAsked: true },
  { category: 'learning', questionText: "What's the hardest professional lesson you've learned?", isSystemDefault: true, mostAsked: false },
  { category: 'learning', questionText: 'Tell me about a time a project went sideways and how you recovered', isSystemDefault: true, mostAsked: false },
];
