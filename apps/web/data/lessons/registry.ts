import type { ContentFilterCategory } from '@/lib/categories';
import { lessonMatchesCategoryFilter } from '@/lib/categories';
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
import { lessonReactComponentPatterns } from './lesson-react-component-patterns';
import { lessonReactReconciliation } from './lesson-react-reconciliation';
import { lessonNjAppRouterBasics } from './lesson-nj-app-router-basics';
import { lessonNjServerClientComponents } from './lesson-nj-server-client-components';
import { lessonNjDataFetching } from './lesson-nj-data-fetching';
import { lessonNjCaching } from './lesson-nj-caching';
import { lessonNjServerActions } from './lesson-nj-server-actions';
import { lessonNjMiddlewareAuth } from './lesson-nj-middleware-auth';
import { lessonNjRenderingStrategies } from './lesson-nj-rendering-strategies';
import { lessonNjPerformance } from './lesson-nj-performance';
import { lessonNjAdvancedRouting } from './lesson-nj-advanced-routing';
import { lessonNjTesting } from './lesson-nj-testing';

export const allLessons = [
  lessonFsModule,
  lessonAsyncPromises,
  lessonEventEmitter,
  lessonHttpServer,
  lessonStreams,
  lessonClosuresHof,
  lessonExpressMiddleware,
  lessonRestApi,
  lessonErrorHandling,
  lessonPostgresPg,
  lessonJwt,
  lessonWorkerThreads,
  lessonPubSub,
  lessonMemoization,
  lessonGracefulShutdown,
  lessonReactHooks,
  lessonCustomHooks,
  lessonContextApi,
  lessonPerformanceOptimization,
  lessonErrorBoundaries,
  lessonIntersectionObserver,
  lessonAccessibility,
  lessonDragDrop,
  lessonWebWorkers,
  lessonSse,
  lessonConcurrentReact,
  lessonReactComponentPatterns,
  lessonReactReconciliation,
  lessonStateMachines,
  lessonDesignTokens,
  lessonCoreWebVitals,
  lessonCsp,
  lessonNjAppRouterBasics,
  lessonNjServerClientComponents,
  lessonNjDataFetching,
  lessonNjCaching,
  lessonNjServerActions,
  lessonNjMiddlewareAuth,
  lessonNjRenderingStrategies,
  lessonNjPerformance,
  lessonNjAdvancedRouting,
  lessonNjTesting,
];

export function getLessonById(id: string) {
  return allLessons.find((l) => l.id === id);
}

export function filterLessons(category: ContentFilterCategory) {
  if (category === 'all') return allLessons;
  return allLessons.filter((lesson) => lessonMatchesCategoryFilter(lesson, category));
}
