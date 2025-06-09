import { HONEY_STYLED_COMPONENT_ID_PROP } from './constants';
import { isFunction, isNil, isObject, isStyledComponent, toKebabCase } from './utils';
import type { HoneyStyledInterpolation, HoneyStyledContext } from './types';

const resolveCssInterpolation = <Props extends object>(
  value: HoneyStyledInterpolation<Props>,
  context: HoneyStyledContext<Props>,
): string => {
  if (value === '' || value === false || isNil(value)) {
    return '';
  }

  if (isFunction(value)) {
    if (isStyledComponent(value)) {
      return `.${value[HONEY_STYLED_COMPONENT_ID_PROP]}`;
    }

    return resolveCssInterpolation(value(context), context);
  }

  if (Array.isArray(value)) {
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
