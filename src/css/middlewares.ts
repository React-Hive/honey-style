import { compile, serialize } from 'stylis';
import type { Middleware } from 'stylis';

import { CSS_SPACING_PROPERTIES } from './constants';

const toKebabCase = (str: string): string =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const KEBAB_CASE_SPACING_PROPERTIES: string[] = CSS_SPACING_PROPERTIES.map(toKebabCase);

type CSSDeclaration = `${string}:${string}`;

interface StackMiddlewareOptions {
  /**
   * @default 0
   */
  spacingMultiplier: number;
}

export const createStackMiddleware =
  ({ spacingMultiplier = 0 }: StackMiddlewareOptions): Middleware =>
  (element, index, children, callback) => {
    if (element.parent?.type !== 'rule' || element.type !== '@honey-stack') {
      return;
    }

    const declarations: CSSDeclaration[] = ['display:flex', 'flex-direction:column'];

    const argsMatch = element.value.match(`^${element.type}\\s*\\(\\s*([^)]+?)\\s*\\)\\s*;?$`);
    if (argsMatch) {
      const rawGap = argsMatch[1].trim();
      const gapValue = /^-?\d*\.?\d+$/.test(rawGap)
        ? `${parseFloat(rawGap) * spacingMultiplier}px`
        : rawGap;

      declarations.push(`gap:${gapValue}`);
    }

    const parentSelector = element.parent?.value;
    if (parentSelector) {
      const resultDeclaration = declarations.map(d => `${d};`).join('');

      let serializedChildren = '';

      if (Array.isArray(element.children)) {
        serializedChildren = serialize(element.children, callback);
      }

      element.type = 'decl';
      element.return = serialize(
        compile(`${parentSelector}{${resultDeclaration}${serializedChildren}}`),
        callback,
      );
    }
  };

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
