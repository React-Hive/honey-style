import {
  isArray,
  isFunction,
  isNilOrEmptyString,
  isObject,
  toKebabCase,
} from '@react-hive/honey-utils';
import * as CSS from 'csstype';

import { HONEY_STYLED_COMPONENT_ID_PROP } from '../constants';
import { isStyledComponent } from '../utils';
import { CSS_COLOR_PROPERTIES, CSS_SPACING_PROPERTIES } from './constants';
import type { HoneyCssColorProperty, HoneyCssSpacingProperty } from './types';
import type { HoneyStyledInterpolation, HoneyStyledContext } from '../types';

/**
 * Checks whether a CSS property is spacing-related.
 *
 * Spacing properties include margins, paddings, positional offsets,
 * and layout gaps, such as `margin`, `paddingLeft`, `top`, and `gap`.
 *
 * @param propertyName - The CSS property name to check.
 *
 * @returns Returns true if the property is spacing-related.
 */
export const isCssSpacingProperty = (
  propertyName: keyof CSS.Properties,
): propertyName is HoneyCssSpacingProperty =>
  CSS_SPACING_PROPERTIES.includes(propertyName as never);

/**
 * Checks whether a CSS property is color-related.
 *
 * Color properties include properties that directly define text, background,
 * border, outline, decoration, shadow, or SVG colors.
 *
 * @param propertyName - The CSS property name to check.
 *
 * @returns Returns true if the property is color-related.
 */
export const isCssColorProperty = (
  propertyName: keyof CSS.Properties,
): propertyName is HoneyCssColorProperty => CSS_COLOR_PROPERTIES.includes(propertyName as never);

const resolveCssInterpolation = <Props extends object>(
  value: HoneyStyledInterpolation<Props>,
  context: HoneyStyledContext<Props>,
): string => {
  if (value === false || isNilOrEmptyString(value)) {
    return '';
  }

  if (isFunction(value)) {
    if (isStyledComponent(value)) {
      return `.${value[HONEY_STYLED_COMPONENT_ID_PROP]}`;
    }

    return resolveCssInterpolation(value(context), context);
  }

  if (isArray(value)) {
    return value.map(v => resolveCssInterpolation(v, context)).join('\n');
  }

  if (isObject(value)) {
    return Object.entries(value)
      .filter(([, v]) => v !== undefined && v !== false)
      .map(([k, v]) => `${toKebabCase(k)}: ${v};`)
      .join('\n');
  }

  return value.toString?.() ?? '';
};

export const css = <Props extends object>(
  strings: TemplateStringsArray,
  ...interpolations: HoneyStyledInterpolation<Props>[]
) => {
  return (context: HoneyStyledContext<Props>) =>
    strings.reduce(
      (cssResult, str, index) =>
        cssResult + str + resolveCssInterpolation(interpolations[index], context),
      '',
    );
};

export const createCssRule = (selector: string, css: string) => `${selector}{${css}}`;
