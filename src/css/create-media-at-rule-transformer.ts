import type { HoneyCssAstAtRuleNode, HoneyCssAstNode } from '@react-hive/honey-css';

import type { HoneyBreakpoints, HoneyTheme, Nullable } from '../types';
import type {
  HoneyMediaQueryRule,
  MediaQueryRuleOrientation,
  MediaQueryRuleType,
} from './at-rules';
import { __DEV__ } from '../constants';
import { createAtRuleTransformer } from './create-at-rule-transformer';
import { unwrapParams } from './unwrap-params';
import { mediaQuery } from './at-rules';

type BreakpointDirection = 'up' | 'down';

interface CreateMediaAtRuleTransformerOptions {
  theme?: HoneyTheme;
}

const isOrientationToken = (token: string): token is MediaQueryRuleOrientation =>
  token === 'portrait' || token === 'landscape';

const isMediaTypeToken = (token: string): token is MediaQueryRuleType =>
  token === 'all' || token === 'print' || token === 'screen' || token === 'speech';

const isBreakpointToken = (token: string): boolean => /^[a-z]+\b(:up|:down)?$/i.test(token);

const parseBreakpointRule = (raw: string) => {
  const [key, direction] = raw.split(':');
  return {
    key,
    direction: (direction ?? 'up') as BreakpointDirection,
  };
};

export const createMediaAtRuleTransformer = ({ theme }: CreateMediaAtRuleTransformerOptions) =>
  createAtRuleTransformer('honey-media', (node: HoneyCssAstAtRuleNode): HoneyCssAstNode[] => {
    if (!theme?.breakpoints) {
      return [];
    }

    const rawParams = unwrapParams(node.params);
    if (!rawParams) {
      return [];
    }

    const tokens = rawParams.split(/\s+/);

    let orientation: Nullable<MediaQueryRuleOrientation> = null;
    let mediaType: Nullable<MediaQueryRuleType> = null;

    const rules: HoneyMediaQueryRule[] = [];

    for (const token of tokens) {
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

      let rule: HoneyMediaQueryRule | undefined;

      if (breakpointRule.direction === 'up') {
        rule = {
          minWidth: `${breakpointPx}px`,
        };
      } else if (breakpointRule.direction === 'down') {
        rule = {
          maxWidth: `${breakpointPx}px`,
        };
      }

      if (rule) {
        rules.push(rule);
      }
    }

    let finalRules: HoneyMediaQueryRule[] = [];

    if (rules.length) {
      finalRules = rules.map<HoneyMediaQueryRule>(rule => ({
        ...rule,
        orientation,
        mediaType,
      }));
    } else {
      if (mediaType) {
        finalRules.push({
          mediaType,
        });
      }

      if (orientation) {
        finalRules.push({
          orientation,
        });
      }
    }

    if (!finalRules.length) {
      return [];
    }

    const fullMedia = mediaQuery(finalRules);

    return [
      {
        type: 'atRule',
        name: 'media',
        params: fullMedia.replace(/^@media\s*/, ''),
        body: node.body,
      },
    ];
  });
