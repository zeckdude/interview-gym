import type { PlaybookCategoryId } from '@/lib/playbook/categories';

export interface SeedSubsection {
  label: string;
  textContent: string;
  order: number;
}

export interface SeedEntry {
  category: PlaybookCategoryId;
  title: string;
  questionPrompt: string;
  summary?: string;
  subsections: SeedSubsection[];
}

export const SEEDED_PLAYBOOK_ENTRIES: SeedEntry[] = [
  {
    category: 'accomplishments',
    title: 'Aerospike Cloud Console — Provisioning Wizard',
    questionPrompt: 'Tell me about a complex frontend system you built end to end',
    summary:
      'Sole frontend owner of the most revenue-critical flow in the product — a multi-step provisioning wizard with custom state machine.',
    subsections: [
      {
        label: 'The Overview',
        order: 0,
        textContent: `Built a multi-step database provisioning wizard for Aerospike's cloud console that guided enterprise customers through spinning up a new database cluster. This was the most critical user flow in the product — it was the moment a prospect became a paying customer.`,
      },
      {
        label: 'The Business Need',
        order: 1,
        textContent: `The existing flow was a single long form that overwhelmed users and had a high abandonment rate. Enterprise customers were dropping off before completing setup, which directly impacted revenue. The product needed a guided, intelligent step-by-step experience that validated inputs in real time and could handle the complexity of cloud database configuration without losing the user.`,
      },
      {
        label: 'The Technical Approach',
        order: 2,
        textContent: `Built a stateful multi-step wizard in React with a custom state machine managing the flow logic. Each step was independently validated before allowing progression. Key challenges solved: undo/back navigation that preserved previously entered data, async-dependent fields that waited for upstream data before rendering, stale state handling that auto-reset downstream fields when an earlier answer changed, a review screen before final launch, a contextual help panel that pulled documentation from another repo, and post-submit status polling with notifications once the database was ready.`,
      },
      {
        label: 'Your Role',
        order: 3,
        textContent: `I was the sole frontend engineer on this feature. I owned the architecture, the implementation, the UX decisions, and the integration with the backend provisioning API. I worked directly with the product designer and backend team to define the data contract and the step flow logic.`,
      },
      {
        label: 'The Process',
        order: 4,
        textContent: `Started by mapping every possible user path through the wizard including error states and edge cases. Built the state machine first before writing any UI — that decision paid off because the logic was complex and having it separated from the rendering made it testable and maintainable. The hardest problem was the stale state handling — when a user changed an earlier answer, we had to know which downstream fields depended on it and reset only those without wiping unrelated progress.`,
      },
      {
        label: 'The Impact',
        order: 5,
        textContent: `The new wizard significantly reduced abandonment on the provisioning flow. Enterprise customers were able to complete database setup without needing to contact support, which was a previous requirement for complex configurations. The contextual help panel reduced support tickets related to configuration questions.`,
      },
      {
        label: 'Key Talking Points',
        order: 6,
        textContent: `1. Sole frontend owner of the most revenue-critical flow in the product
2. Built a custom state machine that handled 11+ distinct edge cases
3. Solved real UX problems that were causing direct revenue loss
4. Contextual help panel pulled live docs from another repo — a creative solution to a content problem
5. Post-submit polling kept users informed without blocking the UI`,
      },
    ],
  },
  {
    category: 'values',
    title: 'Core Values & Mentoring Philosophy',
    questionPrompt: 'What are your core values?',
    summary:
      'Craft quality, user impact, ownership, and mentoring — with direct communication and psychological safety.',
    subsections: [
      {
        label: 'Engineering Values',
        order: 0,
        textContent: `I care deeply about craft quality and user impact — not shipping for shipping's sake. Great engineering means the user experience is fast, accessible, and reliable. I value ownership: if I touch something, I want to understand it end to end and leave it better than I found it. I believe in direct, kind communication — say what you mean, assume good intent, and address problems early before they become crises.`,
      },
      {
        label: 'How I Mentor',
        order: 1,
        textContent: `I mentor by pairing on real work, not abstract lectures. I ask questions that help people discover the answer themselves, then fill in gaps they couldn't have known. I celebrate progress loudly and give critical feedback privately. I focus on teaching mental models — why we chose this pattern, what trade-offs we made — so juniors can make good decisions independently next time. I protect psychological safety: it's okay to not know, it's not okay to hide that you don't know.`,
      },
      {
        label: 'Environment I Thrive In',
        order: 2,
        textContent: `I do my best work on teams with high trust, clear priorities, and room to propose better approaches. I thrive when product and engineering collaborate early — when I'm involved in shaping the "what" not just implementing the "how." I need an environment that values learning from failures, not punishing them. Remote or hybrid works well for me when communication is intentional and async-friendly.`,
      },
      {
        label: 'What Great Engineering Looks Like',
        order: 3,
        textContent: `Great engineering is invisible to users and obvious to teammates. It means predictable behavior, thoughtful abstractions, tests that catch real regressions, and documentation that answers the question someone will ask in six months. It's also knowing when NOT to build — when the simplest solution that solves the business problem is the right one.`,
      },
    ],
  },
  {
    category: 'thinking',
    title: 'Problem-Solving Framework',
    questionPrompt: 'How do you approach a problem you have never seen before?',
    summary:
      'Size the problem first, then apply Research → Frame → Decide for large problems or direct execution for small ones.',
    subsections: [
      {
        label: 'Sizing the Problem',
        order: 0,
        textContent: `First I size the problem: is this a small fix I can resolve in an hour, or a large ambiguous problem that needs structured exploration? Small problems get a quick hypothesis, a minimal change, and a verification step. Large problems get my RFD framework before any code is written.`,
      },
      {
        label: 'RFD — Research',
        order: 1,
        textContent: `Research: gather context before forming opinions. Read existing code, check logs and metrics, talk to people who've touched this area, search for prior art. I write down what I know, what I assume, and what I need to learn. The goal is to avoid solving the wrong problem.`,
      },
      {
        label: 'RFD — Frame',
        order: 2,
        textContent: `Frame: define the problem precisely. What is the user/business impact? What constraints exist (time, tech, team)? What does success look like — ideally with a measurable outcome? I often sketch options on paper or in a doc before committing. If I can't explain the problem in two sentences, I'm not ready to decide.`,
      },
      {
        label: 'RFD — Decide',
        order: 3,
        textContent: `Decide: pick an approach with explicit trade-offs documented. I prefer reversible decisions made quickly over perfect decisions made slowly. For irreversible decisions, I get a second opinion. Then I break the work into the smallest shippable increments and validate each step before going deeper.`,
      },
      {
        label: 'Debugging & Performance',
        order: 4,
        textContent: `For debugging: reproduce first, isolate second, fix third. I use the scientific method — one variable at a time. For performance: measure before optimizing, profile before guessing, and fix the bottleneck that matters to users not the one that's intellectually interesting.`,
      },
    ],
  },
  {
    category: 'technical',
    title: 'Tech Stack & Experience',
    questionPrompt: 'Walk me through your technical background',
    summary:
      'Senior frontend engineer: React, Next.js, TypeScript, design systems — with depth in complex UI state and performance.',
    subsections: [
      {
        label: 'Core Stack',
        order: 0,
        textContent: `Primary stack: React, TypeScript, Next.js (App Router), Node.js. Deep experience with complex client-side state (custom state machines, form wizards, async data dependencies). Comfortable across the full frontend stack: CSS/Tailwind, accessibility, testing (Vitest, React Testing Library, Playwright), CI/CD, and API integration.`,
      },
      {
        label: 'Design Systems',
        order: 1,
        textContent: `Strong design systems experience — building and maintaining component libraries with semantic tokens, documentation, and consistent patterns. I think in systems: tokens, primitives, compositions. I've built wizards, data tables, modals, and form patterns that scale across products without one-off hacks.`,
      },
      {
        label: 'Architecture Philosophy',
        order: 2,
        textContent: `I favor colocation, explicit data flow, and separation of business logic from rendering. State machines for complex flows. Server components where they reduce client bundle and improve performance. I reach for established patterns before inventing new ones, but I'm not afraid to build custom solutions when the problem genuinely requires it.`,
      },
      {
        label: 'Growth Areas',
        order: 3,
        textContent: `Currently deepening: AI/LLM integration patterns (prompt engineering, structured outputs, tool use), advanced Next.js caching strategies, and backend-for-frontend patterns. Always learning — the frontend ecosystem moves fast and I stay current through building, not just reading.`,
      },
    ],
  },
];
