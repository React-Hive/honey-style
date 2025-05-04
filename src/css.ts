import type { HoneyStyledInterpolation, HoneyStyledContext } from './types';

const toKebabCase = (str: string): string =>
  str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const resolveCssInterpolation = <Props extends object>(
  interpolation: HoneyStyledInterpolation<Props>,
  context: HoneyStyledContext<Props>,
): string => {
  if (typeof interpolation === 'function') {
    if ('$$ComponentId' in interpolation) {
      return `.${interpolation.$$ComponentId}`;
    }

    return resolveCssInterpolation(interpolation(context), context);
  }

  if (Array.isArray(interpolation)) {
    return interpolation.map(v => resolveCssInterpolation(v, context)).join('\n');
  }

  if (interpolation && typeof interpolation === 'object') {
    return Object.entries(interpolation)
      .filter(([, v]) => v !== undefined && v !== false)
      .map(([k, v]) => `${toKebabCase(k)}: ${v};`)
      .join('\n');
  }

  return interpolation?.toString?.() ?? '';
};

export const css = <Props extends object>(
  strings: TemplateStringsArray,
  ...interpolations: HoneyStyledInterpolation<Props>[]
) => {
  return (context: HoneyStyledContext<Props>) =>
    strings.reduce((cssResult, str, index) => {
      const interpolation = interpolations[index];

      if (
        interpolation === '' ||
        interpolation === false ||
        interpolation === undefined ||
        interpolation === null
      ) {
        return cssResult + str;
      }

      return cssResult + str + resolveCssInterpolation(interpolation, context);
    }, '');
};
