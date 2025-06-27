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
          /^-?\d*\.?\d+$/.test(value) ? `${parseFloat(value) * spacingMultiplier}px` : value,
        );
      }

      const transformed = transformedParts.join(' ');

      element.return = `${element.props}:${transformed};`;
    }
  };

interface StackMiddlewareOptions {
  /**
   * @default 0
   */
  spacingMultiplier: number;
}

export const createStackMiddleware =
  ({ spacingMultiplier = 0 }: StackMiddlewareOptions): Middleware =>
  element => {
    if (element.parent?.type !== 'rule' || element.type !== '@honey-stack') {
      return;
    }

    const match = element.value.match(`^${element.type}\\s*\\(\\s*([^)]+?)\\s*\\)`);
    if (!match) {
      return;
    }

    const rawGap = match[1].trim();
    // Matches values like: 1.5, -2, 10px, 0.25rem, 5%, etc.
    const hasUnit = /[a-z%]+$/i.test(rawGap);

    const gapValue = hasUnit ? rawGap : `${parseFloat(rawGap) * spacingMultiplier}px`;
    const parentSelector = element.parent?.value;

    // Transform @honey-stack(...) into three normal declarations
    element.type = 'decl';
    element.return = `${parentSelector}{display:flex;flex-direction:column;gap:${gapValue};}`;
  };
