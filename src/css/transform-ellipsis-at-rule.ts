import type {
  HoneyCssAstAtRuleNode,
  HoneyCssAstDeclarationNode,
  HoneyCssAstNode,
} from '@react-hive/honey-css';

import { createAtRuleTransformer } from './create-at-rule-transformer';

export const transformEllipsisAtRule = createAtRuleTransformer(
  'honey-ellipsis',
  (node: HoneyCssAstAtRuleNode): HoneyCssAstNode[] => {
    const nodes: HoneyCssAstDeclarationNode[] = [
      {
        type: 'declaration',
        prop: 'white-space',
        value: 'nowrap',
      },
      {
        type: 'declaration',
        prop: 'overflow',
        value: 'hidden',
      },
      {
        type: 'declaration',
        prop: 'text-overflow',
        value: 'ellipsis',
      },
    ];

    // Preserve any nested children inside the block
    return [...nodes, ...(node.body ?? [])];
  },
);
