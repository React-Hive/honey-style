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
      // If the whole value contains parentheses, skip entirely (likely calc or var)
      if (/[()]/.test(element.children)) {
        return;
      }

      const transformedParts: string[] = [];

      const parts = element.children.trim().split(/\s+/);

      for (const value of parts) {
        transformedParts.push(
          // Accept only numeric strings (integers or floats), no units or symbols
          /^(\d+|\d*\.\d+)$/.test(value) ? `${parseFloat(value) * spacingMultiplier}px` : value,
        );
      }

      const transformed = transformedParts.join(' ');

      element.return = `${element.props}:${transformed};`;
    }
  };
