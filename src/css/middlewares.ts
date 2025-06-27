import type { Middleware } from 'stylis';

import { CSS_SPACING_PROPERTIES } from './constants';

const toKebabCase = (str: string): string =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const KEBAB_CASE_SPACING_PROPERTIES: string[] = CSS_SPACING_PROPERTIES.map(toKebabCase);

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
      KEBAB_CASE_SPACING_PROPERTIES.includes(element.props as never) &&
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
