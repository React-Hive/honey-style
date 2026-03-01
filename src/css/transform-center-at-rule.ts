import type {
  HoneyCssAstAtRuleNode,
  HoneyCssAstDeclarationNode,
  HoneyCssAstNode,
} from '@react-hive/honey-css';

import { createAtRuleTransformer } from './create-at-rule-transformer';
import { unwrapParams } from './unwrap-params';

/**
 * Transforms:
 *
 * @honey-center();
 * @honey-center(horizontal);
 * @honey-center(vertical);
 * @honey-center(block);
 * @honey-center(inline);
 */
export const transformCenterAtRule = createAtRuleTransformer(
  'honey-center',
  (node: HoneyCssAstAtRuleNode): HoneyCssAstNode[] => {
    const params = unwrapParams(node.params);

    const nodes: HoneyCssAstDeclarationNode[] = [];

    switch (params) {
      case 'horizontal':
      case 'x':
        nodes.push(
          {
            type: 'declaration',
            prop: 'display',
            value: 'flex',
          },
          {
            type: 'declaration',
            prop: 'justify-content',
            value: 'center',
          },
        );
        break;

      case 'vertical':
      case 'y':
        nodes.push(
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
        );
        break;

      case 'block':
        nodes.push(
          {
            type: 'declaration',
            prop: 'display',
            value: 'block',
          },
          {
            type: 'declaration',
            prop: 'text-align',
            value: 'center',
          },
        );
        break;

      case 'inline':
        nodes.push(
          {
            type: 'declaration',
            prop: 'display',
            value: 'inline-flex',
          },
          {
            type: 'declaration',
            prop: 'align-items',
            value: 'center',
          },
          {
            type: 'declaration',
            prop: 'justify-content',
            value: 'center',
          },
        );
        break;

      default:
        nodes.push(
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
          {
            type: 'declaration',
            prop: 'justify-content',
            value: 'center',
          },
        );
        break;
    }

    return [...nodes, ...(node.body ?? [])];
  },
);
