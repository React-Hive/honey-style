import type { HoneyCssAstDeclarationNode } from '@react-hive/honey-css';

import { createAtRuleTransformer } from './create-at-rule-transformer';
import { unwrapParams } from './unwrap-params';

export const transformInlineAtRule = createAtRuleTransformer('honey-inline', node => {
  const param = unwrapParams(node.params);

  const nodes: HoneyCssAstDeclarationNode[] = [
    {
      type: 'declaration',
      prop: 'display',
      value: 'flex',
    },
    {
      type: 'declaration',
      prop: 'align-items',
      value: 'center',
    },
  ];

  if (param) {
    nodes.push({
      type: 'declaration',
      prop: 'gap',
      value: param,
    });
  }

  return [...nodes, ...(node.body ?? [])];
});
