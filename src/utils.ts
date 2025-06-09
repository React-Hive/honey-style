import { compile, serialize, stringify } from 'stylis';

import { HONEY_STYLED_COMPONENT_ID_PROP, VALID_DOM_ELEMENT_ATTRS } from './constants';
import type { HoneyCSSClassName, HoneyCSSMediaRule, HoneyStyledComponent } from './types';

export function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export const toKebabCase = (str: string): string =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export const isString = (value: unknown): value is string => typeof value === 'string';

export const isObject = (value: unknown): value is object => typeof value === 'object';

export const isFunction = (value: unknown) => typeof value === 'function';

/**
 * Checks if a value is null or undefined.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is `null` or `undefined`, otherwise `false`.
 */
export const isNil = (value: unknown): value is null | undefined =>
  value === undefined || value === null;

/**
 * Generates a short, consistent hash string from an input string using a DJB2-inspired algorithm.
 *
 * This function uses a variation of the DJB2 algorithm, which is a simple yet effective hashing algorithm
 * based on bitwise XOR (`^`) and multiplication by 33. It produces a non-negative 32-bit integer,
 * which is then converted to a base-36 string (digits + lowercase letters) to produce a compact output.
 *
 * Useful for:
 * - Generating stable class names in CSS-in-JS libraries.
 * - Producing consistent cache keys.
 * - Quick and lightweight hashing needs where cryptographic security is not required.
 *
 * ⚠️ This is not cryptographically secure and should not be used for hashing passwords or sensitive data.
 *
 * @param str - The input string to hash.
 *
 * @returns A short, base-36 encoded hash string.
 *
 * @example
 * ```ts
 * const className = hashString('background-color: red;');
 * // → 'e4k1z0x'
 * ```
 */
const hashString = (str: string): string => {
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

/**
 * Constructs a complete `@media` query string from an array of media rule objects.
 * Each rule defines conditions such as screen size, orientation, or resolution,
 * which are converted into standard CSS media query syntax.
 *
 * @param rules - An array of media rule objects used to generate individual media queries.
 *
 * @returns A string containing a full `@media` query that can be used in CSS or injected into a stylesheet.
 *
 * @example
 * ```ts
 * atMedia([
 *   { minWidth: '768px', orientation: 'landscape' },
 *   { mediaType: 'print' }
 * ]);
 * // Returns: "@media screen and (min-width: 768px) and (orientation: landscape), print"
 * ```
 */
export const mediaQuery = (rules: HoneyCSSMediaRule[]): string => {
  const mediaRules = rules.map(rule => {
    const conditions = [
      rule.width && ['width', rule.width],
      rule.minWidth && ['min-width', rule.minWidth],
      rule.maxWidth && ['max-width', rule.maxWidth],
      rule.height && ['height', rule.height],
      rule.minHeight && ['min-height', rule.minHeight],
      rule.maxHeight && ['max-height', rule.maxHeight],
      rule.orientation && ['orientation', rule.orientation],
      rule.minResolution && ['min-resolution', rule.minResolution],
      rule.maxResolution && ['max-resolution', rule.maxResolution],
      rule.resolution && ['resolution', rule.resolution],
      rule.update && ['update', rule.update],
    ]
      .filter(Boolean)
      .map(r => r && `(${r[0]}: ${r[1]})`)
      .join(' and ');

    const operatorPart = rule.operator ? `${rule.operator} ` : '';
    const conditionsPart = conditions ? ` and ${conditions}` : '';

    return `${operatorPart}${rule.mediaType ?? 'screen'}${conditionsPart}`;
  });

  return `@media ${mediaRules.join(', ')}`;
};
