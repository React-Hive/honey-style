import type { HexColor } from '@react-hive/honey-utils';
import type { HoneyCssDimensionUnit } from '@react-hive/honey-css';
import * as CSS from 'csstype';

export type HoneyCssClassName = string | undefined;

/**
 * Represents any valid CSS color, either a named color (like `'red'`, `'blue'`)
 * or a hexadecimal color code (like `'#ff0000'`).
 */
export type HoneyCssColor = HexColor | CSS.Property.Color;

/**
 * Represents a numeric CSS dimension value with an optional specific unit.
 *
 * This type can represent:
 * - A value with a specific CSS unit, such as `'8px'`, `'1.5rem'`, or `'100%'`.
 * - The special value `'auto'` commonly used for flexible layout values.
 *
 * @template Unit - The CSS unit to use (e.g., `'px'`, `'em'`, `'rem'`).
 */
export type HoneyCssDimensionValue<Unit extends HoneyCssDimensionUnit = HoneyCssDimensionUnit> =
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
export type HoneyCssShorthandTuple<T> = [T, T] | [T, T, T] | [T, T, T, T];

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
export type HoneyCssShorthandDimensionOutput<
  Tuple extends HoneyCssShorthandTuple<unknown>,
  Unit extends HoneyCssDimensionUnit,
> = Tuple extends [unknown, unknown]
  ? `${HoneyCssDimensionValue<Unit>} ${HoneyCssDimensionValue<Unit>}`
  : Tuple extends [unknown, unknown, unknown]
    ? `${HoneyCssDimensionValue<Unit>} ${HoneyCssDimensionValue<Unit>} ${HoneyCssDimensionValue<Unit>}`
    : Tuple extends [unknown, unknown, unknown, unknown]
      ? `${HoneyCssDimensionValue<Unit>} ${HoneyCssDimensionValue<Unit>} ${HoneyCssDimensionValue<Unit>} ${HoneyCssDimensionValue<Unit>}`
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
export type HoneyCssMultiValue<T> = T | HoneyCssShorthandTuple<T>;

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
export type HoneyCssSpacingValue = HoneyCssMultiValue<number | HoneyCssDimensionValue>;

export type HoneyRawCssSpacingValue = number | HoneyCssDimensionValue | CSS.Globals;
