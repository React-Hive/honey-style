import { compile, serialize, stringify } from 'stylis';

import { HONEY_STYLED_COMPONENT_ID_PROP, VALID_DOM_ELEMENT_ATTRS } from './constants';
import type {
  HoneyColor,
  HoneyColorKey,
  HoneyColors,
  HoneyCSSClassName,
  HoneyCSSColor,
  HoneyCSSDimensionValue,
  HoneyDimensionName,
  HoneyFontName,
  HoneyHEXColor,
  HoneyStyledComponent,
  HoneyStyledContext,
} from './types';
import { css } from './css';

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
 * Filters out `null`, `undefined`, and other falsy values from an array,
 * returning a typed array of only truthy `Item` values.
 *
 * Useful when working with optional or nullable items that need to be sanitized.
 *
 * @template T - The type of the items in the array.
 *
 * @param array - An array of items that may include `null`, `undefined`, or falsy values.
 *
 * @returns A new array containing only truthy `Item` values.
 */
export const boolFilter = <T>(array: (T | false | null | undefined)[]): T[] =>
  array.filter(Boolean) as T[];

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
 * Converts a pixel value to rem.
 *
 * @param px - The pixel value to be converted to rem.
 * @param base - The base value for conversion. Default is 16, which is the typical root font size.
 *
 * @returns The value in rem as a string.
 */
export const pxToRem = (px: number, base: number = 16): string => `${px / base}rem`;

/**
 * Type guard function to check if a string value follows the pattern of a theme color value.
 *
 * A theme color value is assumed to be a string containing exactly one dot (e.g., 'primary.main').
 *
 * @param propertyValue - The string value to check.
 *
 * @returns True if the string value is a theme color value, false otherwise.
 */
export const checkIsThemeColorValue = (propertyValue: string): propertyValue is HoneyColorKey =>
  propertyValue.split('.').length === 2;

/**
 * Resolves the font styles based on the provided font name from the theme.
 *
 * @param fontName - The name of the font to be resolved from the theme.
 *
 * @returns A style function that takes a theme object and returns the CSS styles for the specified font.
 */
export const resolveFont =
  (fontName: HoneyFontName) =>
  ({ theme }: HoneyStyledContext<object>) => {
    const font = theme.fonts[fontName];

    return css`
      font-family: ${font.family};
      font-size: ${pxToRem(font.size)};
      font-weight: ${font.weight};
      line-height: ${font.lineHeight !== undefined && pxToRem(font.lineHeight)};
      letter-spacing: ${font.letterSpacing !== undefined && pxToRem(font.letterSpacing)};
    `;
  };

/**
 * Converts a 3-character or 6-character HEX color code to an 8-character HEX with alpha (RRGGBBAA) format.
 *
 * @param hex - The 3-character or 6-character HEX color code (e.g., "#RGB" or "#RRGGBB" or "RGB" or "RRGGBB").
 * @param alpha - The alpha transparency value between 0 (fully transparent) and 1 (fully opaque).
 *
 * @throws {Error} If alpha value is not between 0 and 1, or if the hex code is invalid.
 *
 * @returns The 8-character HEX with alpha (RRGGBBAA) format color code, or null if input is invalid.
 */
export const convertHexToHexWithAlpha = (hex: string, alpha: number): HoneyHEXColor => {
  if (alpha < 0 || alpha > 1) {
    throw new Error(`[honey-layout]: Alpha "${alpha}" is not a valid hex format.`);
  }

  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

  const match = hex.match(hexRegex);
  if (!match) {
    throw new Error(`[honey-layout]: Invalid hex format.`);
  }

  const cleanHex = match[1];

  // Expand 3-character hex to 6-character hex if necessary
  const fullHex =
    cleanHex.length === 3
      ? cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2]
      : cleanHex;

  // Convert to 8-character hex with alpha
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, '0');

  return `#${fullHex + alphaHex}`;
};

/**
 * Resolves a color value from the theme or returns the input color directly if it's a standalone color name or HEX value.
 *
 * @param colorInput - A string representing the color to resolve.
 *                 This can be:
 *                  - A theme key in the format 'colorType.colorName'.
 *                  - A standalone color name (e.g., "red", "blue").
 *                  - A HEX color value (e.g., "#RRGGBB").
 * @param [alpha] - The alpha transparency value between 0 (fully transparent) and 1 (fully opaque).
 *                  Default to `undefined`.
 *
 * @returns A function that takes an `ExecutionContext` with a `theme` and resolves the color value:
 *           - A HEX color string from the theme (e.g., "#RRGGBB").
 *           - A HEX color string with alpha (e.g., "#RRGGBBAA") if `alpha` is provided.
 *           - The input `colorKey` value directly if it's a standalone color name or HEX value.
 *
 * @throws Will throw an error if the provided alpha value is not within the valid range (0 to 1).
 * @throws Will throw an error if the color format is invalid.
 */
export const resolveColor =
  (colorInput: HoneyColor, alpha?: number) =>
  ({ theme }: HoneyStyledContext<object>): HoneyCSSColor => {
    const [colorType, colorName] = colorInput.split('.');

    const color = colorName
      ? theme.colors[colorType as keyof HoneyColors][colorName]
      : (colorType as HoneyCSSColor);

    return alpha === undefined ? color : convertHexToHexWithAlpha(color, alpha);
  };

/**
 * Resolves a specific dimension value from the theme configuration.
 *
 * @param dimensionName - The name of the dimension to resolve.
 *
 * @returns A style function that takes the theme and returns the resolved dimension value from the theme.
 */
export const resolveDimension =
  (dimensionName: HoneyDimensionName) =>
  ({ theme }: HoneyStyledContext<object>): HoneyCSSDimensionValue =>
    theme.dimensions[dimensionName];
