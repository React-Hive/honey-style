import type { HoneyCssColorProperty, HoneyCssSpacingProperty } from './types';

export const CSS_SPACING_PROPERTIES: readonly HoneyCssSpacingProperty[] = [
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
  'paddingBlock',
  'paddingBlockStart',
  'paddingBlockEnd',
  'top',
  'right',
  'bottom',
  'left',
  'inset',
  'gap',
  'rowGap',
  'columnGap',
];

export const CSS_COLOR_PROPERTIES: readonly HoneyCssColorProperty[] = [
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
