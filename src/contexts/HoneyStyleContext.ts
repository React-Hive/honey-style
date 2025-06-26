import { createContext } from 'react';

import type {
  Nullable,
  HoneyTheme,
  HoneyColorKey,
  HoneyCSSColor,
  HoneyCSSDimensionUnit,
  HoneyCSSDimensionValue,
  HoneyCSSSpacingValue,
  HoneyDimensionName,
  HoneyFontName,
  HoneySpacings,
  HoneyStyledInterpolation,
} from '../types';
import type { HoneyResolveSpacingResult } from '../utils';

export interface HoneyStyleContextValue {
  /**
   * Represents the theme object.
   */
  theme: HoneyTheme;
  /**
   * Function to resolve spacing values based on a given theme.
   *
   * @template Value - A type representing the spacing value(s), which could be a single value or an array of values.
   * @template Unit - The CSS unit used for the resolved spacing value, e.g., 'px', 'em'.
   *
   * @param value - The spacing value(s) to be applied, which could be a single number or an array of numbers.
   * @param [unit] - The CSS unit to use for the calculated value. Defaults to 'px'.
   * @param [type] - The type of spacing to use from the theme (e.g., 'base', 'small', 'large').
   *
   * @returns The resolved spacing value, formatted as a string with the appropriate unit.
   */
  resolveSpacing: <
    Value extends HoneyCSSSpacingValue,
    Unit extends Nullable<HoneyCSSDimensionUnit> = 'px',
  >(
    value: Value,
    unit?: Unit,
    type?: keyof HoneySpacings,
  ) => HoneyResolveSpacingResult<Value, Unit>;
  /**
   * Function to resolve color values based on the theme.
   *
   * @param colorKey - The key representing the color in the theme.
   * @param [alpha] - Optional alpha value to apply to the color for transparency.
   *
   * @returns The resolved CSS color, optionally with alpha transparency.
   */
  resolveColor: (colorKey: HoneyColorKey, alpha?: number) => HoneyCSSColor;
  /**
   * Function to resolve font styles based on the theme.
   *
   * @param fontName - The name of the font to resolve from the theme.
   *
   * @returns The CSS style rules for the specified font.
   */
  resolveFont: (fontName: HoneyFontName) => HoneyStyledInterpolation<object>;
  /**
   * Function to resolve dimension values based on the theme.
   *
   * @param dimensionName - The name of the dimension to resolve from the theme.
   *
   * @returns The resolved CSS dimension value (e.g., width, height).
   */
  resolveDimension: (dimensionName: HoneyDimensionName) => HoneyCSSDimensionValue;
}

export const HoneyStyleContext = createContext<HoneyStyleContextValue | undefined>(undefined);
