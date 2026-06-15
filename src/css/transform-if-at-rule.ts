import type { HoneyCssAstAtRuleNode, HoneyCssAstNode } from '@react-hive/honey-css';

import { createAtRuleTransformer } from './create-at-rule-transformer';
import { unwrapParams } from './unwrap-params';

const isTruthyParam = (param: string): boolean =>
  param !== '' && param !== 'false' && param !== '0';

/**
 * Transforms:
 *
 * @honey-if (true) {
 *   color: red;
 * }
 *
 * @honey-if (false) {
 *   color: red;
 * }
 */
export const transformIfAtRule = createAtRuleTransformer(
  'honey-if',
  (node: HoneyCssAstAtRuleNode): HoneyCssAstNode[] => {
    const param = unwrapParams(node.params);

    if (!param || !isTruthyParam(param)) {
      return [];
    }

    return node.body ?? [];
  },
);
