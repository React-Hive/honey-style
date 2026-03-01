import type { HoneyCssAstNode, HoneyCssAstStylesheetNode } from '@react-hive/honey-css';
import { toKebabCase } from '@react-hive/honey-utils';

import type { HoneyTheme } from '../types';
import { CSS_SPACING_PROPERTIES } from './constants';
import { resolveSpacingValue } from './resolve-spacing-value';

const KEBAB_CASE_SPACING_PROPERTIES = CSS_SPACING_PROPERTIES.map(toKebabCase);

interface CreateSpacingTransformerOptions {
  theme?: HoneyTheme;
}

export const createSpacingTransformer = ({ theme }: CreateSpacingTransformerOptions) => {
  const spacingFactor = theme?.spacings?.base ?? 0;

  const transformNodes = (nodes: HoneyCssAstNode[]): HoneyCssAstNode[] =>
    nodes.map(node => {
      if (node.type === 'rule') {
        return {
          ...node,
          body: transformNodes(node.body),
        };
      }

      if (node.type === 'atRule') {
        return {
          ...node,
          body: node.body === null ? null : transformNodes(node.body),
        };
      }

      if (node.type === 'declaration') {
        if (!KEBAB_CASE_SPACING_PROPERTIES.includes(node.prop)) {
          return node;
        }

        // Skip if contains parentheses (calc, var, etc.)
        if (/[()]/.test(node.value)) {
          return node;
        }

        const parts = node.value.trim().split(/\s+/);

        return {
          ...node,
          value: parts.map(part => resolveSpacingValue(part, spacingFactor)).join(' '),
        };
      }

      return node;
    });

  return (ast: HoneyCssAstStylesheetNode): HoneyCssAstStylesheetNode => ({
    ...ast,
    body: transformNodes(ast.body),
  });
};
