import type { Middleware } from 'stylis';
import { compile, middleware, serialize, stringify } from 'stylis';

import type { HoneyTheme } from '../types';
import { __DEV__ } from '../constants';
import { createCssRule } from './css';
import {
  createAbsoluteFillAtRuleMiddleware,
  createCenterAtRuleMiddleware,
  createInlineAtRuleMiddleware,
  createSpacingMiddleware,
  createStackAtRuleMiddleware,
  createEllipsisAtRuleMiddleware,
  createMediaAtRuleMiddleware,
} from './middlewares';

interface ProcessCssOptions {
  theme?: HoneyTheme;
}

export const processCss = (
  rawCss: string,
  selector?: string,
  { theme }: ProcessCssOptions = {},
): string => {
  const scopedCss = selector ? createCssRule(selector, rawCss) : rawCss;

  const middlewares: Middleware[] = [];

  if (__DEV__) {
    // middlewares.push(suggestAtRuleMiddleware);
  }

  middlewares.push(
    createMediaAtRuleMiddleware({ theme }),
    createSpacingMiddleware({ theme }),
    createStackAtRuleMiddleware({ theme }),
    createInlineAtRuleMiddleware({ theme }),
    createCenterAtRuleMiddleware(),
    createEllipsisAtRuleMiddleware(),
    createAbsoluteFillAtRuleMiddleware(),
    stringify,
  );

  return serialize(compile(scopedCss), middleware(middlewares));
};
