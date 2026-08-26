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

import { lessonTs01TypeGuardString } from './lesson-ts-01-type-guard-string';
import { lessonTs02PickKeys } from './lesson-ts-02-pick-keys';
import { lessonTs03OmitKeys } from './lesson-ts-03-omit-keys';
import { lessonTs04FilterNullish } from './lesson-ts-04-filter-nullish';
import { lessonTs05Capitalize } from './lesson-ts-05-capitalize';
import { lessonTs06UniqueArray } from './lesson-ts-06-unique-array';
import { lessonTs07GroupByKey } from './lesson-ts-07-group-by-key';
import { lessonTs08HasOwnKey } from './lesson-ts-08-has-own-key';
import { lessonTs09FlattenOnce } from './lesson-ts-09-flatten-once';
import { lessonTs10MergeDefaults } from './lesson-ts-10-merge-defaults';
import { lessonTs11DeepCloneJson } from './lesson-ts-11-deep-clone-json';
import { lessonTs12ComposeFns } from './lesson-ts-12-compose-fns';
import { lessonTs13PipeValue } from './lesson-ts-13-pipe-value';
import { lessonTs14MemoizeFn } from './lesson-ts-14-memoize-fn';
import { lessonTs15PartitionArray } from './lesson-ts-15-partition-array';
import { lessonTs16ArrayToRecord } from './lesson-ts-16-array-to-record';
import { lessonTs17AssertNever } from './lesson-ts-17-assert-never';
import { lessonTs18ParseQueryString } from './lesson-ts-18-parse-query-string';
import { lessonTs19TemplateInterpolate } from './lesson-ts-19-template-interpolate';
import { lessonTs20ReadonlyShallow } from './lesson-ts-20-readonly-shallow';
import { lessonTs21DeepMerge } from './lesson-ts-21-deep-merge';
import { lessonTs22FlattenDeep } from './lesson-ts-22-flatten-deep';
import { lessonTs23CurryFn } from './lesson-ts-23-curry-fn';
import { lessonTs24GetNested } from './lesson-ts-24-get-nested';
import { lessonTs25SetNested } from './lesson-ts-25-set-nested';
import { lessonTs26PromiseAll } from './lesson-ts-26-promise-all';
import { lessonTs27TopoSort } from './lesson-ts-27-topo-sort';
import { lessonTs28ShallowDiff } from './lesson-ts-28-shallow-diff';
import { lessonTs29LruCache } from './lesson-ts-29-lru-cache';
import { lessonTs30InvariantCheck } from './lesson-ts-30-invariant-check';
import { lessonCss01ParsePx } from './lesson-css-01-parse-px';
import { lessonCss02PxToRem } from './lesson-css-02-px-to-rem';
import { lessonCss03ClampNumber } from './lesson-css-03-clamp-number';
import { lessonCss04HexToRgb } from './lesson-css-04-hex-to-rgb';
import { lessonCss05RgbToHex } from './lesson-css-05-rgb-to-hex';
import { lessonCss06MarginShorthand } from './lesson-css-06-margin-shorthand';
import { lessonCss07SpecificityScore } from './lesson-css-07-specificity-score';
import { lessonCss08MediaMinWidth } from './lesson-css-08-media-min-width';
import { lessonCss09ContrastRatio } from './lesson-css-09-contrast-ratio';
import { lessonCss10TruncateText } from './lesson-css-10-truncate-text';
import { lessonCss11FlexGrowTotal } from './lesson-css-11-flex-grow-total';
import { lessonCss12GridColumnCount } from './lesson-css-12-grid-column-count';
import { lessonCss13MatchesClass } from './lesson-css-13-matches-class';
import { lessonCss14CascadeWinner } from './lesson-css-14-cascade-winner';
import { lessonCss15NormalizeColorToken } from './lesson-css-15-normalize-color-token';
import { lessonCss16SpacingScale } from './lesson-css-16-spacing-scale';
import { lessonCss17BreakpointFor } from './lesson-css-17-breakpoint-for';
import { lessonCss18BoxModelTotal } from './lesson-css-18-box-model-total';
import { lessonCss19FluidFontSize } from './lesson-css-19-fluid-font-size';
import { lessonCss20ZIndexSort } from './lesson-css-20-z-index-sort';
import { lessonCss21CompareSpecificity } from './lesson-css-21-compare-specificity';
import { lessonCss22ParseTranslate } from './lesson-css-22-parse-translate';
import { lessonCss23ResolveCssVar } from './lesson-css-23-resolve-css-var';
import { lessonCss24ContainerQueryMatch } from './lesson-css-24-container-query-match';
import { lessonCss25LayerOrder } from './lesson-css-25-layer-order';
import { lessonCss26GridAreaName } from './lesson-css-26-grid-area-name';
import { lessonCss27KeyframeLerp } from './lesson-css-27-keyframe-lerp';
import { lessonCss28DesignTokenResolve } from './lesson-css-28-design-token-resolve';
import { lessonCss29MinmaxTrack } from './lesson-css-29-minmax-track';
import { lessonCss30AspectRatioBox } from './lesson-css-30-aspect-ratio-box';
import { lessonVt01AssertEqual } from './lesson-vt-01-assert-equal';
import { lessonVt02AssertThrows } from './lesson-vt-02-assert-throws';
import { lessonVt03AssertIncludes } from './lesson-vt-03-assert-includes';
import { lessonVt04AssertDefined } from './lesson-vt-04-assert-defined';
import { lessonVt05AssertMatches } from './lesson-vt-05-assert-matches';
import { lessonVt06AssertLength } from './lesson-vt-06-assert-length';
import { lessonVt07AssertDeepEqual } from './lesson-vt-07-assert-deep-equal';
import { lessonVt08CollectTests } from './lesson-vt-08-collect-tests';
import { lessonVt09CreateMock } from './lesson-vt-09-create-mock';
import { lessonVt10CreateSpy } from './lesson-vt-10-create-spy';
import { lessonVt11AssertRejects } from './lesson-vt-11-assert-rejects';
import { lessonVt12MockSequence } from './lesson-vt-12-mock-sequence';
import { lessonVt13SnapshotSerialize } from './lesson-vt-13-snapshot-serialize';
import { lessonVt14AssertPartial } from './lesson-vt-14-assert-partial';
import { lessonVt15TestEach } from './lesson-vt-15-test-each';
import { lessonVt16AssertCalledWith } from './lesson-vt-16-assert-called-with';
import { lessonVt17AssertCallCount } from './lesson-vt-17-assert-call-count';
import { lessonVt18WithTimer } from './lesson-vt-18-with-timer';
import { lessonVt19AssertArrayContaining } from './lesson-vt-19-assert-array-containing';
import { lessonVt20IsAnyMatcher } from './lesson-vt-20-is-any-matcher';
import { lessonVt21AssertNoThrow } from './lesson-vt-21-assert-no-throw';
import { lessonVt22MockImpl } from './lesson-vt-22-mock-impl';
import { lessonVt23AssertInRange } from './lesson-vt-23-assert-in-range';
import { lessonVt24RunAsyncTests } from './lesson-vt-24-run-async-tests';
import { lessonVt25AssertShape } from './lesson-vt-25-assert-shape';
import { lessonVt26RetryFlaky } from './lesson-vt-26-retry-flaky';
import { lessonVt27AssertCallOrder } from './lesson-vt-27-assert-call-order';
import { lessonVt28TableDriven } from './lesson-vt-28-table-driven';
import { lessonVt29DiffSnapshots } from './lesson-vt-29-diff-snapshots';
import { lessonVt30CoveragePercent } from './lesson-vt-30-coverage-percent';
import { lessonAi01EstimateTokens } from './lesson-ai-01-estimate-tokens';
import { lessonAi02TruncateContext } from './lesson-ai-02-truncate-context';
import { lessonAi03ParseLlmJson } from './lesson-ai-03-parse-llm-json';
import { lessonAi04BuildSystemPrompt } from './lesson-ai-04-build-system-prompt';
import { lessonAi05FormatMessage } from './lesson-ai-05-format-message';
import { lessonAi06ExtractCodeFence } from './lesson-ai-06-extract-code-fence';
import { lessonAi07SanitizeInput } from './lesson-ai-07-sanitize-input';
import { lessonAi08TokenCost } from './lesson-ai-08-token-cost';
import { lessonAi09ChunkDocument } from './lesson-ai-09-chunk-document';
import { lessonAi10WantsJson } from './lesson-ai-10-wants-json';
import { lessonAi11FewShotPrompt } from './lesson-ai-11-few-shot-prompt';
import { lessonAi12KeywordScore } from './lesson-ai-12-keyword-score';
import { lessonAi13CosineSimilarity } from './lesson-ai-13-cosine-similarity';
import { lessonAi14PickModel } from './lesson-ai-14-pick-model';
import { lessonAi15ParseToolCall } from './lesson-ai-15-parse-tool-call';
import { lessonAi16TrimMessages } from './lesson-ai-16-trim-messages';
import { lessonAi17BackoffMs } from './lesson-ai-17-backoff-ms';
import { lessonAi18ApplyDelta } from './lesson-ai-18-apply-delta';
import { lessonAi19ExtractUrls } from './lesson-ai-19-extract-urls';
import { lessonAi20FillTemplate } from './lesson-ai-20-fill-template';
import { lessonAi21RelevanceScore } from './lesson-ai-21-relevance-score';
import { lessonAi22RedactEmail } from './lesson-ai-22-redact-email';
import { lessonAi23ParseAgentAction } from './lesson-ai-23-parse-agent-action';
import { lessonAi24ToolRegistry } from './lesson-ai-24-tool-registry';
import { lessonAi25BudgetMessages } from './lesson-ai-25-budget-messages';
import { lessonAi26UnsupportedClaim } from './lesson-ai-26-unsupported-claim';
import { lessonAi27ValidateOutput } from './lesson-ai-27-validate-output';
import { lessonAi28RerankDocs } from './lesson-ai-28-rerank-docs';
import { lessonAi29SummarizeTurns } from './lesson-ai-29-summarize-turns';
import { lessonAi30DedupeVectors } from './lesson-ai-30-dedupe-vectors';
import { lessonAi31StripCot } from './lesson-ai-31-strip-cot';
import { lessonAi32GuardrailBlock } from './lesson-ai-32-guardrail-block';
import { lessonAi33EvalMetrics } from './lesson-ai-33-eval-metrics';
import { lessonJs01VariablesTypes } from './lesson-js-01-variables-types';
import { lessonJs02FunctionsBasics } from './lesson-js-02-functions-basics';
import { lessonJs03ArraysBasics } from './lesson-js-03-arrays-basics';
import { lessonJs04ObjectsBasics } from './lesson-js-04-objects-basics';
import { lessonJs05ArrayMethods } from './lesson-js-05-array-methods';
import { lessonJs06ClassesPrototypes } from './lesson-js-06-classes-prototypes';
import { lessonFe01ClosureCounter } from './lesson-fe-01-closure-counter';
import { lessonFe03PromiseAll } from './lesson-fe-03-promise-all';
import { lessonFe14Curry } from './lesson-fe-14-curry';
import { lessonFe15PipeCompose } from './lesson-fe-15-pipe-compose';
import { lessonFe16FlatArray } from './lesson-fe-16-flat-array';
import { lessonFe17UniqueArray } from './lesson-fe-17-unique-array';
import { lessonFe18GroupBy } from './lesson-fe-18-group-by';
import { lessonBe21TrimString } from './lesson-be-21-trim-string';
import { lessonBe22PadString } from './lesson-be-22-pad-string';
import { lessonBe23SafeParseInt } from './lesson-be-23-safe-parse-int';
import { lessonBe24ShallowMerge } from './lesson-be-24-shallow-merge';
import { lessonBe25CapitalizeWord } from './lesson-be-25-capitalize-word';
import { lessonBe26CircuitBreaker } from './lesson-be-26-circuit-breaker';
import { lessonBe27TokenBucket } from './lesson-be-27-token-bucket';
import { lessonBe28OncePerKey } from './lesson-be-28-once-per-key';
import { lessonBe29BackoffJitter } from './lesson-be-29-backoff-jitter';
import { lessonBe30ParseContentType } from './lesson-be-30-parse-content-type';
import { lessonFe21ClampNumber } from './lesson-fe-21-clamp-number';
import { lessonFe22ChunkArray } from './lesson-fe-22-chunk-array';
import { lessonFe23FlattenToDepth } from './lesson-fe-23-flatten-to-depth';
import { lessonFe24FormatBytes } from './lesson-fe-24-format-bytes';
import { lessonFe25PartitionArray } from './lesson-fe-25-partition-array';
import { lessonFe26DeepEqual } from './lesson-fe-26-deep-equal';
import { lessonFe27RunWithConcurrency } from './lesson-fe-27-run-with-concurrency';
import { lessonFe28FlattenObject } from './lesson-fe-28-flatten-object';
import { lessonFe29InvertObject } from './lesson-fe-29-invert-object';
import { lessonFe30StableSortBy } from './lesson-fe-30-stable-sort-by';
import { lessonFea21ToggleState } from './lesson-fea-21-toggle-state';
import { lessonFea22InputField } from './lesson-fea-22-input-field';
import { lessonFea23CheckboxGroup } from './lesson-fea-23-checkbox-group';
import { lessonFea24TabsState } from './lesson-fea-24-tabs-state';
import { lessonFea25CounterStore } from './lesson-fea-25-counter-store';
import { lessonFea26AsyncCache } from './lesson-fea-26-async-cache';
import { lessonFea27BatchScheduler } from './lesson-fea-27-batch-scheduler';
import { lessonFea28PubSub } from './lesson-fea-28-pub-sub';
import { lessonFea29SelectorMemo } from './lesson-fea-29-selector-memo';
import { lessonFea30ResourceLoader } from './lesson-fea-30-resource-loader';
import { lessonNj21NormalizeSlug } from './lesson-nj-21-normalize-slug';
import { lessonNj22DynamicSegment } from './lesson-nj-22-dynamic-segment';
import { lessonNj23ParseSearchParams } from './lesson-nj-23-parse-search-params';
import { lessonNj24BuildPageTitle } from './lesson-nj-24-build-page-title';
import { lessonNj25StripRouteGroups } from './lesson-nj-25-strip-route-groups';
import { lessonNj26ResolveRedirect } from './lesson-nj-26-resolve-redirect';
import { lessonNj27MergeMetadata } from './lesson-nj-27-merge-metadata';
import { lessonNj28CacheTags } from './lesson-nj-28-cache-tags';
import { lessonNj29MatchMiddlewarePath } from './lesson-nj-29-match-middleware-path';
import { lessonNj30ValidateSegmentConfig } from './lesson-nj-30-validate-segment-config';
export const allLessons = [
  lessonNj30ValidateSegmentConfig,
  lessonNj29MatchMiddlewarePath,
  lessonNj28CacheTags,
  lessonNj27MergeMetadata,
  lessonNj26ResolveRedirect,
  lessonNj25StripRouteGroups,
  lessonNj24BuildPageTitle,
  lessonNj23ParseSearchParams,
  lessonNj22DynamicSegment,
  lessonNj21NormalizeSlug,
  lessonFea30ResourceLoader,
  lessonFea29SelectorMemo,
  lessonFea28PubSub,
  lessonFea27BatchScheduler,
  lessonFea26AsyncCache,
  lessonFea25CounterStore,
  lessonFea24TabsState,
  lessonFea23CheckboxGroup,
  lessonFea22InputField,
  lessonFea21ToggleState,
  lessonFe30StableSortBy,
  lessonFe29InvertObject,
  lessonFe28FlattenObject,
  lessonFe27RunWithConcurrency,
  lessonFe26DeepEqual,
  lessonFe25PartitionArray,
  lessonFe24FormatBytes,
  lessonFe23FlattenToDepth,
  lessonFe22ChunkArray,
  lessonFe21ClampNumber,
  lessonFe18GroupBy,
  lessonFe17UniqueArray,
  lessonFe16FlatArray,
  lessonFe15PipeCompose,
  lessonFe14Curry,
  lessonFe03PromiseAll,
  lessonFe01ClosureCounter,
  lessonJs06ClassesPrototypes,
  lessonJs05ArrayMethods,
  lessonJs04ObjectsBasics,
  lessonJs03ArraysBasics,
  lessonJs02FunctionsBasics,
  lessonJs01VariablesTypes,
  lessonBe30ParseContentType,
  lessonBe29BackoffJitter,
  lessonBe28OncePerKey,
  lessonBe27TokenBucket,
  lessonBe26CircuitBreaker,
  lessonBe25CapitalizeWord,
  lessonBe24ShallowMerge,
  lessonBe23SafeParseInt,
  lessonBe22PadString,
  lessonBe21TrimString,
  lessonAi33EvalMetrics,
  lessonAi32GuardrailBlock,
  lessonAi31StripCot,
  lessonAi30DedupeVectors,
  lessonAi29SummarizeTurns,
  lessonAi28RerankDocs,
  lessonAi27ValidateOutput,
  lessonAi26UnsupportedClaim,
  lessonAi25BudgetMessages,
  lessonAi24ToolRegistry,
  lessonAi23ParseAgentAction,
  lessonAi22RedactEmail,
  lessonAi21RelevanceScore,
  lessonAi20FillTemplate,
  lessonAi19ExtractUrls,
  lessonAi18ApplyDelta,
  lessonAi17BackoffMs,
  lessonAi16TrimMessages,
  lessonAi15ParseToolCall,
  lessonAi14PickModel,
  lessonAi13CosineSimilarity,
  lessonAi12KeywordScore,
  lessonAi11FewShotPrompt,
  lessonAi10WantsJson,
  lessonAi09ChunkDocument,
  lessonAi08TokenCost,
  lessonAi07SanitizeInput,
  lessonAi06ExtractCodeFence,
  lessonAi05FormatMessage,
  lessonAi04BuildSystemPrompt,
  lessonAi03ParseLlmJson,
  lessonAi02TruncateContext,
  lessonAi01EstimateTokens,
  lessonVt30CoveragePercent,
  lessonVt29DiffSnapshots,
  lessonVt28TableDriven,
  lessonVt27AssertCallOrder,
  lessonVt26RetryFlaky,
  lessonVt25AssertShape,
  lessonVt24RunAsyncTests,
  lessonVt23AssertInRange,
  lessonVt22MockImpl,
  lessonVt21AssertNoThrow,
  lessonVt20IsAnyMatcher,
  lessonVt19AssertArrayContaining,
  lessonVt18WithTimer,
  lessonVt17AssertCallCount,
  lessonVt16AssertCalledWith,
  lessonVt15TestEach,
  lessonVt14AssertPartial,
  lessonVt13SnapshotSerialize,
  lessonVt12MockSequence,
  lessonVt11AssertRejects,
  lessonVt10CreateSpy,
  lessonVt09CreateMock,
  lessonVt08CollectTests,
  lessonVt07AssertDeepEqual,
  lessonVt06AssertLength,
  lessonVt05AssertMatches,
  lessonVt04AssertDefined,
  lessonVt03AssertIncludes,
  lessonVt02AssertThrows,
  lessonVt01AssertEqual,
  lessonCss30AspectRatioBox,
  lessonCss29MinmaxTrack,
  lessonCss28DesignTokenResolve,
  lessonCss27KeyframeLerp,
  lessonCss26GridAreaName,
  lessonCss25LayerOrder,
  lessonCss24ContainerQueryMatch,
  lessonCss23ResolveCssVar,
  lessonCss22ParseTranslate,
  lessonCss21CompareSpecificity,
  lessonCss20ZIndexSort,
  lessonCss19FluidFontSize,
  lessonCss18BoxModelTotal,
  lessonCss17BreakpointFor,
  lessonCss16SpacingScale,
  lessonCss15NormalizeColorToken,
  lessonCss14CascadeWinner,
  lessonCss13MatchesClass,
  lessonCss12GridColumnCount,
  lessonCss11FlexGrowTotal,
  lessonCss10TruncateText,
  lessonCss09ContrastRatio,
  lessonCss08MediaMinWidth,
  lessonCss07SpecificityScore,
  lessonCss06MarginShorthand,
  lessonCss05RgbToHex,
  lessonCss04HexToRgb,
  lessonCss03ClampNumber,
  lessonCss02PxToRem,
  lessonCss01ParsePx,
  lessonTs30InvariantCheck,
  lessonTs29LruCache,
  lessonTs28ShallowDiff,
  lessonTs27TopoSort,
  lessonTs26PromiseAll,
  lessonTs25SetNested,
  lessonTs24GetNested,
  lessonTs23CurryFn,
  lessonTs22FlattenDeep,
  lessonTs21DeepMerge,
  lessonTs20ReadonlyShallow,
  lessonTs19TemplateInterpolate,
  lessonTs18ParseQueryString,
  lessonTs17AssertNever,
  lessonTs16ArrayToRecord,
  lessonTs15PartitionArray,
  lessonTs14MemoizeFn,
  lessonTs13PipeValue,
  lessonTs12ComposeFns,
  lessonTs11DeepCloneJson,
  lessonTs10MergeDefaults,
  lessonTs09FlattenOnce,
  lessonTs08HasOwnKey,
  lessonTs07GroupByKey,
  lessonTs06UniqueArray,
  lessonTs05Capitalize,
  lessonTs04FilterNullish,
  lessonTs03OmitKeys,
  lessonTs02PickKeys,
  lessonTs01TypeGuardString,
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
