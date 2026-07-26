import type { SystemDesignChallenge } from '@/data/types';
import {
  buildSampleAnswers,
  ENCODING_SECTION,
  STANDARD_SECTIONS,
} from './sections';

export const systemDesignChallenges: SystemDesignChallenge[] = [
  {
    id: 'sd-01-url-shortener',
    title: 'Design a URL Shortener',
    difficulty: 'intermediate',
    mostAsked: true,
    mostAskedReason: 'Classic system design warmup — asked at virtually every company.',
    category: 'systems-design',
    estimatedMinutes: 25,
    scenario: `Design a URL shortening service like bit.ly or tinyurl.com.

**Scale requirements:**
- 100 million URLs shortened per day
- 10:1 read-to-write ratio (1 billion reads/day)
- URLs should never expire (store indefinitely)
- Custom aliases should be supported
- Analytics: click count per URL`,
    constraints: ['99.9% availability', 'Shortened URLs respond in < 100ms', 'No duplicate short codes'],
    sections: [...STANDARD_SECTIONS, ENCODING_SECTION],
    sampleAnswer: buildSampleAnswers('URL shortener', {
      encoding:
        'Use a distributed ID generator (Snowflake) + Base62 encode for short codes; custom aliases stored in a separate namespace with uniqueness constraint.',
    }),
    followUpQuestions: [
      'What happens if two users try to shorten the same URL at the same time?',
      'How do you handle custom aliases that are already taken?',
      'Your analytics database is getting slow. What do you do?',
      'How would you implement URL expiration without scanning the entire database?',
      'Walk me through what happens when someone clicks a short URL. Every step.',
    ],
    relatedLessonIds: ['lesson-be-postgres-pg', 'lesson-be-memoization'],
    externalResources: [
      {
        label: 'System Design Primer — URL Shortener',
        url: 'https://github.com/donnemartin/system-design-primer#design-pastebin-or-bitly',
      },
      { label: 'Base62 Encoding Explained', url: 'https://en.wikipedia.org/wiki/Base62' },
    ],
  },
  {
    id: 'sd-02-news-feed',
    title: 'Design a Social Media News Feed',
    difficulty: 'advanced',
    mostAsked: true,
    mostAskedReason:
      'Facebook, Twitter, Instagram — feed design is one of the most common system design questions.',
    category: 'systems-design',
    estimatedMinutes: 35,
    scenario: `Design the news feed system for a social media platform similar to Instagram or Twitter.

**Scale requirements:**
- 500 million daily active users
- Average user follows 200 accounts
- 5 million posts created per day
- Feed must show posts from followed accounts, ranked by recency and relevance
- Celebrity accounts may have 50 million followers`,
    constraints: ['Feed loads in < 200ms', 'Eventually consistent is acceptable', 'Support infinite scroll'],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('News feed with fan-out on write/read hybrid'),
    followUpQuestions: [
      'How do you handle the "celebrity problem" — a user with 50 million followers posts?',
      'What is the fan-out problem and how do you solve it?',
      'How do you rank posts — is it purely chronological?',
      'A user unfollows someone. How quickly should their posts disappear from the feed?',
      'How would you implement the "seen" state so posts don\'t repeat on infinite scroll?',
    ],
    relatedLessonIds: ['lesson-be-pub-sub', 'lesson-be-async-promises'],
    externalResources: [
      {
        label: 'Designing Instagram — High Scalability',
        url: 'http://highscalability.com/blog/2022/1/11/designing-instagram.html',
      },
      {
        label: "Twitter's Feed Architecture",
        url: 'https://blog.twitter.com/engineering/en_us/topics/infrastructure/2017/the-infrastructure-behind-twitter-scale',
      },
    ],
  },
  {
    id: 'sd-03-rate-limiter',
    title: 'Design a Rate Limiter',
    difficulty: 'intermediate',
    mostAsked: true,
    mostAskedReason: 'Rate limiting is asked at Stripe, Cloudflare, API-first companies. Very common.',
    category: 'systems-design',
    estimatedMinutes: 20,
    scenario: `Design a rate limiter that can be used as middleware for a REST API.

**Requirements:**
- Limit requests per user, per IP, and per API key
- Support multiple algorithms (token bucket, sliding window)
- Distributed — works across multiple API server instances
- Rate limit headers returned on every response (X-RateLimit-Remaining, X-RateLimit-Reset)
- Hard limit: 1000 requests per hour per API key`,
    constraints: [
      '< 5ms overhead per request',
      'Correct behavior across distributed servers',
      'Graceful handling of Redis failure',
    ],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Distributed rate limiter with Redis sliding window'),
    followUpQuestions: [
      'What is the difference between token bucket and sliding window algorithms?',
      'Your Redis instance goes down. What happens to your rate limiter?',
      'How do you prevent a "thundering herd" when rate limits reset at the same second?',
      "A customer says they're being rate limited but shouldn't be. How do you debug it?",
      'How would you implement per-endpoint rate limits (stricter for expensive operations)?',
    ],
    relatedLessonIds: ['lesson-be-middleware', 'lesson-be-memoization'],
    externalResources: [
      {
        label: 'Rate Limiting Algorithms Compared',
        url: 'https://blog.cloudflare.com/counting-things-a-lot-of-different-things/',
      },
      { label: 'Redis Rate Limiting Patterns', url: 'https://redis.io/glossary/rate-limiting/' },
    ],
  },
  {
    id: 'sd-04-autocomplete',
    title: 'Design a Search Autocomplete System',
    difficulty: 'advanced',
    mostAsked: true,
    mostAskedReason: 'Google, Amazon, and most search-heavy companies ask autocomplete design.',
    category: 'systems-design',
    estimatedMinutes: 30,
    scenario: `Design the autocomplete/typeahead feature for a search engine like Google.

**Requirements:**
- Suggestions appear as the user types, within 100ms
- Top 5-10 suggestions based on popularity and relevance
- Suggestions personalized to the user's search history
- Handles 10 billion searches per day
- Updates to suggestion rankings within 1 hour of trending`,
    constraints: ['< 100ms response time globally', 'Handles 100,000 QPS at peak'],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Autocomplete with trie + popularity ranking service'),
    followUpQuestions: [
      'How do you store the trie data structure at this scale?',
      'What happens when a term starts trending suddenly (breaking news)?',
      'How do you filter out offensive or inappropriate suggestions?',
      'How do you handle multiple languages and character sets?',
      'The personalization service is slow. How do you degrade gracefully?',
    ],
    relatedLessonIds: ['lesson-fe-autocomplete', 'lesson-be-memoization'],
    externalResources: [
      {
        label: 'Designing Typeahead Suggestion — Educative',
        url: 'https://www.educative.io/courses/grokking-the-system-design-interview/typeahead-suggestion',
      },
    ],
  },
  {
    id: 'sd-05-cdn',
    title: 'Design a Content Delivery Network (CDN)',
    difficulty: 'advanced',
    mostAsked: false,
    category: 'systems-design',
    estimatedMinutes: 35,
    scenario: `Design a simplified CDN for serving static assets (images, CSS, JS) globally.

**Requirements:**
- Serve assets from the edge location closest to the user
- Cache assets at edge nodes with configurable TTL
- Origin pull when cache miss
- Cache invalidation within 60 seconds globally
- Support for custom domains`,
    constraints: ['< 50ms response time globally', '99.99% availability'],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Global CDN with edge PoPs and origin pull'),
    followUpQuestions: [
      'How do you route users to the nearest edge node?',
      'A customer deploys a bad JS file. How quickly can they purge it from all edge nodes?',
      "How do you handle the thundering herd when a popular asset's cache expires?",
      'How do you differentiate cached content for logged-in vs anonymous users?',
    ],
    relatedLessonIds: ['lesson-nj-performance'],
    externalResources: [
      {
        label: 'How CDNs Work — Cloudflare',
        url: 'https://www.cloudflare.com/learning/cdn/what-is-a-cdn/',
      },
    ],
  },
  {
    id: 'sd-06-chat-system',
    title: 'Design a Real-Time Chat System',
    difficulty: 'advanced',
    mostAsked: true,
    mostAskedReason: 'WhatsApp, Slack, Discord — chat system design is a top-5 most asked question.',
    category: 'systems-design',
    estimatedMinutes: 35,
    scenario: `Design a real-time messaging system like Slack or WhatsApp.

**Requirements:**
- 1-on-1 and group messaging (up to 1000 members per group)
- Message delivery receipts (sent, delivered, read)
- Online presence indicators
- Message history searchable
- Push notifications when offline
- 50 million daily active users`,
    constraints: [
      'Messages delivered in < 500ms',
      'No message loss',
      'End-to-end encryption optional but considered',
    ],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Real-time chat with WebSockets and message store'),
    followUpQuestions: [
      'WebSockets vs Server-Sent Events vs Long Polling — which do you use and why?',
      'How do you handle a user who is offline when a message is sent?',
      'How do you implement message ordering in a distributed system?',
      'Your WebSocket server goes down. How do you reconnect 10 million connections without crashing everything?',
      'How would you implement end-to-end encryption without storing keys on the server?',
    ],
    relatedLessonIds: ['lesson-fe-sse', 'lesson-be-pub-sub'],
    externalResources: [
      {
        label: 'Designing WhatsApp — High Scalability',
        url: 'http://highscalability.com/blog/2022/1/3/designing-whatsapp.html',
      },
    ],
  },
  {
    id: 'sd-07-distributed-cache',
    title: 'Design a Distributed Cache',
    difficulty: 'advanced',
    mostAsked: false,
    category: 'systems-design',
    estimatedMinutes: 30,
    scenario: `Design a distributed caching system like Redis Cluster or Memcached.

**Requirements:**
- Key-value store with O(1) get/set
- Supports TTL (time-to-live) per key
- Distributed across multiple nodes
- Consistent hashing for key distribution
- Handles node failures gracefully
- Eviction policies (LRU, LFU)`,
    constraints: ['< 1ms read latency', 'Data loss acceptable on node failure (cache, not primary store)'],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Distributed cache with consistent hashing'),
    followUpQuestions: [
      'What is consistent hashing and why use it over modulo hashing?',
      'A cache node goes down. How do you redistribute its keys?',
      'What is a cache stampede and how do you prevent it?',
      'How do you implement LRU eviction efficiently?',
    ],
    relatedLessonIds: ['lesson-be-memoization'],
    externalResources: [
      {
        label: 'Consistent Hashing Explained',
        url: 'https://www.toptal.com/big-data/consistent-hashing',
      },
    ],
  },
  {
    id: 'sd-08-notification-system',
    title: 'Design a Push Notification System',
    difficulty: 'intermediate',
    mostAsked: false,
    category: 'systems-design',
    estimatedMinutes: 25,
    scenario: `Design a notification system that sends push notifications, emails, and SMS at scale.

**Requirements:**
- Multiple channels: push, email, SMS, in-app
- User notification preferences (opt-out per channel per type)
- Delivery tracking and receipts
- Rate limiting per user (max 5 push notifications per hour)
- 10 million notifications per day`,
    constraints: ['Notifications delivered within 30 seconds', 'No duplicate notifications'],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Multi-channel notification pipeline with preferences'),
    followUpQuestions: [
      'How do you guarantee a notification is delivered exactly once?',
      'A user has notifications disabled for marketing but enabled for security alerts. How do you model this?',
      "Your email provider's API is down. How do you handle retries without spamming the user later?",
    ],
    relatedLessonIds: ['lesson-be-pub-sub', 'lesson-be-async-promises'],
    externalResources: [
      {
        label: 'Designing a Notification System — ByteByteGo',
        url: 'https://bytebytego.com/courses/system-design-interview/design-a-notification-system',
      },
    ],
  },
  {
    id: 'sd-09-api-gateway',
    title: 'Design an API Gateway',
    difficulty: 'advanced',
    mostAsked: false,
    category: 'systems-design',
    estimatedMinutes: 30,
    scenario: `Design an API Gateway for a microservices architecture.

**Requirements:**
- Routes requests to the correct downstream service
- Authentication and authorization at the gateway level
- Rate limiting per API key
- Request/response transformation
- Circuit breaker for failing downstream services
- API versioning support`,
    constraints: ['< 10ms gateway overhead', '99.99% availability'],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('API gateway with auth, rate limits, and circuit breakers'),
    followUpQuestions: [
      'What is a circuit breaker and when does it trip?',
      'How do you handle a downstream service that is slow but not failing?',
      'How do you implement backward-compatible API versioning?',
      'Your gateway is a single point of failure. How do you make it highly available?',
    ],
    relatedLessonIds: ['lesson-be-middleware', 'lesson-be-error-handling'],
    externalResources: [
      {
        label: 'API Gateway Pattern — Microsoft',
        url: 'https://docs.microsoft.com/en-us/azure/architecture/microservices/design/gateway',
      },
    ],
  },
  {
    id: 'sd-10-search-engine',
    title: 'Design a Web Crawler and Search Index',
    difficulty: 'advanced',
    mostAsked: false,
    category: 'systems-design',
    estimatedMinutes: 40,
    scenario: `Design a web crawler and search indexing system (simplified Google).

**Requirements:**
- Crawl 1 billion web pages
- Index page content for full-text search
- Rank pages by relevance and authority (simplified PageRank)
- Handle duplicate content, redirects, and robot.txt
- Re-crawl pages periodically based on update frequency`,
    constraints: ['Index fresh within 24 hours of publishing', 'Politeness delays between requests to same domain'],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Web crawler with inverted index and PageRank'),
    followUpQuestions: [
      'How do you avoid crawling the same page twice?',
      'A website blocks your crawler. What do you do?',
      'How do you prioritize which pages to crawl first?',
      'How does an inverted index work?',
    ],
    relatedLessonIds: ['lesson-be-async-promises', 'lesson-be-stream-pipe'],
    externalResources: [
      {
        label: 'Designing a Web Crawler — Educative',
        url: 'https://www.educative.io/courses/grokking-the-system-design-interview/design-a-web-crawler',
      },
    ],
  },
  {
    id: 'sd-11-frontend-architecture',
    title: 'Design a Large-Scale Frontend Architecture',
    difficulty: 'advanced',
    mostAsked: true,
    mostAskedReason: 'Senior FE-specific system design — how you structure a large React/Next.js app.',
    category: 'systems-design',
    estimatedMinutes: 30,
    scenario: `Design the frontend architecture for a large e-commerce platform (think Amazon or Shopify) with:

**Requirements:**
- 50+ engineering teams working on the same product
- Multiple product surfaces (storefront, seller dashboard, admin panel)
- Shared component library used across all surfaces
- Independent deployability per team
- Performance: LCP < 2.5s, CLS < 0.1
- A/B testing capability`,
    constraints: [
      "No single team can break another team's surface",
      'Shared components update without requiring all teams to redeploy',
    ],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Micro-frontends with module federation and design system'),
    followUpQuestions: [
      "How do you prevent one team's bad deploy from taking down another team's surface?",
      'How do you share a component library without forcing all consumers to update at once?',
      'How do you run an A/B test that affects both the frontend and backend?',
      'A designer wants to change the button component. How do you roll that out safely?',
      'How do you enforce consistent performance budgets across 50 teams?',
    ],
    relatedLessonIds: ['lesson-nj-performance', 'lesson-fea-micro-frontend'],
    externalResources: [
      {
        label: 'Micro Frontends — Martin Fowler',
        url: 'https://martinfowler.com/articles/micro-frontends.html',
      },
      { label: 'Module Federation Guide', url: 'https://webpack.js.org/concepts/module-federation/' },
    ],
  },
  {
    id: 'sd-12-state-management',
    title: 'Design a State Management Architecture',
    difficulty: 'intermediate',
    mostAsked: true,
    mostAskedReason: 'Directly relevant to senior FE roles — how you think about app-wide state.',
    category: 'systems-design',
    estimatedMinutes: 25,
    scenario: `Design the state management architecture for a complex React application — a project management tool like Linear or Jira.

**Requirements:**
- Real-time updates from other users (WebSocket)
- Optimistic updates for all mutations
- Offline support with sync on reconnect
- Complex filtering and sorting on large datasets (10,000+ items)
- Undo/redo for destructive actions
- URL-driven state (filters, selected items)`,
    constraints: [
      'UI stays responsive with 10,000 items in state',
      'No stale data after reconnecting from offline',
    ],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('React Query + normalized store + WebSocket sync'),
    followUpQuestions: [
      'When would you use Redux vs Zustand vs React Query vs Context?',
      'How do you implement undo/redo without storing the entire state history?',
      'Two users edit the same item simultaneously. How do you handle the conflict?',
      'Your WebSocket disconnects for 30 seconds. How do you sync the missed updates?',
      'How do you keep 10,000 items performant in React without virtualizing everything?',
    ],
    relatedLessonIds: ['lesson-fe-context-api', 'lesson-fe-performance-optimization'],
    externalResources: [
      {
        label: 'State Management in 2024',
        url: 'https://tkdodo.eu/blog/react-query-as-a-state-manager',
      },
    ],
  },
  {
    id: 'sd-13-design-system',
    title: 'Design a Component Design System',
    difficulty: 'intermediate',
    mostAsked: true,
    mostAskedReason: 'Very commonly asked at companies with large design teams (Airbnb, Shopify, etc.).',
    category: 'systems-design',
    estimatedMinutes: 25,
    scenario: `Design a component design system and library for a company with 200 engineers across 20 product teams.

**Requirements:**
- Shared components (buttons, forms, modals, tables) used by all teams
- Design tokens (colors, spacing, typography) as the single source of truth
- Versioned releases — teams can stay on old versions
- Accessibility: all components WCAG 2.1 AA compliant
- Documentation site with live examples
- TypeScript support with full type safety`,
    constraints: [
      'Teams cannot be blocked from shipping by design system updates',
      'Breaking changes require major version bump',
    ],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Versioned design system with tokens and Storybook docs'),
    followUpQuestions: [
      "A product team needs a custom variant of a button that doesn't exist in the design system. What do they do?",
      'How do you enforce that teams are using the design system and not rolling their own?',
      'How do you release a breaking change to a component that 20 teams depend on?',
      'How do you test that all components remain accessible after changes?',
      'The design team wants to do a full rebrand. How do you roll out new tokens?',
    ],
    relatedLessonIds: ['lesson-fea-design-tokens', 'lesson-fea-accessibility-audit'],
    externalResources: [
      {
        label: 'Building a Design System — Brad Frost',
        url: 'https://bradfrost.com/blog/post/atomic-web-design/',
      },
      { label: 'Shopify Polaris Design System', url: 'https://polaris.shopify.com/' },
    ],
  },
  {
    id: 'sd-14-cicd-pipeline',
    title: 'Design a CI/CD Pipeline for a Frontend App',
    difficulty: 'intermediate',
    mostAsked: false,
    category: 'systems-design',
    estimatedMinutes: 20,
    scenario: `Design the complete CI/CD pipeline for a large Next.js application deployed to Vercel with 50 engineers.

**Requirements:**
- Automated tests on every pull request
- Preview deployments for every PR
- Staged rollout to production (10% → 50% → 100%)
- Automatic rollback if error rate spikes
- Feature flags for gradual feature releases
- Performance budgets enforced in CI`,
    constraints: ['PR feedback in < 5 minutes', 'Production deploys in < 10 minutes'],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Next.js CI/CD on Vercel with staged rollouts and feature flags'),
    followUpQuestions: [
      'How do you enforce that no PR can merge with failing tests?',
      'What metrics do you watch during a staged rollout?',
      'A deploy causes a spike in JS errors. How does the automatic rollback trigger?',
      'How do you test a feature flag combination without deploying to production?',
    ],
    relatedLessonIds: ['lesson-nj-testing', 'lesson-nj-deployment-config'],
    externalResources: [
      {
        label: 'Vercel Deployment Architecture',
        url: 'https://vercel.com/docs/deployments/overview',
      },
    ],
  },
  {
    id: 'sd-15-realtime-collaboration',
    title: 'Design Real-Time Collaborative Editing',
    difficulty: 'advanced',
    mostAsked: false,
    category: 'systems-design',
    estimatedMinutes: 40,
    scenario: `Design a real-time collaborative document editor like Google Docs or Notion.

**Requirements:**
- Multiple users editing the same document simultaneously
- Changes appear in real time for all collaborators
- Conflict resolution when two users edit the same location
- Offline editing with sync on reconnect
- Cursor presence (see where other users are)
- Document version history`,
    constraints: ['Convergence: all clients reach the same state eventually', 'No data loss on conflict'],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Collaborative editor with CRDT/OT and presence service'),
    followUpQuestions: [
      'What is Operational Transformation? What is a CRDT? When do you use each?',
      'User A and User B both delete the same word simultaneously. What happens?',
      "How do you show another user's cursor position in real time?",
      'A user is offline for 2 hours and made 50 edits. How do you sync?',
    ],
    relatedLessonIds: ['lesson-fea-real-time-collab'],
    externalResources: [
      {
        label: 'CRDTs: The Hard Parts — Martin Kleppmann',
        url: 'https://www.youtube.com/watch?v=x7drE24geUw',
      },
    ],
  },
  {
    id: 'sd-16-payment-system',
    title: 'Design a Payment Processing System',
    difficulty: 'advanced',
    mostAsked: true,
    mostAskedReason: 'Fintech and e-commerce roles almost always include payment system design.',
    category: 'systems-design',
    estimatedMinutes: 35,
    scenario: `Design a payment processing system for an e-commerce platform.

**Requirements:**
- Process credit card payments via Stripe
- Support multiple currencies
- Idempotent payment operations (no double charges)
- Payment retry logic with exponential backoff
- Refund and dispute handling
- PCI compliance considerations
- Webhook handling for async payment events`,
    constraints: ['Zero double charges — ever', 'Payment records immutable after creation'],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Payment system with idempotency keys and webhook reconciliation'),
    followUpQuestions: [
      'What is idempotency and why is it critical for payments?',
      'Stripe sends a webhook. Your server is down. What happens?',
      'How do you prevent a network timeout from causing a double charge?',
      'A customer disputes a charge. Walk me through what happens in your system.',
      'How do you store payment data to remain PCI compliant?',
    ],
    relatedLessonIds: ['lesson-be-jwt', 'lesson-be-error-handling'],
    externalResources: [
      {
        label: 'Stripe Idempotency Keys',
        url: 'https://stripe.com/docs/api/idempotent_requests',
      },
    ],
  },
  {
    id: 'sd-17-video-streaming',
    title: 'Design a Video Streaming Platform',
    difficulty: 'advanced',
    mostAsked: false,
    category: 'systems-design',
    estimatedMinutes: 40,
    scenario: `Design a video streaming service like YouTube or Netflix.

**Requirements:**
- Video upload, processing, and storage
- Adaptive bitrate streaming (quality adjusts to bandwidth)
- Global delivery via CDN
- Recommendations based on watch history
- Live streaming support
- 1 billion videos watched per day`,
    constraints: [
      'Buffering < 2 seconds on initial load',
      'Video available for streaming within 5 minutes of upload',
    ],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Video platform with transcoding pipeline and ABR streaming'),
    followUpQuestions: [
      'What is adaptive bitrate streaming and how does it work technically?',
      'A video goes viral and gets 1 million concurrent viewers. What happens to your CDN?',
      'How do you transcode a 4K video into multiple resolutions at upload time?',
      'How do you implement the "skip intro" feature?',
    ],
    relatedLessonIds: ['lesson-be-stream-pipe', 'lesson-be-worker-threads'],
    externalResources: [
      {
        label: 'How Netflix Works — High Scalability',
        url: 'http://highscalability.com/netflix-architecture',
      },
    ],
  },
  {
    id: 'sd-18-monitoring-observability',
    title: 'Design a Frontend Observability System',
    difficulty: 'intermediate',
    mostAsked: false,
    category: 'systems-design',
    estimatedMinutes: 25,
    scenario: `Design a frontend observability and monitoring system for a large web application.

**Requirements:**
- Capture JavaScript errors in production with stack traces
- Track Core Web Vitals (LCP, CLS, INP) per page
- User session recording (anonymized)
- Performance anomaly detection (alert if LCP degrades)
- Distributed tracing from frontend request to backend response
- 100 million page views per day`,
    constraints: ['< 5KB SDK bundle size', 'Sampling: capture 100% of errors, 10% of sessions'],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Frontend observability SDK with RUM and error tracking'),
    followUpQuestions: [
      'How do you capture errors that happen before your SDK loads?',
      'A performance regression is introduced. How quickly do you detect it?',
      'How do you correlate a frontend error with the backend request that caused it?',
      "A user reports a bug you can't reproduce. How does session recording help?",
    ],
    relatedLessonIds: ['lesson-fea-observability'],
    externalResources: [{ label: 'Web Vitals — web.dev', url: 'https://web.dev/vitals/' }],
  },
  {
    id: 'sd-19-access-control',
    title: 'Design a Role-Based Access Control System',
    difficulty: 'intermediate',
    mostAsked: false,
    category: 'systems-design',
    estimatedMinutes: 25,
    scenario: `Design an RBAC (Role-Based Access Control) system for a SaaS application.

**Requirements:**
- Users have roles (admin, editor, viewer, guest)
- Roles have permissions (read, write, delete per resource type)
- Custom roles per organization (multi-tenant)
- Permission checks at the API level — not just UI
- Audit log of all permission checks
- Role changes take effect within 30 seconds`,
    constraints: ['Permission check < 5ms', 'No permission escalation vulnerabilities'],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Multi-tenant RBAC with cached permission checks'),
    followUpQuestions: [
      'How do you prevent a user from elevating their own permissions?',
      "A user's role is changed. How quickly does it take effect on active sessions?",
      'How do you model "a user can edit their own posts but not others"?',
      'How do you audit who changed which permission and when?',
    ],
    relatedLessonIds: ['lesson-nj-auth-patterns', 'lesson-be-jwt'],
    externalResources: [
      {
        label: 'RBAC vs ABAC',
        url: 'https://www.okta.com/identity-101/role-based-access-control-vs-attribute-based-access-control/',
      },
    ],
  },
  {
    id: 'sd-20-offline-first-app',
    title: 'Design an Offline-First Web Application',
    difficulty: 'advanced',
    mostAsked: false,
    category: 'systems-design',
    estimatedMinutes: 30,
    scenario: `Design an offline-first Progressive Web App (PWA) — a field service app used by technicians in areas with unreliable connectivity.

**Requirements:**
- Full functionality without internet connection
- Sync changes when connection is restored
- Conflict resolution when the same record is edited offline by two technicians
- Background sync for pending operations
- Works on low-end Android devices
- Push notifications when a new job is assigned`,
    constraints: ['App loads in < 3s on 3G', 'No data loss if connection drops mid-operation'],
    sections: STANDARD_SECTIONS,
    sampleAnswer: buildSampleAnswers('Offline-first PWA with service worker and sync queue'),
    followUpQuestions: [
      'Two technicians update the same work order while offline. How do you resolve the conflict?',
      'How do you implement background sync without the user having to open the app?',
      "The app has 50MB of cached data. The user's device is almost full. What do you do?",
      'How do you tell the user which of their actions are pending sync?',
    ],
    relatedLessonIds: ['lesson-fea-offline-first'],
    externalResources: [
      { label: 'Offline First Web Development', url: 'https://offlinefirst.org/' },
      {
        label: 'Service Worker API — MDN',
        url: 'https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API',
      },
    ],
  },
];

export function getSystemDesignChallengeById(id: string): SystemDesignChallenge | undefined {
  return systemDesignChallenges.find((c) => c.id === id);
}
