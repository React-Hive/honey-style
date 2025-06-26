import type { HoneyCSSColorProperty, HoneyCSSSpacingProperty } from './types';

export const CSS_SPACING_PROPERTIES: readonly HoneyCSSSpacingProperty[] = [
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'top',
  'right',
  'bottom',
  'left',
  'gap',
  'rowGap',
  'columnGap',
];

export const CSS_COLOR_PROPERTIES: readonly HoneyCSSColorProperty[] = [
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'outlineColor',
  'textDecorationColor',
  'fill',
  'stroke',
];
