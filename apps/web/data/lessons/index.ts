import { lessonFsModule } from './lesson-fs-module';
import { lessonAsyncPromises } from './lesson-async-promises';
import { lessonEventEmitter } from './lesson-event-emitter';
import { lessonHttpServer } from './lesson-http-server';
import { lessonStreams } from './lesson-streams';
import { lessonClosuresHof } from './lesson-closures-hof';
import { lessonExpressMiddleware } from './lesson-express-middleware';
import { lessonRestApi } from './lesson-rest-api';
import { lessonErrorHandling } from './lesson-error-handling';
import { lessonPostgresPg } from './lesson-postgres-pg';
import { lessonJwt } from './lesson-jwt';
import { lessonWorkerThreads } from './lesson-worker-threads';
import { lessonPubSub } from './lesson-pub-sub';
import { lessonMemoization } from './lesson-memoization';
import { lessonGracefulShutdown } from './lesson-graceful-shutdown';
import { lessonReactHooks } from './lesson-react-hooks';
import { lessonCustomHooks } from './lesson-custom-hooks';
import { lessonContextApi } from './lesson-context-api';
import { lessonPerformanceOptimization } from './lesson-performance-optimization';
import { lessonErrorBoundaries } from './lesson-error-boundaries';
import { lessonIntersectionObserver } from './lesson-intersection-observer';
import { lessonAccessibility } from './lesson-accessibility';
import { lessonDragDrop } from './lesson-drag-drop';
import { lessonWebWorkers } from './lesson-web-workers';
import { lessonSse } from './lesson-sse';
import { lessonConcurrentReact } from './lesson-concurrent-react';
import { lessonStateMachines } from './lesson-state-machines';
import { lessonDesignTokens } from './lesson-design-tokens';
import { lessonCoreWebVitals } from './lesson-core-web-vitals';
import { lessonCsp } from './lesson-csp';

export { type Lesson, type LessonStep, type MiniChallenge, type LessonProgressRecord, type LessonFilterCategory } from './types';
export { allLessons, getLessonById, filterLessons } from './registry';

// registry re-export below
