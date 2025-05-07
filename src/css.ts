import { toKebabCase } from './utils';
import type { HoneyStyledInterpolation, HoneyStyledContext } from './types';

const resolveCssInterpolation = <Props extends object>(
  value: HoneyStyledInterpolation<Props>,
  context: HoneyStyledContext<Props>,
): string => {
  if (value === '' || value === false || value === undefined || value === null) {
    return '';
  }

  if (typeof value === 'function') {
    if ('$$ComponentId' in value) {
      return `.${value.$$ComponentId}`;
    }

    return resolveCssInterpolation(value(context), context);
  }

  if (Array.isArray(value)) {
    return value.map(v => resolveCssInterpolation(v, context)).join('\n');
  }

  if (value && typeof value === 'object') {
    return Object.entries(value)
      .filter(([, v]) => v !== undefined && v !== false)
      .map(([k, v]) => `${toKebabCase(k)}: ${v};`)
      .join('\n');
  }

  return value?.toString?.() ?? '';
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
