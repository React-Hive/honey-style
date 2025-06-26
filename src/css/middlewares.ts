import type { Middleware } from 'stylis';

import { CSS_SPACING_PROPERTIES } from './constants';

interface SpacingMiddlewareOptions {
  /**
   * @default 0
   */
  spacingMultiplier?: number;
}

export const createSpacingMiddleware =
  ({ spacingMultiplier }: SpacingMiddlewareOptions): Middleware =>
  element => {
    if (!spacingMultiplier || element.type !== 'decl') {
      return;
    }

    if (
      typeof element.props === 'string' &&
      CSS_SPACING_PROPERTIES.includes(element.props as never) &&
      typeof element.children === 'string'
    ) {
      const transformed = element.children
        .split(/\s+/)
        .map(value => {
          if (/[a-z%]+$/i.test(value)) {
            return value;
          }

          return `${parseFloat(value) * spacingMultiplier}px`;
        })
        .join(' ');

      element.return = `${element.props}:${transformed};`;
    }
  };
