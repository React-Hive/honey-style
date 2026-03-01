import { createAtRuleTransformer } from './create-at-rule-transformer';

export const transformAbsoluteFillAtRule = createAtRuleTransformer('honey-absolute-fill', node => {
  return [
    {
      type: 'declaration',
      prop: 'position',
      value: 'absolute',
    },
    {
      type: 'declaration',
      prop: 'inset',
      value: '0',
    },
    ...(node.body ?? []),
  ];
});
