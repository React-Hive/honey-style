import type { CSSDeclaration } from './types';
import { createAtRuleMiddleware } from './factory';
import { createCssRule, getChildrenCss } from '../css';

export const createEllipsisAtRuleMiddleware = () =>
  createAtRuleMiddleware({
    name: 'ellipsis',
    transform: (args, element, callback) => {
      const { parent } = element;
      if (!parent) {
        return null;
      }

      const declarations: CSSDeclaration[] = [
        'white-space:nowrap;',
        'overflow:hidden;',
        'text-overflow:ellipsis;',
      ];

      const childrenCss = getChildrenCss(element, callback);

      return createCssRule(parent.value, `${declarations.join('')}${childrenCss}`);
    },
  });
