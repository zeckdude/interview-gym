export const PLAYBOOK_CATEGORIES = [
  {
    id: 'story',
    label: 'Your Story',
    icon: '📖',
    description:
      "Your background, career narrative, and why you're here. The through-line of your professional life.",
    subsectionTemplate: null,
    promptExamples: [
      'Tell me about yourself',
      'Walk me through your resume',
      'How did you get into frontend engineering?',
      'Why are you looking for a new role?',
      "What's the most important thing I should know about you?",
    ],
  },
  {
    id: 'work',
    label: 'Your Work',
    icon: '💻',
    description:
      "Specific projects, technical decisions, and what you've shipped. The evidence of your craft.",
    subsectionTemplate: null,
    promptExamples: [
      "Tell me about a project you're most proud of",
      'Walk me through a technical decision you made and why',
      "What's the most complex thing you've built?",
      'Tell me about a time you had to make a trade-off',
    ],
  },
  {
    id: 'thinking',
    label: 'Your Thinking',
    icon: '🧠',
    description:
      'How you approach problems, architecture decisions, and hard situations. Your mental models.',
    subsectionTemplate: null,
    promptExamples: [
      "How do you approach a problem you've never seen before?",
      "Walk me through how you'd debug a performance issue",
      'How do you decide between two architectural approaches?',
      'Tell me about a time you had to figure something out from scratch',
    ],
  },
  {
    id: 'values',
    label: 'Your Values',
    icon: '⭐',
    description:
      'What you care about, how you work with others, and what kind of environment brings out your best.',
    subsectionTemplate: null,
    promptExamples: [
      'What are your core values?',
      'How do you like to work?',
      'What kind of team culture do you thrive in?',
      'What does great engineering look like to you?',
      'How do you handle conflict with a colleague?',
    ],
  },
  {
    id: 'technical',
    label: 'Your Technical Depth',
    icon: '⚙️',
    description:
      'Your knowledge of concepts, frameworks, and systems. The depth behind the titles.',
    subsectionTemplate: null,
    promptExamples: [
      'Explain how the React rendering lifecycle works',
      "What's your mental model for state management?",
      'How do you think about performance optimization?',
      "What's the difference between SSR, SSG, and ISR?",
    ],
  },
  {
    id: 'leadership',
    label: 'Your Leadership',
    icon: '🎯',
    description:
      'How you influence, mentor, drive initiatives, and make teams better — with or without a title.',
    subsectionTemplate: null,
    promptExamples: [
      'Tell me about a time you led without formal authority',
      'How do you mentor junior engineers?',
      'Tell me about a time you drove a technical initiative',
      'How do you handle a team member who is underperforming?',
    ],
  },
  {
    id: 'company',
    label: 'The Company',
    icon: '🏢',
    description:
      "Why this company, the questions you ask, and how you show up as someone who's done the research.",
    subsectionTemplate: null,
    promptExamples: [
      'Why do you want to work here?',
      'What do you know about us?',
      'What questions do you have for us?',
      'Where do you see yourself in 2 years here?',
      'What excites you most about this role?',
    ],
  },
  {
    id: 'accomplishments',
    label: 'Your Accomplishments',
    icon: '🏆',
    description:
      'Past wins told with business context, technical depth, and measurable impact. Your greatest hits.',
    subsectionTemplate: [
      {
        id: 'overview',
        label: 'The Overview',
        placeholder:
          'What was this accomplishment in one or two sentences? Be bold — lead with the result.',
      },
      {
        id: 'business_need',
        label: 'The Business Need',
        placeholder:
          'What problem was the business trying to solve? What was broken, slow, or missing before this?',
      },
      {
        id: 'technical_approach',
        label: 'The Technical Approach',
        placeholder:
          'What did you build or change? What were the key technical decisions and why?',
      },
      {
        id: 'your_role',
        label: 'Your Role',
        placeholder:
          'What specifically did YOU do? Be specific — not "we built" but "I designed the state machine that..."',
      },
      {
        id: 'process',
        label: 'The Process',
        placeholder:
          'How did you work? What obstacles did you hit and how did you get through them?',
      },
      {
        id: 'impact',
        label: 'The Impact',
        placeholder:
          'What was the measurable result? Numbers, percentages, time saved, revenue impacted, users helped. Be specific.',
      },
      {
        id: 'talking_points',
        label: 'Key Talking Points',
        placeholder:
          'The 3-5 most compelling things to say about this story. These are your headlines.',
      },
    ],
  },
  {
    id: 'learning',
    label: 'Your Learning Moments',
    icon: '📚',
    description:
      'Failures, mistakes, and hard lessons — told with ownership, growth, and the safeguards you put in place.',
    subsectionTemplate: [
      {
        id: 'what_happened',
        label: 'What Happened',
        placeholder:
          'Describe the situation clearly. What went wrong and when did you realize it?',
      },
      {
        id: 'my_role',
        label: 'My Role In It',
        placeholder:
          "Own it fully. What decisions or actions (or inactions) contributed to this? Don't deflect.",
      },
      {
        id: 'how_i_fixed_it',
        label: 'How I Fixed It',
        placeholder:
          'What did you do to resolve it? Who did you involve? What was the timeline?',
      },
      {
        id: 'what_i_changed',
        label: 'What I Changed',
        placeholder:
          'What did you do differently going forward? In your process, your communication, your approach?',
      },
      {
        id: 'safeguards',
        label: 'Safeguards & Alerts',
        placeholder:
          "What systems, checks, or alerts did you put in place so this can't happen silently again?",
      },
    ],
  },
] as const;

export type PlaybookCategoryId = (typeof PLAYBOOK_CATEGORIES)[number]['id'];

export function getCategoryById(id: string) {
  return PLAYBOOK_CATEGORIES.find((c) => c.id === id);
}

export function isPlaybookCategoryId(id: string): id is PlaybookCategoryId {
  return PLAYBOOK_CATEGORIES.some((c) => c.id === id);
}
