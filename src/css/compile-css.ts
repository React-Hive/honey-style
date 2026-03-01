import type { HoneyCssAstNode, HoneyCssAstStylesheetNode } from '@react-hive/honey-css';
import { resolveCssSelector, stringifyCss } from '@react-hive/honey-css';

import { flattenCssRules } from './flatten-css-rules';

const SCOPED_AT_RULES: Record<string, true> = {
  media: true,
  supports: true,
  container: true,
  layer: true,
};

const scopeNodes = (nodes: HoneyCssAstNode[], scope: string): HoneyCssAstNode[] =>
  nodes.map(node => {
    if (node.type === 'rule') {
      return {
        ...node,
        selector: resolveCssSelector(node.selector, scope),
      };
    }

    if (node.type === 'atRule') {
      if (!SCOPED_AT_RULES[node.name]) {
        return node;
      }

      return {
        ...node,
        body: node.body === null ? null : scopeNodes(node.body, scope),
      };
    }

    return node;
  });

export const compileCss = (ast: HoneyCssAstStylesheetNode, scope?: string): string => {
  const nextAst = flattenCssRules(
    scope
      ? {
          ...ast,
          body: scopeNodes(ast.body, scope),
        }
      : ast,
  );

  return stringifyCss(nextAst);
};
