import type { Middleware, Element } from 'stylis';
import {
  isArray,
  isFunction,
  isNilOrEmptyString,
  isObject,
  toKebabCase,
} from '@react-hive/honey-utils';
import { serialize } from 'stylis';

import type { HoneyStyledInterpolation, HoneyStyledContext } from '../types';
import { HONEY_STYLED_COMPONENT_ID_PROP } from '../constants';
import { isStyledComponent } from '../utils';

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

export const getChildrenCss = (element: Element, callback: Middleware): string =>
  isArray(element.children) ? serialize(element.children, callback) : element.children;

interface StylisChildrenGroups {
  pseudoRules: Element[];
  otherRules: Element[];
}

/**
 * Splits Stylis children into:
 *
 * - pseudoRules: rules that start with a pseudo selector (e.g. ":hover", ":not(...)")
 * - otherRules: everything else
 */
export const splitStylisChildren = (children: string | Element[]): StylisChildrenGroups => {
  if (!isArray(children) || children.length === 0) {
    return {
      pseudoRules: [],
      otherRules: [],
    };
  }

  return children.reduce<StylisChildrenGroups>(
    (groups, child) => {
      const isPseudoRule = child.value.startsWith('&');

      if (isPseudoRule) {
        groups.pseudoRules.push(child);
      } else {
        groups.otherRules.push(child);
      }

      return groups;
    },
    {
      pseudoRules: [],
      otherRules: [],
    },
  );
};
