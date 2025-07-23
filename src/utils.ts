import { hashString } from '@react-hive/honey-utils';

import { HONEY_STYLED_COMPONENT_ID_PROP, VALID_DOM_ELEMENT_ATTRS } from './constants';
import { css } from './css';
import type {
  HoneyHEXColor,
  HoneyCSSColor,
  HoneyCSSClassName,
  HoneyCSSShorthandDimensionOutput,
  HoneyCSSShorthandTuple,
  HoneyCSSSpacingValue,
  HoneyCSSDimensionUnit,
  HoneyCSSDimensionValue,
} from './css';
import type {
  Nullable,
  HoneyColor,
  HoneyColorKey,
  HoneyColors,
  HoneyDimensionName,
  HoneyFontName,
  HoneySpacings,
  HoneyStyledComponent,
  HoneyStyledContext,
} from './types';

export const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

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
 * Determines the resolved type for spacing values when processed by `resolveSpacing`.
 *
 * The return type adapts based on the shape of the `Value` and presence of a CSS `Unit`:
 *
 * - If `Value` is a `string` (e.g., raw `'10px'` or `'auto'`), it is returned as-is.
 * - If `Unit` is `null`, the original value is returned (either number or shorthand array).
 * - If `Unit` is provided and `Value` is a shorthand array (e.g., `[1, 2, 3, 4]`),
 *   it is resolved to a space-separated dimension string (e.g., `'8px 16px 24px 32px'`).
 * - If `Unit` is provided and `Value` is a number, it is resolved to a single dimension string (e.g., `'16px'`).
 *
 * This type helps enforce correct resolution behavior depending on user input and configuration.
 *
 * @template Value - The input spacing value (number, shorthand array, or raw string).
 * @template Unit - A CSS length unit (e.g., 'px', 'em'), or `null` to skip unit formatting.
 */
export type HoneyResolveSpacingResult<
  Value extends HoneyCSSSpacingValue,
  Unit extends Nullable<HoneyCSSDimensionUnit>,
> = Value extends HoneyCSSDimensionValue
  ? Value
  : Unit extends null
    ? Value
    : Value extends HoneyCSSShorthandTuple<number | HoneyCSSDimensionValue>
      ? HoneyCSSShorthandDimensionOutput<Value, NonNullable<Unit>>
      : HoneyCSSDimensionValue<NonNullable<Unit>>;

/**
 * Resolves a spacing value or shorthand spacing array using the theme and optional unit.
 *
 * This function takes spacing multipliers and converts them into pixel or unit-based values
 * using a theme spacing scale (e.g., `theme.spacings.base`). Useful for applying consistent
 * layout spacing with theming and token support.
 *
 * @template Value - The spacing value(s) to resolve. Can be:
 *                   - A number (e.g., `1`) representing a multiplier.
 *                   - An array of numbers (e.g., `[1, 2, 3, 4]`) for shorthand spacing.
 *                   - A dimension string (e.g., `'10px'`) will be returned as `never`.
 * @template Unit - Optional CSS unit (`'px'`, `'em'`, etc.), or `null` to skip units.
 *
 * @param value - Spacing multiplier(s) to apply.
 * @param [unit='px'] - The CSS unit to append. If `null`, values remain numeric.
 * @param [type='base'] - The spacing type to use from the theme (e.g., `'base'`, `'small'`).
 *
 * @returns A function that takes a theme context and returns:
 *          - A single resolved value (e.g., `'16px'`) if `value` is a number.
 *          - A space-separated string (e.g., `'8px 12px'`) if `value` is an array.
 *          - `never` if the input is a raw string (unsupported).
 */
export const resolveSpacing =
  <Value extends HoneyCSSSpacingValue, Unit extends Nullable<HoneyCSSDimensionUnit> = 'px'>(
    value: Value,
    unit: Unit = 'px' as Unit,
    type: keyof HoneySpacings = 'base',
  ): ((context: HoneyStyledContext<object>) => HoneyResolveSpacingResult<Value, Unit>) =>
  ({ theme }) => {
    if (typeof value === 'string') {
      return value as never;
    }

    const selectedSpacing = theme.spacings[type] ?? 0;

    if (typeof value === 'number') {
      const normalizedValue = value * selectedSpacing;

      return (unit ? `${normalizedValue}${unit}` : normalizedValue) as HoneyResolveSpacingResult<
        Value,
        Unit
      >;
    }

    const calculatedValues = value.map(shorthandValue => {
      if (typeof shorthandValue === 'string') {
        return shorthandValue;
      }

      const calculatedValue = shorthandValue * selectedSpacing;

      return unit ? `${calculatedValue}${unit}` : calculatedValue;
    });

    return calculatedValues.join(' ') as HoneyResolveSpacingResult<Value, Unit>;
  };

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
