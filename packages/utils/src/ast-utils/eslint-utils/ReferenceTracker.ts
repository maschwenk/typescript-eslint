/* eslint-disable @typescript-eslint/no-namespace */
import * as eslintUtils from '@eslint-community/eslint-utils';

import type * as TSESLint from '../../ts-eslint';
import type { TSESTree } from '../../ts-estree';

const ReferenceTrackerREAD: unique symbol = eslintUtils.ReferenceTracker.READ;
const ReferenceTrackerCALL: unique symbol = eslintUtils.ReferenceTracker.CALL;
const ReferenceTrackerCONSTRUCT: unique symbol =
  eslintUtils.ReferenceTracker.CONSTRUCT;
const ReferenceTrackerESM: unique symbol = eslintUtils.ReferenceTracker.ESM;

interface ReferenceTracker {
  /**
   * Iterate the references that the given `traceMap` determined.
   * This method starts to search from `require()` expression.
   *
   * @see {@link https://eslint-community.github.io/eslint-utils/api/scope-utils.html#tracker-iteratecjsreferences}
   */
  iterateCjsReferences<T>(
    traceMap: ReferenceTracker.TraceMap<T>,
  ): IterableIterator<ReferenceTracker.FoundReference<T>>;

  /**
   * Iterate the references that the given `traceMap` determined.
   * This method starts to search from `import`/`export` declarations.
   *
   * @see {@link https://eslint-community.github.io/eslint-utils/api/scope-utils.html#tracker-iterateesmreferences}
   */
  iterateEsmReferences<T>(
    traceMap: ReferenceTracker.TraceMap<T>,
  ): IterableIterator<ReferenceTracker.FoundReference<T>>;

  /**
   * Iterate the references that the given `traceMap` determined.
   * This method starts to search from global variables.
   *
   * @see {@link https://eslint-community.github.io/eslint-utils/api/scope-utils.html#tracker-iterateglobalreferences}
   */
  iterateGlobalReferences<T>(
    traceMap: ReferenceTracker.TraceMap<T>,
  ): IterableIterator<ReferenceTracker.FoundReference<T>>;
}
interface ReferenceTrackerStatic {
  readonly CALL: typeof ReferenceTrackerCALL;
  readonly CONSTRUCT: typeof ReferenceTrackerCONSTRUCT;
  readonly ESM: typeof ReferenceTrackerESM;

  new (
    globalScope: TSESLint.Scope.Scope,
    options?: {
      /**
       * The name list of Global Object. Optional. Default is `["global", "globalThis", "self", "window"]`.
       */
      globalObjectNames?: readonly string[];
      /**
       * The mode which determines how the `tracker.iterateEsmReferences()` method scans CommonJS modules.
       * If this is `"strict"`, the method binds CommonJS modules to the default export. Otherwise, the method binds
       * CommonJS modules to both the default export and named exports. Optional. Default is `"strict"`.
       */
      mode?: 'legacy' | 'strict';
    },
  ): ReferenceTracker;

  readonly READ: typeof ReferenceTrackerREAD;
}

namespace ReferenceTracker {
  export type READ = ReferenceTrackerStatic['READ'];
  export type CALL = ReferenceTrackerStatic['CALL'];
  export type CONSTRUCT = ReferenceTrackerStatic['CONSTRUCT'];
  export type ESM = ReferenceTrackerStatic['ESM'];
  export type ReferenceType = CALL | CONSTRUCT | READ;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type TraceMap<T = any> = Record<string, TraceMapElement<T>>;
  export interface TraceMapElement<T> {
    [key: string]: TraceMapElement<T>;
    [ReferenceTrackerCALL]?: T;
    [ReferenceTrackerCONSTRUCT]?: T;
    [ReferenceTrackerESM]?: true;
    [ReferenceTrackerREAD]?: T;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface FoundReference<T = any> {
    info: T;
    node: TSESTree.Node;
    path: readonly string[];
    type: ReferenceType;
  }
}

/**
 * The tracker for references. This provides reference tracking for global variables, CommonJS modules, and ES modules.
 *
 * @see {@link https://eslint-community.github.io/eslint-utils/api/scope-utils.html#referencetracker-class}
 */
export const ReferenceTracker =
  eslintUtils.ReferenceTracker as ReferenceTrackerStatic;
