import { compile, serialize, stringify } from 'stylis';

import type { HoneyCSSClassName } from './types';

export const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export const toKebabCase = (str: string): string =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export const hashString = (str: string): string => {
  let hash = 5381;

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }

  return (hash >>> 0).toString(36);
};

/**
 * Combines multiple class names into a single space-separated string
 *
 * @param classNames - Array of class names to combine
 */
export const combineClassNames = (classNames: HoneyCSSClassName[]) =>
  classNames.filter(Boolean).join(' ').trim();

export const processCss = (rawCss: string, selector?: string): string => {
  const scopedCss = selector ? `${selector}{${rawCss}}` : rawCss;

  return serialize(compile(scopedCss), stringify);
};
