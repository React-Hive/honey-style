import type {
  HoneyCssAstAtRuleNode,
  HoneyCssAstNode,
  HoneyCssAstStylesheetNode,
} from '@react-hive/honey-css';

export const createAtRuleTransformer = (
  name: string,
  handler: (node: HoneyCssAstAtRuleNode) => HoneyCssAstNode[],
) => {
  return (ast: HoneyCssAstStylesheetNode): HoneyCssAstStylesheetNode => {
    const transformNodes = (nodes: HoneyCssAstNode[]): HoneyCssAstNode[] => {
      const result: HoneyCssAstNode[] = [];

      for (const node of nodes) {
        if (node.type === 'atRule' && node.name === name) {
          const transformedBody = transformNodes(node.body ?? []);

          const replaced = handler({
            ...node,
            body: transformedBody,
          });

          result.push(...replaced);
          continue;
        }

        if (node.type === 'rule') {
          result.push({
            ...node,
            body: transformNodes(node.body),
          });
          continue;
        }

        if (node.type === 'atRule') {
          result.push({
            ...node,
            body: node.body === null ? null : transformNodes(node.body),
          });
          continue;
        }

        result.push(node);
      }

      return result;
    };

    return {
      ...ast,
      body: transformNodes(ast.body),
    };
  };
};
