import type { DesignSection } from '@/data/types';

export const STANDARD_SECTIONS: DesignSection[] = [
  {
    id: 'components',
    label: '1. Components & Services',
    prompt: 'List and describe the main components, services, and their responsibilities.',
    placeholder: `e.g.,
- Client (Web/Mobile): Sends requests, renders UI
- API Gateway: Routes requests, handles auth
- Feed Service: Generates personalized feeds
- Post Service: Handles CRUD for posts
- Media Service: Handles image/video uploads
- Cache Layer (Redis): Stores hot feed data
- Message Queue (Kafka): Decouples async operations
- Database (PostgreSQL): Stores user and post data`,
    scoringCriteria:
      'Identifies all critical components, correctly describes each responsibility, recognizes the need for separation of concerns',
    spokenPrompt:
      'Walk me through the main components and services you would build for this system.',
  },
  {
    id: 'dataFlow',
    label: '2. Data Flow',
    prompt: 'Describe how data moves through the system for the primary use cases.',
    placeholder: `e.g.,
User posts a photo:
1. Client sends POST /posts with image to API Gateway
2. API Gateway authenticates and routes to Post Service
3. Post Service stores metadata in PostgreSQL
4. Image uploaded to S3 via Media Service
5. Kafka event published: post.created
6. Feed Service consumes event, updates follower feeds in Redis`,
    scoringCriteria:
      'Correctly traces data flow for key operations, identifies async vs sync paths, shows awareness of bottlenecks',
    spokenPrompt:
      'Walk me through how data flows through the system. Pick one of the main user actions and trace it end to end.',
  },
  {
    id: 'tradeoffs',
    label: '3. Trade-offs & Decisions',
    prompt: 'What are the key architectural decisions you made and why? What did you trade off?',
    placeholder: `e.g.,
Decision: SQL over NoSQL for post data
Why: Posts have relationships (user, comments, likes) that benefit from joins
Trade-off: Less horizontal write scalability, mitigated by read replicas

Decision: Redis for feed cache
Why: Feeds are read-heavy; pre-computing is faster than aggregating at query time
Trade-off: Storage cost, cache invalidation complexity on follows/unfollows`,
    scoringCriteria:
      'Demonstrates awareness of trade-offs, justifies decisions with reasoning, shows knowledge of CAP theorem implications',
    spokenPrompt:
      'Tell me about the key architectural decisions you made and what you traded off to get there.',
  },
  {
    id: 'scaling',
    label: '4. Scaling Strategy',
    prompt: 'How does this system scale to 10x, 100x current load? What breaks first?',
    placeholder: `e.g.,
Bottleneck at 10x: Feed generation becomes slow as follower counts grow
Fix: Pre-compute feeds asynchronously, limit feed depth to last 1000 posts

Bottleneck at 100x: Single PostgreSQL write primary
Fix: Shard by user_id, add read replicas for each shard

CDN: Serve static media from edge (CloudFront)
Rate limiting: Prevent write storms from viral content`,
    scoringCriteria:
      'Correctly identifies scaling bottlenecks, proposes realistic solutions, shows understanding of horizontal vs vertical scaling',
    spokenPrompt:
      'How does this system handle 10 times the load? What breaks first and how do you fix it?',
  },
];

export const ENCODING_SECTION: DesignSection = {
  id: 'encoding',
  label: '5. Encoding Strategy',
  prompt: 'How do you generate unique short codes? Walk through your encoding approach.',
  placeholder:
    'e.g., Base62 encoding of auto-incremented ID, MD5 hash + first 6 chars...',
  scoringCriteria:
    'Understands hash collisions, base62 encoding, trade-offs between random vs sequential IDs',
  spokenPrompt: 'How would you generate the short codes? Walk me through the encoding strategy.',
};

/** Build sample answers for standard sections from a topic summary. */
export function buildSampleAnswers(
  topic: string,
  extra?: Record<string, string>
): Record<string, string> {
  return {
    components: `Reference: ${topic} — identify clients, API layer, core services, cache, queue, and durable storage with clear ownership.`,
    dataFlow: `Reference: ${topic} — trace the primary read and write paths end-to-end, noting sync vs async steps.`,
    tradeoffs: `Reference: ${topic} — justify SQL vs NoSQL, cache vs recompute, and consistency vs availability choices.`,
    scaling: `Reference: ${topic} — name the first bottleneck at 10x load and a concrete fix (sharding, replicas, CDN, pre-compute).`,
    ...extra,
  };
}
