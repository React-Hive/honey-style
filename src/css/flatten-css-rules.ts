import type {
  HoneyCssAstNode,
  HoneyCssAstRuleNode,
  HoneyCssAstStylesheetNode,
} from '@react-hive/honey-css';
import { resolveCssSelector } from '@react-hive/honey-css';

const SELECTOR_CONTEXT_AT_RULES: Record<string, true> = {
  media: true,
  supports: true,
  container: true,
  layer: true,
};

const flattenRule = (node: HoneyCssAstRuleNode, parentSelector?: string): HoneyCssAstNode[] => {
  const fullSelector = parentSelector
    ? resolveCssSelector(node.selector, parentSelector)
    : node.selector;

  return flattenNodes(node.body, fullSelector);
};

const flattenNodes = (nodes: HoneyCssAstNode[], parentSelector?: string): HoneyCssAstNode[] => {
  const result: HoneyCssAstNode[] = [];

  const declarationBuffer: HoneyCssAstNode[] = [];

  const flushDeclarations = () => {
    if (!parentSelector || declarationBuffer.length === 0) {
      return;
    }

    result.push({
      type: 'rule',
      selector: parentSelector,
      // Cheaper intent clarity
      body: declarationBuffer.slice(),
    });

    declarationBuffer.length = 0;
  };

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.type === 'declaration') {
      declarationBuffer.push(node);
      continue;
    }

    if (node.type === 'rule') {
      flushDeclarations();

      result.push(...flattenRule(node, parentSelector));
      continue;
    }

    if (node.type === 'atRule') {
      flushDeclarations();

      if (!SELECTOR_CONTEXT_AT_RULES[node.name]) {
        result.push(node);
        continue;
      }

      result.push({
        ...node,
        body:
          node.body && node.body.length > 0 ? flattenNodes(node.body, parentSelector) : node.body,
      });

      continue;
    }

    flushDeclarations();

    result.push(node);
  }

  flushDeclarations();

  return result;
};

export const flattenCssRules = (ast: HoneyCssAstStylesheetNode): HoneyCssAstStylesheetNode => ({
  ...ast,
  body: flattenNodes(ast.body),
});
