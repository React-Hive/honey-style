import type { Middleware } from 'stylis';
import { isString } from '@react-hive/honey-utils';

import { CSS_SPACING_PROPERTIES } from '../constants';
import type { HoneyTheme } from '../../types';

const toKebabCase = (str: string): string =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const KEBAB_CASE_SPACING_PROPERTIES: string[] = CSS_SPACING_PROPERTIES.map(toKebabCase);

interface SpacingMiddlewareOptions {
  theme?: HoneyTheme;
}

export const createSpacingMiddleware =
  ({ theme }: SpacingMiddlewareOptions): Middleware =>
  element => {
    if (element.type !== 'decl') {
      return;
    }

    if (
      isString(element.props) &&
      KEBAB_CASE_SPACING_PROPERTIES.includes(element.props) &&
      isString(element.children)
    ) {
      // If the whole value contains parentheses, skip entirely (likely calc or var)
      if (/[()]/.test(element.children)) {
        return;
      }

      const transformedParts: string[] = [];

      const spacing = theme?.spacings.base ?? 0;
      const parts = element.children.trim().split(/\s+/);

      for (const value of parts) {
        transformedParts.push(
          // Accept only numeric strings (integers or floats), no units or symbols
          /^-?\d*\.?\d+$/.test(value) ? `${parseFloat(value) * spacing}px` : value,
        );
      }

      const transformed = transformedParts.join(' ');

      element.return = `${element.props}:${transformed};`;
    }
  };
