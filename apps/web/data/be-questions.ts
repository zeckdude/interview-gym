import type { ConceptualQuestion } from './types';

export const beQuestions: ConceptualQuestion[] = [
  {
    id: 'be-q-01',
    category: 'be-question',
    question: 'Explain the Node.js event loop and how it enables non-blocking I/O.',
    difficulty: 'intermediate',
    concepts: ['event loop', 'Node.js', 'non-blocking I/O', 'concurrency'],
    modelAnswer: `The Node.js event loop is a single-threaded mechanism that allows Node to perform non-blocking I/O operations by offloading them to the operating system via libuv. When an async operation (like reading a file or making an HTTP request) is initiated, Node delegates it to the OS and moves on. When the OS signals completion, the callback is placed on the event queue and executed when the call stack is empty.

The event loop has multiple phases: timers (setTimeout/setInterval), pending callbacks, idle/prepare, poll (waiting for I/O events), check (setImmediate), and close callbacks. The poll phase is where Node waits for I/O — if no callbacks are queued, it blocks until a timer fires.

This design means a single Node process can handle thousands of concurrent connections without creating OS threads, which would be far more expensive. The tradeoff is that CPU-intensive operations block the entire event loop and must be offloaded to Worker Threads.`,
    keyTerms: ['event loop', 'single-threaded', 'non-blocking', 'libuv', 'callback', 'async', 'poll phase', 'setTimeout', 'setImmediate'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-02',
    category: 'be-question',
    question: 'What is the difference between process.nextTick(), setImmediate(), and setTimeout(fn, 0) in Node.js?',
    difficulty: 'intermediate',
    concepts: ['event loop phases', 'microtasks', 'macrotasks', 'Node.js'],
    modelAnswer: `These three schedule deferred execution but at different points in the event loop:

**process.nextTick()** runs before the event loop continues to the next phase — it fires after the current operation completes but before any I/O events. It is processed in the "microtask queue" along with Promise callbacks. Multiple nextTick calls drain completely before moving on, which can starve the event loop.

**setImmediate()** runs in the "check" phase — after the poll phase completes. It is always executed after I/O events in the current event loop iteration.

**setTimeout(fn, 0)** runs in the "timers" phase on the next event loop iteration. Due to OS-level timing imprecision, there's no guarantee it fires before setImmediate when both are called from the main module.

Order: nextTick → Promise microtasks → setImmediate (in check phase) → setTimeout (in timers phase).`,
    keyTerms: ['nextTick', 'setImmediate', 'setTimeout', 'microtask', 'event loop', 'phases', 'timers phase', 'check phase'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-03',
    category: 'be-question',
    question: 'What are Node.js Streams and when would you use them over loading data into memory?',
    difficulty: 'intermediate',
    concepts: ['streams', 'backpressure', 'memory', 'pipeline'],
    modelAnswer: `Node.js Streams are an abstraction for working with data incrementally rather than loading it all into memory at once. There are four types: Readable (data source), Writable (data sink), Duplex (both), and Transform (modify data in transit).

You should use streams when processing large files, responding to HTTP requests with large payloads, piping data between sources (like compressing files), or any situation where the data size could exceed available memory. Reading a 10GB CSV file into memory is impossible on a 4GB server — streaming it line by line is trivial.

The key benefit beyond memory efficiency is **backpressure**: if a writable stream can't consume data fast enough, the readable stream pauses automatically, preventing buffer overflow. Node's pipe() and pipeline() handle this automatically.

Use memory (non-streaming) when data must be processed as a whole (e.g., sorting, JSON parsing of the complete document), or when simplicity matters more than memory efficiency.`,
    keyTerms: ['streams', 'readable', 'writable', 'backpressure', 'pipe', 'memory', 'pipeline', 'incremental'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-04',
    category: 'be-question',
    question: 'Explain HTTP caching: what are Cache-Control, ETag, and Last-Modified headers and how do they work together?',
    difficulty: 'intermediate',
    concepts: ['HTTP caching', 'Cache-Control', 'ETag', 'conditional requests'],
    modelAnswer: `HTTP caching reduces bandwidth and latency by reusing previously fetched responses.

**Cache-Control** is the primary caching directive. Key values: \`max-age=N\` (fresh for N seconds), \`no-cache\` (revalidate before using), \`no-store\` (never cache), \`public\` (shared caches can store), \`private\` (browser-only). \`s-maxage\` overrides \`max-age\` for CDNs.

**ETag** is an opaque identifier for a specific version of a resource (typically a hash). When a cached response expires, the browser sends \`If-None-Match: <etag>\`. If the resource hasn't changed, the server returns 304 Not Modified with no body — saving bandwidth.

**Last-Modified** is a timestamp-based alternative to ETag. The browser sends \`If-Modified-Since\` and gets 304 if unchanged.

They work together: Cache-Control tells the browser HOW to cache and when the cache is fresh. When stale, ETag/Last-Modified enable conditional revalidation, avoiding a full re-download when the resource hasn't changed.`,
    keyTerms: ['Cache-Control', 'ETag', 'Last-Modified', '304', 'max-age', 'revalidation', 'conditional request', 'no-cache', 'stale'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-05',
    category: 'be-question',
    question: 'What is the difference between authentication and authorization? How do JWTs work?',
    difficulty: 'easy',
    concepts: ['authentication', 'authorization', 'JWT', 'security'],
    modelAnswer: `**Authentication** answers "who are you?" — verifying identity (login with username/password, Google OAuth, biometrics). **Authorization** answers "what are you allowed to do?" — verifying permissions after identity is established.

**JWTs (JSON Web Tokens)** are a stateless authentication mechanism. A JWT has three parts: Header (algorithm), Payload (claims like userId, roles, expiry), and Signature. The server signs the token with a secret key. The client stores the JWT and sends it in the \`Authorization: Bearer <token>\` header on subsequent requests.

Verification: the server re-signs the header+payload with its secret and compares to the signature. If they match, the token is authentic and hasn't been tampered with. No database lookup needed — that's the "stateless" benefit.

Downsides: JWTs can't be revoked before expiry without a blacklist (defeating statelessness). Keep expiry short (15 min) and use refresh tokens. Never store sensitive data in the payload — it's base64-encoded, not encrypted.`,
    keyTerms: ['authentication', 'authorization', 'JWT', 'stateless', 'signature', 'payload', 'bearer token', 'expiry', 'refresh token'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-06',
    category: 'be-question',
    question: 'What is REST and what makes an API truly RESTful? What are the key constraints?',
    difficulty: 'easy',
    concepts: ['REST', 'HTTP methods', 'stateless', 'HATEOAS', 'API design'],
    modelAnswer: `REST (Representational State Transfer) is an architectural style for distributed systems defined by Roy Fielding. A truly RESTful API satisfies six constraints:

1. **Client-server separation** — UI concerns separated from data storage concerns
2. **Stateless** — each request contains all information needed; no server-side session state
3. **Cacheable** — responses must declare whether they can be cached
4. **Uniform interface** — consistent resource identification (URLs), manipulation via representations, self-descriptive messages, and HATEOAS (hypermedia as the engine of application state)
5. **Layered system** — clients can't tell if they're talking to the origin server or a proxy
6. **Code on demand** (optional) — servers can send executable code

In practice: use nouns for URLs (/users/123), HTTP methods semantically (GET=read, POST=create, PUT=replace, PATCH=update, DELETE=remove), return appropriate status codes (201 Created, 204 No Content, 404 Not Found), and make it stateless. True HATEOAS (links to related actions in responses) is rarely implemented.`,
    keyTerms: ['REST', 'stateless', 'uniform interface', 'HTTP methods', 'resource', 'HATEOAS', 'cacheable', 'client-server'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-07',
    category: 'be-question',
    question: 'Explain database indexing. What types of indexes exist, and when would you add or avoid one?',
    difficulty: 'intermediate',
    concepts: ['indexes', 'B-tree', 'query performance', 'PostgreSQL', 'tradeoffs'],
    modelAnswer: `A database index is a separate data structure that enables fast lookups without scanning every row. The most common is a **B-tree index**, which stores column values in a balanced tree — enabling O(log n) lookups instead of O(n) full-table scans.

**Types:** B-tree (default, range queries and equality), Hash (equality only, faster), GIN (full-text search, arrays, JSONB), GiST (geometric data, full-text), BRIN (append-only tables with natural ordering like timestamps), Partial (indexes only rows matching a condition).

**When to add:** columns in WHERE clauses with high selectivity (many unique values), JOIN columns (foreign keys), ORDER BY columns in frequent sorts, columns used in range queries.

**When to avoid:** small tables (full scan is faster), columns with low selectivity (boolean — index not worth it), write-heavy tables (indexes slow INSERT/UPDATE/DELETE because the index must be maintained), and over-indexing (each index costs storage and write performance).

Always EXPLAIN ANALYZE a query before and after adding an index to verify the improvement.`,
    keyTerms: ['index', 'B-tree', 'selectivity', 'full-table scan', 'query performance', 'write overhead', 'EXPLAIN', 'partial index'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-08',
    category: 'be-question',
    question: 'What is the N+1 query problem and how do you solve it?',
    difficulty: 'easy',
    concepts: ['N+1', 'ORM', 'eager loading', 'query optimization'],
    modelAnswer: `The N+1 problem occurs when an application fetches N parent records and then makes one additional database query for each — resulting in N+1 total queries. Classic example: fetching 100 blog posts and then querying for each post's author separately results in 101 queries.

**Causes:** lazy loading in ORMs (Sequelize, Prisma, Hibernate). Accessing a relationship triggers a separate query per row.

**Solutions:**
1. **Eager loading / JOIN** — fetch all related data in one query using SQL JOINs. In Prisma: \`{ include: { author: true } }\`. In TypeORM: \`find({ relations: ['author'] })\`.
2. **DataLoader** (Node.js) — batches and deduplicates queries per event loop tick. Used heavily in GraphQL resolvers.
3. **SELECT N** — explicitly select only what you need, avoiding the relationship trigger.
4. **Raw SQL** — write a single JOIN query when ORM magic creates complexity.

Use query logging during development (or EXPLAIN) to spot N+1 patterns before they hit production.`,
    keyTerms: ['N+1', 'eager loading', 'lazy loading', 'JOIN', 'DataLoader', 'ORM', 'batch', 'query optimization'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-09',
    category: 'be-question',
    question: 'What is database connection pooling and why is it important in Node.js apps?',
    difficulty: 'easy',
    concepts: ['connection pooling', 'PostgreSQL', 'performance', 'Node.js'],
    modelAnswer: `A database connection is expensive to establish — it involves a TCP handshake, authentication, and session initialization, which can take 20-50ms or more. Connection pooling maintains a pool of pre-established connections that are reused across requests.

In Node.js, without a pool, every request would open and close a database connection, creating latency spikes and potentially overwhelming the database with connection overhead. PostgreSQL has a hard limit on concurrent connections (default 100), and without pooling, a spike of traffic could exhaust this limit.

A connection pool (like pg-pool for PostgreSQL, or PrismaClient's built-in pool) keeps a configurable number of connections open (typically 5-20). When a request needs the DB, it borrows a connection from the pool and returns it when done.

Key settings: \`max\` (maximum pool size), \`min\` (minimum idle connections), \`idleTimeoutMillis\` (close idle connections after N ms), \`connectionTimeoutMillis\` (fail fast if pool is exhausted). Tune pool size to your database's max_connections and expected concurrency.`,
    keyTerms: ['connection pool', 'reuse', 'overhead', 'max connections', 'idleTimeout', 'pg-pool', 'latency', 'concurrent'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-10',
    category: 'be-question',
    question: 'Explain ACID properties in databases and give a real-world example of why each matters.',
    difficulty: 'intermediate',
    concepts: ['ACID', 'transactions', 'atomicity', 'consistency', 'isolation', 'durability'],
    modelAnswer: `ACID is a set of properties that guarantee database transactions are processed reliably:

**Atomicity** — a transaction is all-or-nothing. Example: transferring $100 between accounts must debit one and credit the other. If the credit fails, the debit must be rolled back. Partial updates are never persisted.

**Consistency** — transactions bring the database from one valid state to another, respecting constraints. Example: a foreign key constraint ensures you can't insert an order without a valid customer_id. A consistent transaction would fail rather than violate this.

**Isolation** — concurrent transactions don't interfere with each other. Example: if two users buy the last item in inventory simultaneously, isolation ensures only one succeeds. Isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) trade performance for protection against anomalies like dirty reads and phantom reads.

**Durability** — once committed, data persists even after a crash. Achieved via write-ahead logging (WAL) — changes are written to a log before being applied to data files, enabling recovery.`,
    keyTerms: ['atomicity', 'consistency', 'isolation', 'durability', 'transaction', 'rollback', 'WAL', 'isolation level'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-11',
    category: 'be-question',
    question: 'What is rate limiting? Describe different strategies and when to use each.',
    difficulty: 'intermediate',
    concepts: ['rate limiting', 'token bucket', 'sliding window', 'fixed window', 'API protection'],
    modelAnswer: `Rate limiting restricts how many requests a client can make in a given timeframe, protecting servers from abuse, DDoS, and accidental overload.

**Fixed Window** — count requests per fixed interval (e.g., 100 req per minute). Simple to implement but vulnerable to burst attacks at window boundaries (100 req at 11:59 + 100 at 12:00 = 200 in 2 seconds).

**Sliding Window Log** — log timestamps of each request and count those within the last N seconds. Accurate but memory-intensive for high-traffic APIs.

**Sliding Window Counter** — hybrid: track counts for current and previous windows, interpolate based on elapsed time. Good balance of accuracy and efficiency.

**Token Bucket** — tokens replenish at a constant rate; each request consumes one token. Allows controlled bursting (up to bucket size) while enforcing an average rate. Smooth and flexible.

**Leaky Bucket** — requests enter a queue (bucket) and are processed at a fixed rate. Enforces a strict output rate with no bursting allowed.

For most APIs, sliding window or token bucket work well. Apply per-IP for anonymous traffic, per-userId for authenticated users. Store state in Redis for distributed systems.`,
    keyTerms: ['rate limiting', 'token bucket', 'sliding window', 'fixed window', 'leaky bucket', 'burst', 'Redis', 'per-IP'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-12',
    category: 'be-question',
    question: 'What is message queuing? When would you use a queue like RabbitMQ or Bull instead of synchronous API calls?',
    difficulty: 'intermediate',
    concepts: ['message queue', 'async processing', 'decoupling', 'Bull', 'RabbitMQ'],
    modelAnswer: `A message queue is a durable buffer that decouples producers (who create work) from consumers (who process it). Producers push jobs to the queue and return immediately; consumers process them asynchronously.

**Use a queue when:**
- Processing is slow (sending emails, generating reports, resizing images) and you don't want the user to wait
- You need resilience: if a consumer crashes, the job stays in the queue for retry
- You need to rate-limit processing (e.g., send 10 emails/second max)
- You need to fan-out work to multiple consumers
- Background processing (scheduled jobs, cleanup tasks)

**Don't use a queue when:**
- You need the result synchronously (use await instead)
- Simple, fast operations where the overhead isn't worth it
- Your team lacks the operational expertise to run a queue infrastructure

**Bull/BullMQ** (Redis-backed) is the standard for Node.js: easy setup, retry logic, rate limiting, delayed jobs, priority queues. **RabbitMQ** is better for complex routing, fan-out, or multi-language systems. **SQS** for serverless.`,
    keyTerms: ['message queue', 'async', 'producer', 'consumer', 'retry', 'decouple', 'Bull', 'Redis', 'background job'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-13',
    category: 'be-question',
    question: 'Explain the CAP theorem. What tradeoffs do distributed databases make?',
    difficulty: 'advanced',
    concepts: ['CAP theorem', 'consistency', 'availability', 'partition tolerance', 'distributed systems'],
    modelAnswer: `The CAP theorem states that a distributed data store can only guarantee two of three properties simultaneously:

**Consistency** — every read receives the most recent write or an error. All nodes see the same data at the same time.

**Availability** — every request receives a (possibly stale) response — not an error. The system is always operational.

**Partition Tolerance** — the system continues operating despite network partitions (nodes can't communicate). In real distributed systems, network partitions are inevitable, so you must choose between C and A when a partition occurs.

**CP systems** (PostgreSQL, HBase, Zookeeper) — when partitioned, return errors rather than stale data. Suitable for financial transactions, inventory.

**AP systems** (Cassandra, DynamoDB, CouchDB) — when partitioned, serve possibly stale data rather than refusing. Suitable for social feeds, DNS, shopping carts where eventual consistency is acceptable.

**CA systems** exist only in theory — you can't ignore partitions in distributed networks.

Modern systems blur this: Amazon DynamoDB offers configurable consistency per operation. The PACELC theorem extends CAP to consider latency/consistency tradeoffs even when no partition exists.`,
    keyTerms: ['CAP theorem', 'consistency', 'availability', 'partition tolerance', 'eventual consistency', 'CP', 'AP', 'distributed'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-14',
    category: 'be-question',
    question: 'What is GraphQL? What problems does it solve compared to REST, and what are its tradeoffs?',
    difficulty: 'intermediate',
    concepts: ['GraphQL', 'REST', 'over-fetching', 'under-fetching', 'schema'],
    modelAnswer: `GraphQL is a query language for APIs and a server-side runtime for executing those queries. Clients specify exactly what data they need in a query, and the server returns exactly that — no more, no less.

**Problems it solves over REST:**
- **Over-fetching** — REST endpoints return full resources; GraphQL returns only requested fields
- **Under-fetching** — REST often requires multiple round-trips (get user, then get their posts, then comments); GraphQL fetches all in one request
- **Versioning** — REST needs /v2/ endpoints; GraphQL schemas evolve by adding fields (deprecated fields stay)
- **Strong typing** — the schema serves as a contract and enables tooling (autocomplete, validation)

**Tradeoffs:**
- More complex backend setup (schema design, resolvers, DataLoader for N+1)
- Query parsing overhead on every request
- Caching is harder (REST leverages HTTP caching by URL; GraphQL POST requests don't)
- N+1 problem is common in naive implementations
- File uploads require multipart extensions
- Overkill for simple CRUD APIs

Best for: complex data graphs with multiple related entities, mobile apps (network-sensitive), developer-platform APIs. Use REST for simple CRUD, file uploads, or when HTTP caching is critical.`,
    keyTerms: ['GraphQL', 'over-fetching', 'under-fetching', 'schema', 'resolver', 'REST', 'strongly typed', 'N+1', 'caching'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-15',
    category: 'be-question',
    question: 'What is Docker and why is it used in modern backend development?',
    difficulty: 'easy',
    concepts: ['Docker', 'containers', 'images', 'isolation', 'deployment'],
    modelAnswer: `Docker is a platform for building, shipping, and running applications in containers. A container is a lightweight, isolated environment that packages an application with all its dependencies (runtime, libraries, config) so it runs consistently everywhere.

**Why Docker:**
- **Consistency** — "works on my machine" is eliminated. The same image runs identically in dev, CI, staging, and production
- **Isolation** — containers don't interfere with each other or the host. Run Node 18 and Node 20 apps on the same server
- **Reproducibility** — a Dockerfile documents the exact environment, like version-controlling your server setup
- **Fast startup** — containers start in milliseconds vs minutes for VMs
- **Resource efficiency** — containers share the OS kernel, unlike VMs which each run a full OS

**Key concepts:**
- **Image** — a read-only template (built from Dockerfile). Layers enable caching
- **Container** — a running instance of an image
- **Dockerfile** — instructions for building an image (FROM, RUN, COPY, CMD)
- **docker-compose** — orchestrates multi-container apps (app + postgres + redis together)
- **Registry** — stores images (Docker Hub, ECR, GCR)`,
    keyTerms: ['Docker', 'container', 'image', 'Dockerfile', 'isolation', 'consistency', 'deployment', 'docker-compose', 'registry'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-16',
    category: 'be-question',
    question: 'Explain microservices vs monolith architecture. When would you choose each?',
    difficulty: 'intermediate',
    concepts: ['microservices', 'monolith', 'architecture', 'trade-offs', 'distributed systems'],
    modelAnswer: `A **monolith** is a single deployable unit containing all application functionality — one codebase, one database, one deployment. A **microservices** architecture splits the application into small, independently deployable services, each owning its own data and communicating via APIs.

**Monolith advantages:**
- Simple to develop, test, and deploy initially
- Easy refactoring (no inter-service contracts)
- No network overhead for function calls
- Simpler debugging and tracing

**Microservices advantages:**
- Independent scaling — scale only the bottleneck service
- Technology freedom — use different languages/databases per service
- Smaller, focused teams can own services independently
- Fault isolation — one service failing doesn't bring down everything

**When to choose monolith:** early-stage startups, small teams (<10 engineers), unknown domain boundaries, when operational complexity would hurt more than it helps. Most successful systems start as monoliths.

**When to choose microservices:** at scale (hundreds of engineers), well-understood domain boundaries, different scaling needs per subsystem, regulatory isolation requirements, multiple teams needing independent release cadences.

The "strangler fig" pattern lets you extract microservices gradually from a monolith as your understanding and scale demands it.`,
    keyTerms: ['microservices', 'monolith', 'independent deployment', 'scaling', 'fault isolation', 'distributed', 'team autonomy', 'strangler fig'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-17',
    category: 'be-question',
    question: 'What is WebSocket and when should you use it vs Server-Sent Events vs polling?',
    difficulty: 'intermediate',
    concepts: ['WebSocket', 'SSE', 'polling', 'real-time', 'long-polling'],
    modelAnswer: `**Polling** — the client sends HTTP requests on a timer (e.g., every 5 seconds) to check for updates. Simple but inefficient — creates load even when nothing has changed, and has latency up to the polling interval.

**Long-polling** — the server holds the request open until there's data to send, then the client immediately reconnects. Better than polling but still creates overhead for each update and doesn't scale as well.

**Server-Sent Events (SSE)** — a unidirectional HTTP connection where the server pushes updates to the client. Uses a persistent HTTP connection with \`text/event-stream\` content type. Perfect for read-only real-time feeds: dashboards, live scores, notifications. Easy to implement, built-in reconnection, works through HTTP/2 multiplexing.

**WebSocket** — a full-duplex, persistent TCP connection that allows both client and server to send messages at any time. Lower latency than SSE, bidirectional. Best for interactive real-time features: chat, collaborative editing, multiplayer games, trading terminals.

**Choosing:** Use SSE when you only need server→client updates. Use WebSocket when you need client→server communication as well. Avoid WebSocket's complexity when SSE covers your use case — SSE uses standard HTTP and is easier to debug and proxy.`,
    keyTerms: ['WebSocket', 'SSE', 'polling', 'long-polling', 'bidirectional', 'real-time', 'persistent connection', 'server-sent events'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-18',
    category: 'be-question',
    question: 'What is Redis and what are its most common use cases in a Node.js backend?',
    difficulty: 'easy',
    concepts: ['Redis', 'caching', 'sessions', 'pub/sub', 'rate limiting'],
    modelAnswer: `Redis is an in-memory data structure store used as a cache, database, and message broker. Because it stores data in RAM, it offers sub-millisecond read/write latency — orders of magnitude faster than disk-based databases.

**Common Node.js use cases:**

1. **Caching** — cache expensive database queries or API responses. Store computed results for N seconds, invalidate on write. Reduces DB load dramatically.

2. **Session storage** — store user sessions server-side (instead of JWTs or cookies with large payloads). Fast lookup, automatic TTL expiry.

3. **Rate limiting** — use INCR + EXPIRE to count requests per key per time window. Atomic operations prevent race conditions.

4. **Job queues** — Bull/BullMQ uses Redis as its backing store for job state, retries, and delayed execution.

5. **Pub/Sub** — Redis pub/sub broadcasts messages to multiple subscribers. Used for real-time notifications and cache invalidation across multiple app instances.

6. **Leaderboards/Sorted Sets** — sorted sets natively support ranked data with O(log n) operations.

Key consideration: Redis is in-memory. Data is lost on restart without persistence configured (RDB snapshots or AOF logging). Not a replacement for a relational DB — used as a fast layer in front of it.`,
    keyTerms: ['Redis', 'in-memory', 'caching', 'session', 'rate limiting', 'pub/sub', 'Bull', 'TTL', 'leaderboard'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-19',
    category: 'be-question',
    question: 'What is a CDN and how does it improve performance for a global web application?',
    difficulty: 'easy',
    concepts: ['CDN', 'edge', 'caching', 'latency', 'global distribution'],
    modelAnswer: `A CDN (Content Delivery Network) is a globally distributed network of servers (edge nodes) that cache and serve content from locations physically close to users. Instead of every request traveling from a user in Tokyo to a server in Virginia (150ms+), the CDN serves cached content from an edge node in Tokyo (<10ms).

**How it works:** When a user requests a resource, their request routes to the nearest edge node via Anycast DNS. If the edge has a cached copy (cache hit), it responds immediately. On a miss, it fetches from the origin server, caches the response, and serves it.

**What to cache on a CDN:** static assets (JS, CSS, images, fonts), public API responses that change infrequently, HTML pages (with edge-side rendering).

**Benefits:**
- Reduced latency for global users
- Reduced origin server load (fewer requests reach your backend)
- DDoS protection (distributed absorption of attack traffic)
- High availability (if origin is down, stale-while-revalidate can still serve content)

**Key settings:** Cache-Control headers control TTL. Vary header routes different cached versions (by Accept-Encoding, etc.). CDN invalidation/purge APIs remove stale cached content on deployment.

Major CDNs: Cloudflare, Fastly, AWS CloudFront, Vercel Edge Network.`,
    keyTerms: ['CDN', 'edge node', 'cache hit', 'latency', 'origin server', 'Cache-Control', 'Anycast', 'global', 'static assets'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
  {
    id: 'be-q-20',
    category: 'be-question',
    question: 'Explain graceful shutdown in a Node.js server. Why does it matter and how do you implement it?',
    difficulty: 'intermediate',
    concepts: ['graceful shutdown', 'SIGTERM', 'in-flight requests', 'zero-downtime', 'Kubernetes'],
    modelAnswer: `Graceful shutdown ensures a server stops accepting new requests and finishes processing in-flight requests before exiting. Without it, abrupt termination kills active connections mid-response, causing errors for users.

**Why it matters:** In Kubernetes or any orchestrator, pods are killed during deployments, scaling, or node failures. SIGTERM is sent first (with a grace period), then SIGKILL. A proper shutdown handler makes zero-downtime deployments possible.

**Implementation:**
\`\`\`js
process.on('SIGTERM', async () => {
  server.close(() => {           // stop accepting new connections
    db.pool.end();               // close DB connections
    process.exit(0);            // exit cleanly
  });
  setTimeout(() => process.exit(1), 30000); // force exit after 30s
});
\`\`\`

**Steps:**
1. Listen for SIGTERM/SIGINT signals
2. Stop the HTTP server from accepting new connections
3. Wait for in-flight requests to complete
4. Close database connections, flush queues, release resources
5. Exit process

**Timeout:** Always add a forced exit timeout (30s) in case some resource refuses to close — better a clean shutdown with a timeout than a hung process.

Kubernetes sets \`terminationGracePeriodSeconds\` to match your shutdown timeout.`,
    keyTerms: ['graceful shutdown', 'SIGTERM', 'in-flight', 'server.close', 'Kubernetes', 'zero-downtime', 'SIGINT', 'terminationGracePeriodSeconds'],
    passingThreshold: 0.5,
    mostAsked: false,
  },
];
