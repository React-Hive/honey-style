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
 * - A number without a unit, such as `'16'` (representing a unitless value).
 * - The special value `'auto'` commonly used for flexible layout values.
 *
 * @template Unit - The CSS unit to use (e.g., `'px'`, `'em'`, `'rem'`).
 */
export type HoneyCSSDimensionValue<Unit extends HoneyCSSDimensionUnit = HoneyCSSDimensionUnit> =
  | `${number}${Unit}`
  | `${number}`
  | 'auto';
