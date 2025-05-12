import { compile, serialize, stringify } from 'stylis';

import { HONEY_STYLED_COMPONENT_ID_PROP, VALID_DOM_ELEMENT_ATTRS } from './constants';
import type { HoneyCSSClassName, HoneyStyledComponent } from './types';

export function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

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

export const resolveClassName = (css: string) => `hscn-${hashString(css)}`;

export const isStyledComponent = (component: any): component is HoneyStyledComponent =>
  HONEY_STYLED_COMPONENT_ID_PROP in component;

export const processCss = (rawCss: string, selector?: string): string => {
  const scopedCss = selector ? `${selector}{${rawCss}}` : rawCss;

  return serialize(compile(scopedCss), stringify);
};

/**
 * Filters out non-standard HTML attributes from a props object intended for a native HTML element.
 *
 * Retains only valid DOM attributes, including standard HTML attributes and
 * custom `data-*` or `aria-*` attributes. This helps avoid React warnings due to
 * invalid props and ensures clean, valid HTML output.
 *
 * This function is typically used when rendering polymorphic or styled components
 * that may receive non-standard props, but only valid attributes should be passed
 * to underlying DOM elements.
 *
 * @template Attrs - The type of the attributes object.
 *
 * @param attrs - An object representing all props passed to a component.
 *
 * @returns A new object containing only props that are safe and valid for use on native DOM elements.
 */
export const filterNonHtmlAttrs = <Attrs extends object>(attrs: Attrs): Attrs =>
  Object.entries(attrs).reduce((allowedAttrs, [name, value]) => {
    if (VALID_DOM_ELEMENT_ATTRS.has(name) || name.startsWith('data-') || name.startsWith('aria-')) {
      allowedAttrs[name as keyof Attrs] = value;
    }
    return allowedAttrs;
  }, {} as Attrs);
