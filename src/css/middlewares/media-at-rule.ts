import { serialize } from 'stylis';

import type { HoneyBreakpoints, HoneyTheme } from '../../types';
import type {
  HoneyMediaQueryRule,
  MediaQueryRuleType,
  MediaQueryRuleOrientation,
} from '../at-rules';
import { __DEV__ } from '../../constants';
import { createAtRuleMiddleware } from './factory';
import { mediaQuery } from '../at-rules';
import { createCssRule, splitStylisChildren } from '../css';

type BreakpointDirection = 'up' | 'down';

/**
 * Determines whether token is breakpoint syntax:
 *   sm:up
 *   md:only
 *   lg
 */
const isBreakpointToken = (token: string): token is BreakpointDirection =>
  /^[a-z]+\b(:up|:down)?$/i.test(token);

/**
 * Orientation tokens:
 *   portrait
 *   landscape
 */
const isOrientationToken = (token: string): token is MediaQueryRuleOrientation =>
  token === 'portrait' || token === 'landscape';

/**
 * Media type tokens:
 *   screen
 *   print
 *   speech
 */
const isMediaTypeToken = (token: string): token is MediaQueryRuleType =>
  token === 'all' || token === 'print' || token === 'screen' || token === 'speech';

/**
 * Parses:
 *   sm:up
 *   md:down
 */
const parseBreakpointRule = (raw: string) => {
  const [key, direction] = raw.split(':');

  return {
    key,
    direction: (direction ?? 'up') as BreakpointDirection,
  };
};

interface CreateMediaAtRuleMiddlewareOptions {
  theme?: HoneyTheme;
}

export const createMediaAtRuleMiddleware = ({ theme }: CreateMediaAtRuleMiddlewareOptions) =>
  createAtRuleMiddleware({
    name: 'media',
    transform: (args, element, callback) => {
      const { parent } = element;

      if (!parent || !args.length || !theme?.breakpoints) {
        return null;
      }

      const childrenGroups = splitStylisChildren(element.children);

      if (!childrenGroups.declarations.length && !childrenGroups.other.length) {
        return null;
      }

      const mediaQueryRules: HoneyMediaQueryRule[] = [];

      let orientation: MediaQueryRuleOrientation;
      let mediaType: MediaQueryRuleType;

      for (const token of args) {
        if (isOrientationToken(token)) {
          orientation = token;
          continue;
        }

        if (isMediaTypeToken(token)) {
          mediaType = token;
          continue;
        }

        if (!isBreakpointToken(token)) {
          if (__DEV__) {
            console.warn(`[@react-hive/honey-style]: Unknown @honey-media token: "${token}".`);
          }
          continue;
        }

        const breakpointRule = parseBreakpointRule(token);

        const breakpointPx =
          breakpointRule.key in theme.breakpoints
            ? theme.breakpoints[breakpointRule.key as keyof HoneyBreakpoints]
            : null;

        if (!breakpointPx) {
          if (__DEV__) {
            console.warn(
              `[@react-hive/honey-style]: Unknown breakpoint "${breakpointRule.key}" in @honey-media.`,
            );
          }
          continue;
        }

        let mediaQueryRule: HoneyMediaQueryRule | undefined;

        if (breakpointRule.direction === 'up') {
          mediaQueryRule = {
            minWidth: `${breakpointPx}px`,
          };
        } else if (breakpointRule.direction === 'down') {
          mediaQueryRule = {
            maxWidth: `${breakpointPx}px`,
          };
        }

        if (mediaQueryRule) {
          mediaQueryRules.push(mediaQueryRule);
        }
      }

      if (!mediaQueryRules.length) {
        return null;
      }

      const finalMediaQueryRules = mediaQueryRules.map<HoneyMediaQueryRule>(rule => ({
        ...rule,
        orientation,
        mediaType,
      }));

      const nestedRulesCss =
        childrenGroups.other.length > 0
          ? `${parent.value}${serialize(childrenGroups.other, callback)}`
          : '';

      const declarationCss =
        childrenGroups.declarations.length > 0
          ? createCssRule(parent.value, serialize(childrenGroups.declarations, callback))
          : '';

      return createCssRule(mediaQuery(finalMediaQueryRules), `${nestedRulesCss}${declarationCss}`);
    },
  });
