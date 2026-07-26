export type VoiceInterviewCategory =
  | 'behavioral'
  | 'technical'
  | 'frontend'
  | 'nextjs'
  | 'systems'
  | 'culture';

export type VoiceInterviewDifficulty = 'easy' | 'intermediate' | 'advanced';

export interface VoiceInterviewQuestion {
  id: string;
  category: VoiceInterviewCategory;
  difficulty: VoiceInterviewDifficulty;
  mostAsked: boolean;
  question: string;
  context?: string;
  idealAnswerGuidance: string;
  followUpBank: string[];
  challengeQuestions: string[];
  relatedLessonIds: string[];
  externalResources: { label: string; url: string }[];
  targetAnswerMinutes: number;
}

export const VOICE_INTERVIEW_CATEGORIES: {
  value: VoiceInterviewCategory;
  label: string;
}[] = [
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'technical', label: 'Technical Concepts' },
  { value: 'frontend', label: 'Frontend-Specific' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'systems', label: 'Systems Design' },
  { value: 'culture', label: 'Culture & Leadership' },
];

export const voiceInterviewQuestions: VoiceInterviewQuestion[] = [
  {
    id: 'vi-b-01',
    category: 'behavioral',
    difficulty: 'easy',
    mostAsked: true,
    question:
      'Tell me about a time you had to deliver a project under a tight deadline. How did you handle it?',
    context: 'Use the STAR method: Situation, Task, Action, Result. Aim for 2-3 minutes.',
    idealAnswerGuidance:
      'Strong answer: specific situation with real numbers/stakes, clear ownership of the task, concrete actions taken (not vague "worked hard"), measurable result. Weak answer: vague, no ownership, result unclear, blames team.',
    followUpBank: [
      'What would you do differently now?',
      'How did you communicate the timeline risk to stakeholders?',
      'Did you have to cut scope? How did you decide what to cut?',
    ],
    challengeQuestions: [
      'You said you worked extra hours — how do you avoid that pattern becoming the norm?',
      'If your manager had given you more resources, would you still have made the deadline?',
    ],
    relatedLessonIds: [],
    externalResources: [
      {
        label: 'STAR Method Guide',
        url: 'https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique',
      },
    ],
    targetAnswerMinutes: 2.5,
  },
  {
    id: 'vi-b-02',
    category: 'behavioral',
    difficulty: 'easy',
    mostAsked: true,
    question:
      'Tell me about a time you disagreed with a technical decision made by your team or manager. What did you do?',
    idealAnswerGuidance:
      'Strong: raised the concern clearly with data/reasoning, listened to counter-arguments, committed to the final decision even if overruled, followed up after. Weak: either rolled over without speaking up, or was combative and made it personal.',
    followUpBank: [
      'How did you raise the concern without making it adversarial?',
      'What happened after the decision was made?',
      'Would you have handled it differently in retrospect?',
    ],
    challengeQuestions: [
      'What if you were right and the decision caused real problems — how do you handle that without saying "I told you so"?',
      'What if it was a security concern and your manager still said no?',
    ],
    relatedLessonIds: [],
    externalResources: [],
    targetAnswerMinutes: 2,
  },
  {
    id: 'vi-b-03',
    category: 'behavioral',
    difficulty: 'intermediate',
    mostAsked: true,
    question:
      'Describe a time you led a technical initiative without formal authority. How did you get buy-in?',
    idealAnswerGuidance:
      'Strong: identified a real problem, built a coalition, communicated in business terms not just tech terms, showed results. Weak: just did the work themselves without rallying others, or got blocked and gave up.',
    followUpBank: [
      "How did you handle the people who weren't bought in?",
      'How did you measure success?',
      'What was the biggest obstacle to adoption?',
    ],
    challengeQuestions: [
      'What if a senior engineer actively opposed the initiative?',
      'How do you scale this kind of influence beyond your immediate team?',
    ],
    relatedLessonIds: [],
    externalResources: [],
    targetAnswerMinutes: 3,
  },
  {
    id: 'vi-b-04',
    category: 'behavioral',
    difficulty: 'intermediate',
    mostAsked: true,
    question:
      "Tell me about the most complex frontend system you've built. Walk me through the architecture and the decisions you made.",
    idealAnswerGuidance:
      'Strong: clearly explains the problem, constraints, architectural options considered, trade-offs made, result. Shows systems thinking. Weak: describes features not architecture, can\'t explain why decisions were made.',
    followUpBank: [
      'What would you do differently today?',
      'How did you handle performance at scale?',
      'How did the team collaborate on this?',
    ],
    challengeQuestions: [
      'What was the worst decision you made on this project?',
      'How would you rebuild this from scratch with what you know now?',
    ],
    relatedLessonIds: ['lesson-nj-app-router-basics'],
    externalResources: [],
    targetAnswerMinutes: 4,
  },
  {
    id: 'vi-b-05',
    category: 'behavioral',
    difficulty: 'advanced',
    mostAsked: false,
    question:
      'Tell me about a time a production incident was your fault. What happened and how did you handle it?',
    idealAnswerGuidance:
      'Strong: owns the mistake clearly, explains the incident with specifics, describes the immediate fix, the root cause analysis, and the systemic improvement made. Weak: minimizes their role, blames others, has no learnings, or didn\'t follow up with process improvements.',
    followUpBank: [
      'How did you communicate the incident to stakeholders in real time?',
      'What did you change in your process to prevent it from happening again?',
      'How did the team react?',
    ],
    challengeQuestions: [
      'How do you build a culture where engineers feel safe owning their mistakes?',
      'What if the incident had caused significant customer data loss?',
    ],
    relatedLessonIds: [],
    externalResources: [
      {
        label: 'Writing a Great Post-Mortem',
        url: 'https://sre.google/sre-book/postmortem-culture/',
      },
    ],
    targetAnswerMinutes: 3,
  },
  {
    id: 'vi-t-01',
    category: 'technical',
    difficulty: 'easy',
    mostAsked: true,
    question:
      "Explain how the JavaScript event loop works. I'm not a developer — explain it to me like I'm your smart but non-technical colleague.",
    idealAnswerGuidance:
      'Strong: uses a clear analogy, explains call stack/task queue without jargon, explains why setTimeout(fn, 0) doesn\'t mean "right now", mentions Promises briefly. Weak: uses jargon without explaining, gets lost in technical details, can\'t simplify.',
    followUpBank: [
      'Now explain it to me as a developer. Go deeper.',
      'What is the difference between a microtask and a macrotask?',
      'Why does a long-running synchronous function freeze the browser?',
    ],
    challengeQuestions: [
      "If setTimeout(fn, 0) doesn't execute immediately, when exactly does it execute?",
      'Why do Promises resolve before setTimeout callbacks?',
    ],
    relatedLessonIds: ['lesson-fe-react-hooks'],
    externalResources: [
      { label: 'Event Loop Visualizer', url: 'https://www.jsv9000.app/' },
      {
        label: 'Jake Archibald: In The Loop',
        url: 'https://www.youtube.com/watch?v=cCOL7MC4Pl0',
      },
    ],
    targetAnswerMinutes: 2,
  },
  {
    id: 'vi-t-02',
    category: 'technical',
    difficulty: 'intermediate',
    mostAsked: true,
    question:
      'Walk me through what happens from the moment a user types a URL and presses Enter to when they see the page fully loaded.',
    idealAnswerGuidance:
      'Strong: DNS lookup, TCP connection, TLS handshake, HTTP request, server processing, HTML parsing, CSS/JS fetching, render tree construction, layout, paint, composite — and connects this to performance. Weak: skips steps, gets DNS or TLS wrong, can\'t connect to web performance.',
    followUpBank: [
      'Where in that process can you make the most performance improvement?',
      'What is a TCP handshake and why does it add latency?',
      'How does HTTP/2 change this picture compared to HTTP/1.1?',
    ],
    challengeQuestions: [
      'The page is visually complete but the user says it feels slow. What do you look at?',
      'How does a Service Worker change what happens when the user visits the same URL a second time?',
    ],
    relatedLessonIds: ['lesson-nj-performance', 'lesson-fea-core-web-vitals'],
    externalResources: [
      {
        label: 'What Happens When You Type a URL',
        url: 'https://github.com/alex/what-happens-when',
      },
    ],
    targetAnswerMinutes: 3,
  },
  {
    id: 'vi-t-03',
    category: 'technical',
    difficulty: 'intermediate',
    mostAsked: true,
    question:
      "What is the difference between authentication and authorization? Give me a real-world example from a system you've built.",
    idealAnswerGuidance:
      'Strong: clearly defines both, uses a concrete example, mentions JWT/sessions for auth, RBAC/policies for authz, notes they fail independently. Weak: conflates the two, example is vague, can\'t explain what happens when each fails.',
    followUpBank: [
      'How do you implement authorization checks — at the route level, the service level, or the database level?',
      'What is OAuth and when would you use it?',
      'How do you handle a user whose permissions change while they have an active session?',
    ],
    challengeQuestions: [
      "What's the difference between authorization and access control?",
      "How do you prevent a user from accessing another user's data even if they're authenticated?",
    ],
    relatedLessonIds: ['lesson-nj-auth-patterns', 'lesson-be-jwt'],
    externalResources: [
      {
        label: 'Auth0: Authentication vs Authorization',
        url: 'https://auth0.com/docs/get-started/identity-fundamentals/authentication-and-authorization',
      },
    ],
    targetAnswerMinutes: 2.5,
  },
  {
    id: 'vi-fe-01',
    category: 'frontend',
    difficulty: 'intermediate',
    mostAsked: true,
    question:
      'How do you approach performance optimization for a React application? Walk me through your process.',
    idealAnswerGuidance:
      'Strong: starts with measurement (profiler, Lighthouse), identifies specific bottleneck, applies appropriate fix (memo, virtualization, code splitting, lazy loading), measures again. Weak: jumps straight to memo/useMemo without measuring, generic advice.',
    followUpBank: [
      'When do you actually need React.memo vs when is it premature optimization?',
      'How do you handle a list of 10,000 items?',
      'What Core Web Vitals do you care most about for a React app?',
    ],
    challengeQuestions: [
      "You've memoized everything and the app is still slow. What do you do next?",
      'A business stakeholder says "the app feels slow" but Lighthouse gives a 95. What\'s happening?',
    ],
    relatedLessonIds: ['lesson-fe-performance-optimization', 'lesson-fea-core-web-vitals'],
    externalResources: [
      { label: 'React Profiler — React Docs', url: 'https://react.dev/reference/react/Profiler' },
    ],
    targetAnswerMinutes: 3,
  },
  {
    id: 'vi-fe-02',
    category: 'frontend',
    difficulty: 'intermediate',
    mostAsked: true,
    question:
      'Explain the React rendering lifecycle. How does React decide when to re-render a component?',
    idealAnswerGuidance:
      'Strong: explains state/prop change triggers render, parent render triggers child render, how reconciliation works, when memo prevents re-render, the commit phase. Weak: confuses rendering with mounting, doesn\'t know about reconciliation.',
    followUpBank: [
      'What is the difference between the render phase and the commit phase?',
      'When does a component unmount vs simply not render?',
      "How does React 18's automatic batching change this?",
    ],
    challengeQuestions: [
      'A component is rendering 50 times per second. Walk me through how you diagnose it.',
      'How does Concurrent Mode change when components render?',
    ],
    relatedLessonIds: ['lesson-fe-react-hooks', 'lesson-fe-performance-optimization'],
    externalResources: [
      {
        label: 'React Rendering Behavior — Mark Erikson',
        url: 'https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/',
      },
    ],
    targetAnswerMinutes: 3,
  },
  {
    id: 'vi-fe-03',
    category: 'frontend',
    difficulty: 'advanced',
    mostAsked: true,
    question:
      "You're the first frontend engineer at a Series A startup. How do you set up the frontend architecture from scratch?",
    idealAnswerGuidance:
      'Strong: asks clarifying questions about team size, growth plans, product type; chooses tech stack with reasoning; addresses routing, state management, styling, testing, CI/CD, error tracking, analytics; thinks about hiring and onboarding future engineers. Weak: jumps to tech choices without understanding requirements, doesn\'t think beyond the code.',
    followUpBank: [
      'Why that framework over alternatives?',
      'How do you structure the repo to scale from 1 to 10 engineers?',
      'How do you set up testing from day one without slowing down?',
    ],
    challengeQuestions: [
      'The CEO says "we need to ship features, not build infrastructure." How do you respond?',
      'Six months in, the codebase is a mess because you moved fast. How do you address technical debt without stopping feature work?',
    ],
    relatedLessonIds: ['lesson-nj-app-router-basics', 'lesson-fea-monorepo-library'],
    externalResources: [],
    targetAnswerMinutes: 4,
  },
  {
    id: 'vi-nj-01',
    category: 'nextjs',
    difficulty: 'intermediate',
    mostAsked: true,
    question:
      'Explain the difference between Server Components and Client Components. When have you used each in a real project?',
    idealAnswerGuidance:
      'Strong: clear definition of each, uses a real project example, explains the component boundary, knows that Client Components still SSR, understands the bundle size implications. Weak: thinks Client Components only run in the browser, can\'t give a real example.',
    followUpBank: [
      'Can a Server Component import a Client Component? What about the other way around?',
      'How do you pass data from a Server Component to a Client Component?',
      'What happens to a Client Component during SSR?',
    ],
    challengeQuestions: [
      'You have a component that needs both database access and a click handler. How do you structure it?',
      'How do context providers work with Server Components?',
    ],
    relatedLessonIds: ['lesson-nj-server-client-components'],
    externalResources: [
      {
        label: 'Server Components — Next.js Docs',
        url: 'https://nextjs.org/docs/app/building-your-application/rendering/server-components',
      },
    ],
    targetAnswerMinutes: 3,
  },
  {
    id: 'vi-nj-02',
    category: 'nextjs',
    difficulty: 'advanced',
    mostAsked: true,
    question:
      "Walk me through how you'd architect a Next.js app for a high-traffic e-commerce site. What rendering strategy for which pages?",
    idealAnswerGuidance:
      'Strong: homepage ISR, product pages ISR with revalidateTag, cart/checkout SSR or Server Actions, account pages dynamic, explains the trade-offs for each decision with traffic and freshness requirements. Weak: everything SSR or everything SSG, no nuance about trade-offs.',
    followUpBank: [
      'How do you handle personalization (logged-in user sees different content) on a statically rendered page?',
      'How would you implement real-time inventory without making all pages dynamic?',
      "What's your caching strategy for product pages that change price frequently?",
    ],
    challengeQuestions: [
      "Black Friday hits and your ISR pages are stale. What's your fallback?",
      'How do you A/B test a new checkout flow without re-deploying?',
    ],
    relatedLessonIds: ['lesson-nj-rendering-strategies', 'lesson-nj-caching'],
    externalResources: [
      {
        label: 'Next.js E-commerce — Vercel',
        url: 'https://vercel.com/templates/next.js/nextjs-commerce',
      },
    ],
    targetAnswerMinutes: 4,
  },
  {
    id: 'vi-s-01',
    category: 'systems',
    difficulty: 'intermediate',
    mostAsked: true,
    question:
      'Design a URL shortener like bit.ly. Walk me through the high-level architecture and the key trade-offs.',
    idealAnswerGuidance:
      'Strong: discusses read-heavy traffic, hash generation vs counter, database choice, caching layer, redirect latency, analytics. Weak: only describes CRUD without scaling or trade-offs.',
    followUpBank: [
      'How do you handle custom short codes?',
      'What happens when a link expires?',
      'How would you prevent abuse or spam links?',
    ],
    challengeQuestions: [
      'Your redirect service is getting 100k requests per second. What breaks first?',
      'How do you handle a hot link that goes viral?',
    ],
    relatedLessonIds: [],
    externalResources: [],
    targetAnswerMinutes: 4,
  },
  {
    id: 'vi-s-02',
    category: 'systems',
    difficulty: 'advanced',
    mostAsked: true,
    question:
      'How would you design a real-time notification system for a social app with millions of users?',
    idealAnswerGuidance:
      'Strong: push vs pull, WebSockets vs SSE, fan-out on write vs read, message queues, delivery guarantees, offline users. Weak: only mentions WebSockets without scaling considerations.',
    followUpBank: [
      'How do you prioritize notifications for a user who is offline for a week?',
      'What delivery guarantees do you need and how do you implement them?',
      'How do you prevent notification fatigue?',
    ],
    challengeQuestions: [
      'A celebrity posts and 10 million followers need a notification within seconds. How do you handle that?',
      'How do you deduplicate notifications across devices?',
    ],
    relatedLessonIds: [],
    externalResources: [],
    targetAnswerMinutes: 4,
  },
  {
    id: 'vi-c-01',
    category: 'culture',
    difficulty: 'easy',
    mostAsked: true,
    question: 'Why are you interested in this role and this company?',
    idealAnswerGuidance:
      'Strong: specific to the company (not generic), connects their background to what the role offers, shows genuine curiosity about the product or problem space. Weak: could apply to any company, salary-focused, vague.',
    followUpBank: [
      'What specifically about the product excites you?',
      'What do you know about our technical stack?',
      'Where do you see yourself in 2 years here?',
    ],
    challengeQuestions: [
      "We're not the only company you're talking to. What would make you choose us?",
    ],
    relatedLessonIds: [],
    externalResources: [],
    targetAnswerMinutes: 2,
  },
  {
    id: 'vi-c-02',
    category: 'culture',
    difficulty: 'intermediate',
    mostAsked: true,
    question:
      'How do you stay current with the rapidly changing frontend ecosystem? Walk me through your learning process.',
    idealAnswerGuidance:
      'Strong: specific sources (names blogs, people, channels), shows they apply what they learn through side projects or work, has opinions on what\'s worth following vs hype. Weak: says "I read articles" without specifics, can\'t point to anything they\'ve learned recently.',
    followUpBank: [
      "What's the most interesting thing you've learned in the last 3 months?",
      'How do you evaluate whether a new library or framework is worth adopting?',
      'What do you think is overrated in the current frontend ecosystem?',
    ],
    challengeQuestions: ['How do you avoid shiny object syndrome and keep shipping?'],
    relatedLessonIds: [],
    externalResources: [],
    targetAnswerMinutes: 2,
  },
  {
    id: 'vi-c-03',
    category: 'culture',
    difficulty: 'advanced',
    mostAsked: false,
    question: 'How do you approach mentoring junior engineers? Give me a specific example.',
    idealAnswerGuidance:
      'Strong: concrete example, shows they meet the junior where they are, gives ownership rather than answers, follows up and iterates. Weak: vague, no example, describes a one-way knowledge transfer rather than genuine development.',
    followUpBank: [
      "How do you handle a junior who is struggling but doesn't ask for help?",
      'How do you balance mentoring with your own delivery responsibilities?',
    ],
    challengeQuestions: ['A junior engineer on your team is underperforming. How do you handle it?'],
    relatedLessonIds: [],
    externalResources: [],
    targetAnswerMinutes: 2.5,
  },
];

export function getVoiceQuestionById(id: string): VoiceInterviewQuestion | undefined {
  return voiceInterviewQuestions.find((q) => q.id === id);
}

export function pickVoiceQuestions(options: {
  category: VoiceInterviewCategory | 'mixed';
  difficulty: VoiceInterviewDifficulty | 'mixed';
  count: number;
  mostAskedOnly?: boolean;
}): VoiceInterviewQuestion[] {
  let pool = [...voiceInterviewQuestions];

  if (options.category !== 'mixed') {
    pool = pool.filter((q) => q.category === options.category);
  }

  if (options.difficulty !== 'mixed') {
    pool = pool.filter((q) => q.difficulty === options.difficulty);
  }

  if (options.mostAskedOnly) {
    pool = pool.filter((q) => q.mostAsked);
  }

  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(options.count, shuffled.length));
}

export function getCategoryLabel(category: VoiceInterviewCategory): string {
  return VOICE_INTERVIEW_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}
