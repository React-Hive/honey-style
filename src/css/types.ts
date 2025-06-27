import * as CSS from 'csstype';

export type HoneyCSSClassName = string | undefined;

/**
 * Represents a hexadecimal color value.
 *
 * Examples:
 * - `'#ffffff'`
 * - `'#123abc'`
 * - `'#000'`
 */
export type HoneyHEXColor = `#${string}`;

/**
 * Represents any valid CSS color, either a named color (like `'red'`, `'blue'`)
 * or a hexadecimal color code (like `'#ff0000'`).
 */
export type HoneyCSSColor = HoneyHEXColor | CSS.DataType.NamedColor | CSS.Globals;

/**
 * Represents absolute CSS dimension units.
 *
 * These units are fixed in physical measurements.
 *
 * - `'px'` — pixels
 * - `'cm'` — centimeters
 * - `'mm'` — millimeters
 * - `'in'` — inches
 * - `'pt'` — points
 * - `'pc'` — picas
 */
type HoneyCSSAbsoluteDimensionUnit = 'px' | 'cm' | 'mm' | 'in' | 'pt' | 'pc';

/**
 * Represents relative CSS dimension units.
 *
 * These units scale depending on the context.
 *
 * - `'em'` — relative to the font-size of the element
 * - `'rem'` — relative to the font-size of the root element
 * - `'%'` — percentage of the parent element
 * - `'vh'` — 1% of the viewport height
 * - `'vw'` — 1% of the viewport width
 * - `'vmin'` — 1% of the smaller dimension of the viewport
 * - `'vmax'` — 1% of the larger dimension of the viewport
 */
type HoneyCSSRelativeDimensionUnit = 'em' | 'rem' | '%' | 'vh' | 'vw' | 'vmin' | 'vmax';

/**
 * Represents any valid CSS dimension unit, including both absolute and relative types.
 */
export type HoneyCSSDimensionUnit = HoneyCSSAbsoluteDimensionUnit | HoneyCSSRelativeDimensionUnit;

/**
 * Represents a numeric CSS dimension value with an optional specific unit.
 *
 * This type can represent:
 * - A value with a specific CSS unit, such as `'8px'`, `'1.5rem'`, or `'100%'`.
 * - The special value `'auto'` commonly used for flexible layout values.
 *
 * @template Unit - The CSS unit to use (e.g., `'px'`, `'em'`, `'rem'`).
 */
export type HoneyCSSDimensionValue<Unit extends HoneyCSSDimensionUnit = HoneyCSSDimensionUnit> =
  | `${number}${Unit}`
  | 'auto';

/**
 * Represents a tuple of 2 to 4 values using standard CSS shorthand conventions.
 *
 * This type models how properties like `margin`, `padding`, `gap`, and `borderRadius`
 * can accept multiple values to control different sides or axes.
 *
 * Value interpretation follows CSS shorthand behavior:
 * - `[T, T]` → [top & bottom, left & right]
 * - `[T, T, T]` → [top, left & right, bottom]
 * - `[T, T, T, T]` → [top, right, bottom, left]
 *
 * @template T - The type of each spacing value (e.g., number, string, or token).
 */
export type HoneyCSSShorthandTuple<T> = [T, T] | [T, T, T] | [T, T, T, T];

/**
 * Converts a tuple of spacing values into a valid CSS shorthand string using a consistent unit.
 *
 * Acts as a type-level converter that transforms 2–4 spacing values (e.g., `[8, 12]`) into a space-separated
 * CSS string (e.g., `'8px 12px'`), suitable for shorthand-compatible properties like `margin`, `padding`, or `gap`.
 *
 * This type enforces unit consistency across all values and is useful for generating precise, typed spacing strings.
 *
 * Example outputs:
 * - `'8px 12px'` for `[8, 12]`
 * - `'1rem 2rem 1.5rem'` for `[1, 2, 1.5]`
 * - `'4px 8px 12px 16px'` for `[4, 8, 12, 16]`
 *
 * @template Tuple - A tuple of 2 to 4 values to be converted into a CSS shorthand string.
 * @template Unit - The CSS unit to apply to each value (e.g., `'px'`, `'rem'`, `'%'`).
 */
export type HoneyCSSShorthandDimensionOutput<
  Tuple extends HoneyCSSShorthandTuple<unknown>,
  Unit extends HoneyCSSDimensionUnit,
> = Tuple extends [unknown, unknown]
  ? `${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>}`
  : Tuple extends [unknown, unknown, unknown]
    ? `${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>}`
    : Tuple extends [unknown, unknown, unknown, unknown]
      ? `${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>} ${HoneyCSSDimensionValue<Unit>}`
      : never;

/**
 * Represents a CSS layout value that can be a single value or a shorthand array of values.
 *
 * Useful for properties like `margin`, `padding`, or `borderRadius`, which allow:
 * - A single value (applied to all sides)
 * - A tuple of 2–4 values using standard CSS shorthand behavior
 *
 * Examples:
 * - `'8px'`
 * - `['8px', '12px']`
 * - `['8px', '12px', '16px', '20px']`
 *
 * @template T - The type of each individual value.
 */
export type HoneyCSSMultiValue<T> = T | HoneyCSSShorthandTuple<T>;

/**
 * Represents a spacing value used in layout-related CSS properties.
 *
 * Can be:
 * - A single numeric value (e.g., `8`)
 * - A single dimension string (e.g., `'1rem'`)
 * - A shorthand array of 2–4 values (e.g., `[8, 12]` or `['1rem', '2rem', '1.5rem']`)
 *
 * Commonly used for properties like `margin`, `padding`, `gap`, etc.
 */
export type HoneyCSSSpacingValue = HoneyCSSMultiValue<number | HoneyCSSDimensionValue>;

export type HoneyRawCSSSpacingValue = number | HoneyCSSDimensionValue | CSS.Globals;

/**
 * Represents CSS properties related to spacing and positioning.
 */
export type HoneyCSSSpacingProperty = keyof Pick<
  CSS.Properties,
  | 'margin'
  | 'marginTop'
  | 'marginRight'
  | 'marginBottom'
  | 'marginLeft'
  | 'padding'
  | 'paddingTop'
  | 'paddingRight'
  | 'paddingBottom'
  | 'paddingLeft'
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'gap'
  | 'rowGap'
  | 'columnGap'
>;

/**
 * Represents shorthand spacing properties that support multi-value arrays.
 *
 * These properties accept 2–4 space-separated values
 * to control spacing on multiple sides (e.g., top, right, bottom, left).
 */
export type HoneyCSSShorthandSpacingProperty = keyof Pick<
  CSS.Properties,
  'margin' | 'padding' | 'gap'
>;

/**
 * Represents a subset of CSS properties that define color-related styles.
 */
export type HoneyCSSColorProperty = keyof Pick<
  CSS.Properties,
  | 'color'
  | 'backgroundColor'
  | 'borderColor'
  | 'borderTopColor'
  | 'borderRightColor'
  | 'borderBottomColor'
  | 'borderLeftColor'
  | 'outlineColor'
  | 'textDecorationColor'
  | 'fill'
  | 'stroke'
>;
