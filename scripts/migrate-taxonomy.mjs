#!/usr/bin/env node
/**
 * One-time taxonomy migration: JS → stack/javascript, web APIs → fe/web-apis, server → be/nodejs.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('apps/web/data');

const JS_FE = new Set([
  'fe-01-closure-counter',
  'fe-03-promise-all',
  'fe-04-deep-clone',
  'fe-05-debounce-ui',
  'fe-11-observer-pattern',
  'fe-12-memoize',
  'fe-13-throttle',
  'fe-14-curry',
  'fe-15-pipe-compose',
  'fe-16-flat-array',
  'fe-17-unique-array',
  'fe-18-group-by',
  'fe-19-sort-objects',
  'fe-20-fetch-retry',
  'fe-21-clamp-number',
  'fe-22-chunk-array',
  'fe-23-flatten-to-depth',
  'fe-24-format-bytes',
  'fe-25-partition-array',
  'fe-26-deep-equal',
  'fe-27-run-with-concurrency',
  'fe-28-flatten-object',
  'fe-29-invert-object',
  'fe-30-stable-sort-by',
]);

const WEB_FE = new Set([
  'fe-02-event-delegation',
  'fe-06-virtual-list',
  'fe-07-form-validation',
  'fe-08-local-storage',
  'fe-09-infinite-scroll',
  'fe-10-modal-focus',
]);

const JS_BE = new Set([
  'be-07-json-parse',
  'be-08-event-emitter',
  'be-09-rate-limiter',
  'be-11-cache-lru',
  'be-16-queue',
  'be-21-trim-string',
  'be-22-pad-string',
  'be-23-safe-parse-int',
  'be-24-shallow-merge',
  'be-25-capitalize-word',
  'be-26-circuit-breaker',
  'be-27-token-bucket',
  'be-28-once-per-key',
  'be-29-backoff-jitter',
  'be-30-parse-content-type',
]);

const NODE_BE = new Set([
  'be-01-list-files',
  'be-02-read-write-file',
  'be-03-async-file-read',
  'be-05-env-config',
  'be-06-path-join',
  'be-10-middleware-chain',
  'be-12-stream-transform',
  'be-13-http-router',
  'be-14-logger',
  'be-17-validation-schema',
  'be-18-singleton-db',
  'be-19-graceful-shutdown',
  'be-20-api-client',
]);

const DEDUPE = new Set(['be-04-debounce', 'be-15-retry-logic']);

const JS_LESSONS = new Set([
  'lesson-closures-hof',
  'lesson-async-promises',
  'lesson-memoization',
  'lesson-fe-21-clamp-number',
  'lesson-fe-22-chunk-array',
  'lesson-fe-23-flatten-to-depth',
  'lesson-fe-24-format-bytes',
  'lesson-fe-25-partition-array',
  'lesson-fe-26-deep-equal',
  'lesson-fe-27-run-with-concurrency',
  'lesson-fe-28-flatten-object',
  'lesson-fe-29-invert-object',
  'lesson-fe-30-stable-sort-by',
  'lesson-event-emitter',
  'lesson-be-21-trim-string',
  'lesson-be-22-pad-string',
  'lesson-be-23-safe-parse-int',
  'lesson-be-24-shallow-merge',
  'lesson-be-25-capitalize-word',
  'lesson-be-26-circuit-breaker',
  'lesson-be-27-token-bucket',
  'lesson-be-28-once-per-key',
  'lesson-be-29-backoff-jitter',
  'lesson-be-30-parse-content-type',
]);

const WEB_LESSONS = new Set([
  'lesson-intersection-observer',
  'lesson-web-workers',
  'lesson-drag-drop',
  'lesson-sse',
  'lesson-accessibility',
]);

const NODE_LESSONS = new Set([
  'lesson-fs-module',
  'lesson-http-server',
  'lesson-streams',
  'lesson-express-middleware',
  'lesson-rest-api',
  'lesson-error-handling',
  'lesson-postgres-pg',
  'lesson-jwt',
  'lesson-worker-threads',
  'lesson-pub-sub',
  'lesson-graceful-shutdown',
]);

const REACT_LESSONS = new Set([
  'lesson-react-hooks',
  'lesson-custom-hooks',
  'lesson-context-api',
  'lesson-error-boundaries',
  'lesson-performance-optimization',
]);

function patchChallengeFile(filePath, id) {
  let src = fs.readFileSync(filePath, 'utf8');
  const idMatch = src.match(/id:\s*'([^']+)'/);
  const challengeId = idMatch?.[1] ?? id;

  if (DEDUPE.has(challengeId)) {
    src = src.replace(/comingSoon:\s*false/, 'comingSoon: true');
    fs.writeFileSync(filePath, src);
    console.log(`dedupe ${challengeId}`);
    return;
  }

  let category, topLevel, subcategory;
  if (JS_FE.has(challengeId) || JS_BE.has(challengeId)) {
    category = 'stack-javascript';
    topLevel = 'stack';
    subcategory = 'javascript';
  } else if (WEB_FE.has(challengeId)) {
    category = 'fe-web-apis';
    topLevel = 'fe';
    subcategory = 'web-apis';
  } else if (NODE_BE.has(challengeId)) {
    category = 'be-nodejs';
    topLevel = 'be';
    subcategory = 'nodejs';
  } else {
    return;
  }

  src = src.replace(/category: '[^']+'/, `category: '${category}'`);
  src = src.replace(/topLevel: '[^']+'/, `topLevel: '${topLevel}'`);
  src = src.replace(/subcategory: (?:null|'[^']+')/, `subcategory: '${subcategory}'`);
  fs.writeFileSync(filePath, src);
  console.log(`challenge ${challengeId} → ${topLevel}/${subcategory}`);
}

function patchLessonFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  const idMatch = src.match(/id:\s*'([^']+)'/);
  const lessonId = idMatch?.[1];
  if (!lessonId) return;

  let category, topLevel, subcategory;
  if (JS_LESSONS.has(lessonId)) {
    category = 'stack-javascript';
    topLevel = 'stack';
    subcategory = 'javascript';
  } else if (WEB_LESSONS.has(lessonId)) {
    category = 'fe-web-apis';
    topLevel = 'fe';
    subcategory = 'web-apis';
  } else if (NODE_LESSONS.has(lessonId)) {
    category = 'be-nodejs';
    topLevel = 'be';
    subcategory = 'nodejs';
  } else if (REACT_LESSONS.has(lessonId)) {
    category = 'fe-advanced';
    topLevel = 'fe';
    subcategory = 'react';
  } else if (src.includes('subcategory: null')) {
    return;
  } else {
    return;
  }

  src = src.replace(/category: '[^']+'/, `category: '${category}'`);
  if (src.includes('topLevel:')) {
    src = src.replace(/topLevel: '[^']+'/, `topLevel: '${topLevel}'`);
  } else {
    src = src.replace(
      /category: '[^']+',/,
      `category: '${category}',\n  topLevel: '${topLevel}',`
    );
  }
  src = src.replace(/subcategory: (?:null|'[^']+')/, `subcategory: '${subcategory}'`);
  fs.writeFileSync(filePath, src);
  console.log(`lesson ${lessonId} → ${topLevel}/${subcategory}`);
}

const challengesDir = path.join(ROOT, 'challenges');
for (const dir of fs.readdirSync(challengesDir)) {
  const indexPath = path.join(challengesDir, dir, 'index.ts');
  if (fs.existsSync(indexPath)) patchChallengeFile(indexPath, dir);
}

const lessonsDir = path.join(ROOT, 'lessons');
for (const file of fs.readdirSync(lessonsDir)) {
  if (!file.endsWith('.ts') || file === 'types.ts' || file === 'registry.ts') continue;
  patchLessonFile(path.join(lessonsDir, file));
}

console.log('Done.');
