/**
 * Maps legacy Phase 16 path item IDs (from the spec) to real content IDs in the repo.
 * Used when re-seeding PathStageItem and remapping existing PathItemProgress rows.
 */
export const PATH_ITEM_ID_REMAP: Record<string, string> = {
  // FE stage 1
  'fe-01-debounced-search': 'fe-05-debounce-ui',
  'fe-03-controlled-form': 'fe-07-form-validation',
  'fe-05-custom-hook': 'fea-02-custom-hook',
  'fe-06-context-theme': 'fea-03-context-api',
  'fe-08-modal': 'fe-10-modal-focus',
  'fe-12-error-boundary': 'fea-07-error-boundary',
  'fe-14-local-storage-hook': 'fe-08-local-storage',
  // FE stage 2
  'fe-02-infinite-scroll': 'fe-09-infinite-scroll',
  'fe-07-virtualized-list': 'fe-06-virtual-list',
  'fe-09-autocomplete': 'fe-13-throttle',
  'fe-10-useReducer-cart': 'fea-04-use-reducer',
  'fe-11-memo-optimization': 'fea-05-memo-optimization',
  'fe-15-suspense-lazy': 'fea-06-suspense-boundary',
  'fe-16-optimistic-update': 'nj-15-optimistic-updates-server-actions',
  // FE stage 3
  'fea-04-concurrent-features': 'fea-17-code-splitting',
  'fea-05-suspense-data': 'fea-16-ssr-hydration',
  'fea-13-accessibility-audit': 'fea-18-accessible-dropdown',
  'fea-14-design-tokens': 'css-28-design-token-resolve',
  'fea-17-observability': 'fea-20-performance-profiler',
  'fea-18-csp': 'fea-16-ssr-hydration',
  'sd-11-frontend-architecture': 'fea-14-virtual-dom',
  'sd-12-state-management': 'fea-13-state-machine',
  'sd-13-design-system': 'css-15-normalize-color-token',
  'sd-18-monitoring-observability': 'fe-20-fetch-retry',
  // BE stage 1
  'be-05-http-server': 'be-13-http-router',
  'be-08-env-config': 'be-05-env-config',
  'be-17-debounce': 'be-04-debounce',
  'be-18-cli-tool': 'be-06-path-join',
  // BE stage 2
  'be-07-promise-all': 'be-07-json-parse',
  'be-09-middleware': 'be-10-middleware-chain',
  'be-10-rest-crud': 'be-20-api-client',
  'be-11-error-handling': 'be-07-json-parse',
  'be-12-postgres-query': 'be-18-singleton-db',
  'be-13-jwt-auth': 'be-17-validation-schema',
  'be-19-memoize': 'be-11-cache-lru',
  // BE stage 3
  'be-04-event-emitter': 'be-08-event-emitter',
  'be-06-stream-pipe': 'be-12-stream-transform',
  'be-14-worker-threads': 'be-16-queue',
  'be-15-transform-stream': 'be-29-backoff-jitter',
  'be-16-pub-sub': 'fea-28-pub-sub',
  'be-20-graceful-shutdown': 'be-19-graceful-shutdown',
  'sd-01-url-shortener': 'be-27-token-bucket',
  'sd-03-rate-limiter': 'be-09-rate-limiter',
  'sd-07-distributed-cache': 'be-11-cache-lru',
  'sd-08-notification-system': 'be-16-queue',
  'sd-09-api-gateway': 'be-13-http-router',
  'sd-16-payment-system': 'be-26-circuit-breaker',
  // Full stack SD
  'sd-02-news-feed': 'fe-09-infinite-scroll',
  'sd-06-chat-system': 'fea-15-websocket-chat',
};

export function resolvePathItemId(itemId: string): string {
  return PATH_ITEM_ID_REMAP[itemId] ?? itemId;
}
