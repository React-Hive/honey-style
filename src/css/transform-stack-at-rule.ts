import type { HoneyCssAstDeclarationNode } from '@react-hive/honey-css';

import { createAtRuleTransformer } from './create-at-rule-transformer';
import { unwrapParams } from './unwrap-params';

export const transformStackAtRule = createAtRuleTransformer('honey-stack', node => {
  const param = unwrapParams(node.params);

  const nodes: HoneyCssAstDeclarationNode[] = [
    {
      type: 'declaration',
      prop: 'display',
      value: 'flex',
    },
    {
      type: 'declaration',
      prop: 'flex-direction',
      value: 'column',
    },
  ];

  // If param provided → override gap explicitly
  if (param) {
    nodes.push({
      type: 'declaration',
      prop: 'gap',
      value: param,
    });
  }

  return [...nodes, ...(node.body ?? [])];
});
