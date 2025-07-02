import { compile, middleware, serialize, stringify } from 'stylis';
import type { Middleware } from 'stylis';

import {
  createAbsoluteFillAtRuleMiddleware,
  createCenterAtRuleMiddleware,
  createInlineAtRuleMiddleware,
  createSpacingMiddleware,
  createStackAtRuleMiddleware,
  createEllipsisAtRuleMiddleware,
} from './middlewares';

interface ProcessCssOptions {
  spacingMultiplier?: number;
}

export const processCss = (
  rawCss: string,
  selector?: string,
  { spacingMultiplier }: ProcessCssOptions = {},
): string => {
  const scopedCss = selector ? `${selector}{${rawCss}}` : rawCss;

  const middlewares: Middleware[] = [
    createStackAtRuleMiddleware({ spacingMultiplier }),
    createInlineAtRuleMiddleware({ spacingMultiplier }),
    createCenterAtRuleMiddleware(),
    createEllipsisAtRuleMiddleware(),
    createAbsoluteFillAtRuleMiddleware(),
    createSpacingMiddleware({ spacingMultiplier }),
    stringify,
  ];

  return serialize(compile(scopedCss), middleware(middlewares));
};
