import { HoneyCSSDimensionValue } from '../types';

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
