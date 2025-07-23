import { compile, middleware, serialize, stringify } from 'stylis';
import type { Middleware } from 'stylis';

import { __DEV__ } from '../constants';
import {
  createAbsoluteFillAtRuleMiddleware,
  createCenterAtRuleMiddleware,
  createInlineAtRuleMiddleware,
  createSpacingMiddleware,
  createStackAtRuleMiddleware,
  createEllipsisAtRuleMiddleware,
} from './middlewares';

interface ProcessCssOptions {
  spacing?: number;
}

export const processCss = (
  rawCss: string,
  selector?: string,
  { spacing }: ProcessCssOptions = {},
): string => {
  const scopedCss = selector ? `${selector}{${rawCss}}` : rawCss;

  const middlewares: Middleware[] = [];

  if (__DEV__) {
    // middlewares.push(suggestAtRuleMiddleware);
  }

  middlewares.push(
    createStackAtRuleMiddleware({ spacing }),
    createInlineAtRuleMiddleware({ spacing }),
    createCenterAtRuleMiddleware(),
    createEllipsisAtRuleMiddleware(),
    createAbsoluteFillAtRuleMiddleware(),
    createSpacingMiddleware({ spacing }),
    stringify,
  );

  return serialize(compile(scopedCss), middleware(middlewares));
};
