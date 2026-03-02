import { parseCss } from '@react-hive/honey-css';

import type { HoneyTheme } from '../types';
import { createCssRule } from './css';
import { compileCss } from './compile-css';
import { transformAbsoluteFillAtRule } from './transform-absolute-fill-at-rule';
import { transformCenterAtRule } from './transform-center-at-rule';
import { transformStackAtRule } from './transform-stack-at-rule';
import { createSpacingTransformer } from './create-spacing-transformer';
import { transformEllipsisAtRule } from './transform-ellipsis-at-rule';
import { transformInlineAtRule } from './transform-inline-at-rule';
import { createMediaAtRuleTransformer } from './create-media-at-rule-transformer';

interface ProcessCssOptions {
  theme?: HoneyTheme;
  selector?: string;
}

export const processCss = (rawCss: string, { theme, selector }: ProcessCssOptions = {}): string => {
  const scopedCss = selector ? createCssRule(selector, rawCss) : rawCss;

  const ast = parseCss(scopedCss);

  const transformers = [
    transformStackAtRule,
    transformInlineAtRule,
    transformCenterAtRule,
    transformAbsoluteFillAtRule,
    transformEllipsisAtRule,
    createMediaAtRuleTransformer({ theme }),
    createSpacingTransformer({ theme }),
  ];

  const transformedAst = transformers.reduce((result, node) => node(result), ast);

  return compileCss(transformedAst);
};
