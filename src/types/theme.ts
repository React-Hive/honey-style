import * as CSS from 'csstype';
import type { ElementType } from 'react';

import { HONEY_STYLED_COMPONENT_ID_PROP } from '../constants';
import type { HoneyCSSColor, HoneyCSSDimensionUnit } from '../css';

/**
 * Creates a new type by omitting the specified keys `U` from the object type `T`.
 *
 * This is a faster and simpler alternative to TypeScript's built-in `Omit<T, U>`
 * when you don't need support for more complex scenarios like union distributions.
 *
 * @example
 * ```ts
 * type User = {
 *   id: number;
 *   name: string;
 *   password: string;
 * };
 *
 * type PublicUser = FastOmit<User, 'password'>;
 * // Result: { id: number; name: string }
 * ```
 *
 * @template T - The original object type.
 * @template U - The keys to remove from `T`.
 */
export type FastOmit<T extends object, U extends string | number | symbol> = {
  [K in keyof T as K extends U ? never : K]: T[K];
};

/**
 * Creates a new object type by replacing properties in `A` with properties from `B`
 * where the keys overlap.
 *
 * This is useful for modifying existing types—for example, changing the type of a specific field
 * without redefining the entire structure.
 *
 * Internally, it removes keys from `A` that exist in `B`, then merges in `B`.
 *
 * @example
 * ```ts
 * type Original = {
 *   id: number;
 *   name: string;
 * };
 *
 * type Replacements = {
 *   name: boolean;
 * };
 *
 * type Modified = Override<Original, Replacements>;
 * // Result: { id: number; name: boolean }
 * ```
 *
 * @template A - The base object type.
 * @template B - The object type with properties to override in `A`.
 */
export type Override<A extends object, B extends object> = FastOmit<A, keyof B> & B;

export type HoneyHTMLDataAttributes = {
  [key: `data-${string}`]: string | number;
};

/**
 * Defines different spacing sizes available in the theme.
 */
export interface HoneySpacings {
  /**
   * The base spacing value in pixels.
   */
  base: number;
  // Additional spacing sizes
  small?: number;
  medium?: number;
  large?: number;
}

/**
 * Represents the breakpoints configuration in pixes for a responsive layout.
 *
 * Notes:
 * - `xs`: Extra small devices
 * - `sm`: Small devices
 * - `md`: Medium devices
 * - `lg`: Large devices
 * - `xl`: Extra large devices
 */
export interface HoneyBreakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export type HoneyBreakpointName = keyof HoneyBreakpoints;

export interface HoneyFont {
  size: number;
  family?: string;
  weight?: number;
  lineHeight?: number;
  letterSpacing?: number;
}

/**
 * Example of augmenting the fonts interface.
 *
 * @example
 * ```ts
 * declare module '@react-hive/honey-style' {
 *  export interface HoneyFonts {
 *    body: HoneyFont;
 *    caption: HoneyFont;
 *  }
 * }
 * ```
 */
export interface HoneyFonts {
  [key: string]: HoneyFont;
}

export type HoneyFontName = keyof HoneyFonts;

/**
 * Defines the color palette used in the theme.
 */
interface BaseHoneyColors {
  /**
   * Used for elements that require high visibility and emphasis, such as primary buttons, call-to-action elements,
   * and important elements like headers or titles.
   */
  primary: Record<string, HoneyCSSColor>;
  /**
   * Used to complement the primary color and add visual interest.
   * Often used for secondary buttons, borders, and decorative elements to provide contrast and balance within the design.
   * Helps create a cohesive visual hierarchy by providing variation in color tones.
   */
  secondary: Record<string, HoneyCSSColor>;
  /**
   * Used to draw attention to specific elements or interactions.
   * Often applied to interactive elements like links, icons, or tooltips to indicate their interactive nature.
   * Can be used sparingly to highlight important information or to create visual focal points.
   */
  accent: Record<string, HoneyCSSColor>;
  /**
   * Used for backgrounds, text, and other elements where a subtle, non-distracting color is desired.
   * Provides a versatile palette for elements like backgrounds, borders, text, and icons, allowing other colors to stand
   * out more prominently. Helps maintain balance and readability without overwhelming the user with too much color.
   */
  neutral: Record<string, HoneyCSSColor>;
  /**
   * Used to indicate successful or positive actions or states.
   * Often applied to elements like success messages, notifications, or icons to convey successful completion of tasks or operations.
   * Provides visual feedback to users to indicate that their actions were successful.
   */
  success: Record<string, HoneyCSSColor>;
  /**
   * Used to indicate cautionary or potentially risky situations.
   * Applied to elements like warning messages, alerts, or icons to notify users about potential issues or actions that require attention.
   * Helps users recognize and address potential problems or risks before they escalate.
   */
  warning: Record<string, HoneyCSSColor>;
  /**
   * Used to indicate errors, critical issues, or potentially destructive actions.
   * Applied to elements like error messages, validation indicators, form fields, or delete buttons to alert users about incorrect input,
   * system errors, or actions that may have irreversible consequences. Provides visual feedback to prompt users to
   * take corrective actions or seek assistance when encountering errors or potentially risky actions.
   */
  error: Record<string, HoneyCSSColor>;
}

/**
 * Example of augmenting the colors interface.
 *
 * @example
 * ```ts
 * declare module '@react-hive/honey-style' {
 *  export interface HoneyColors {
 *    neutral: Record<'charcoalDark' | 'charcoalGray' | 'crimsonRed', HoneyCSSColor>;
 *  }
 * }
 * ```
 */
export interface HoneyColors extends BaseHoneyColors {}

/**
 * Generates a union of all possible color keys by combining each property of `HoneyColors` with its corresponding keys.
 *
 * This type iterates over each key in the `HoneyColors` interface and creates a string template,
 * which combines the color type with each of its keys. The result is a union of all possible color keys.
 *
 * @example
 *
 * Given the `HoneyColors` interface:
 * ```ts
 * interface HoneyColors {
 *   primary: Record<'blue' | 'green', HoneyCSSColor>;
 *   neutral: Record<'charcoalDark' | 'charcoalGray' | 'crimsonRed', HoneyCSSColor>;
 * }
 * ```
 *
 * The resulting `HoneyColorKey` type will be:
 * ```ts
 * type HoneyColorKey = 'neutral.charcoalDark' | 'neutral.charcoalGray' | 'neutral.crimsonRed' | 'primary.blue' | 'primary.green';
 * ```
 */
export type HoneyColorKey = {
  [ColorType in keyof HoneyColors]: `${ColorType}.${keyof HoneyColors[ColorType] & string}`;
}[keyof HoneyColors];

export type HoneyColor = HoneyCSSColor | HoneyColorKey;

export interface HoneyContainer {
  /**
   * Max container width in any CSS distance value.
   */
  maxWidth: `${number}${HoneyCSSDimensionUnit}`;
}

export type HoneyDimensionValue = `${number}${HoneyCSSDimensionUnit}`;

/**
 * Represents a map of dimension names to CSS distance values.
 */
export interface HoneyDimensions {
  [key: string]: HoneyDimensionValue;
}

export type HoneyDimensionName = keyof HoneyDimensions;

/**
 * Represents the theme configuration.
 */
export interface BaseHoneyTheme {
  /**
   * Breakpoints for responsive design, where keys are breakpoint names and values are breakpoint values.
   */
  breakpoints: Partial<HoneyBreakpoints>;
  /**
   * Configuration for the container.
   */
  container: Partial<HoneyContainer>;
  /**
   * Spacing values used throughout the theme.
   */
  spacings: HoneySpacings;
  /**
   * Font settings used throughout the theme.
   */
  fonts: HoneyFonts;
  /**
   * Color palette used throughout the theme.
   */
  colors: HoneyColors;
  /**
   * Dimension values used throughout the theme.
   */
  dimensions: HoneyDimensions;
}

export interface HoneyTheme extends BaseHoneyTheme {}

export type HoneyStyledPropsWithAs<Element extends ElementType, Props extends object> = {
  as?: Element;
} & Props;

type HoneyInternalStyledComponent = {
  [HONEY_STYLED_COMPONENT_ID_PROP]: string;
};

export interface HoneyStyledComponent extends HoneyInternalStyledComponent {
  displayName?: string;
}

export type HoneyStyledContext<Props extends object> = {
  theme: HoneyTheme;
} & Props;

type HoneyStyledInterpolationCSSProps = {
  [K in keyof CSS.Properties]?: CSS.Properties[K] | null | false | undefined;
};

export type HoneyStyledFunction<Props extends object> = (
  context: HoneyStyledContext<Props>,
) => HoneyStyledInterpolation<Props>;

export type HoneyStyledInterpolation<Props extends object> =
  | string
  | number
  | boolean
  | null
  | undefined
  | HoneyStyledComponent
  | HoneyStyledInterpolationCSSProps
  | HoneyStyledFunction<Props>
  | HoneyStyledInterpolation<Props>[];
