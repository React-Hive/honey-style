import { compile, middleware, serialize, stringify } from 'stylis';
import type { Middleware } from 'stylis';

import { createSpacingMiddleware, createStackMiddleware } from './middlewares';

interface ProcessCssOptions {
  /**
   * @default 0
   */
  spacingMultiplier?: number;
}

export const processCss = (
  rawCss: string,
  selector?: string,
  { spacingMultiplier = 0 }: ProcessCssOptions = {},
): string => {
  const scopedCss = selector ? `${selector}{${rawCss}}` : rawCss;

  const middlewares: Middleware[] = [
    createStackMiddleware({ spacingMultiplier }),
    createSpacingMiddleware({ spacingMultiplier }),
    stringify,
  ];

  return serialize(compile(scopedCss), middleware(middlewares));
};
