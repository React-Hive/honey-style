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

/**
 * Represents CSS resolution units typically used in media queries.
 *
 * - `dpi` — dots per inch
 * - `dpcm` — dots per centimeter
 * - `dppx` — dots per pixel (e.g., 2dppx for Retina displays)
 * - `x` — alias for `dppx`
 */
type HoneyCSSResolutionUnit = 'dpi' | 'dpcm' | 'dppx' | 'x';

/**
 * Represents a CSS resolution value, such as `'300dpi'`, `'2x'`, or `'1.5dppx'`.
 */
type HoneyCSSResolutionValue = `${number}${HoneyCSSResolutionUnit}`;

/**
 * Properties for dimension-based media queries
 */
interface HoneyCSSMediaDimensionProperties {
  width?: HoneyCSSDimensionValue;
  minWidth?: HoneyCSSDimensionValue;
  maxWidth?: HoneyCSSDimensionValue;
  height?: HoneyCSSDimensionValue;
  minHeight?: HoneyCSSDimensionValue;
  maxHeight?: HoneyCSSDimensionValue;
}

/**
 * Properties for resolution-based media queries
 */
interface HoneyCSSMediaResolutionProperties {
  resolution?: HoneyCSSResolutionValue;
  minResolution?: HoneyCSSResolutionValue;
  maxResolution?: HoneyCSSResolutionValue;
}

type HoneyCSSMediaRuleOperator = 'not' | 'only';

type HoneyCSSMediaRuleType = 'all' | 'print' | 'screen' | 'speech';

/**
 * Represents the possible values for media query orientation.
 *
 * Used in responsive styles to target specific device orientations.
 *
 * - `'landscape'` – Width is greater than height.
 * - `'portrait'` – Height is greater than width.
 */
type HoneyCSSMediaOrientation = 'landscape' | 'portrait';

type HoneyCSSMediaRuleUpdate = 'none' | 'slow' | 'fast';

/**
 * Options for CSS @media at-rule.
 */
export interface HoneyCSSMediaRule
  extends HoneyCSSMediaDimensionProperties,
    HoneyCSSMediaResolutionProperties {
  operator?: HoneyCSSMediaRuleOperator;
  /**
   * @default screen
   */
  mediaType?: HoneyCSSMediaRuleType;
  orientation?: HoneyCSSMediaOrientation;
  update?: HoneyCSSMediaRuleUpdate;
}
