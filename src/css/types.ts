import * as CSS from 'csstype';

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
