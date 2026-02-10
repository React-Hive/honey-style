import { createAtRuleMiddleware } from './factory';
import type { CSSDeclaration } from './types';
import { createCssRule, getChildrenCss } from '../css';

export const createAbsoluteFillAtRuleMiddleware = () =>
  createAtRuleMiddleware({
    name: 'absolute-fill',
    transform: (args, element, callback) => {
      const { parent } = element;
      if (!parent) {
        return null;
      }

      const declarations: CSSDeclaration[] = ['position:absolute;', 'inset:0;'];

      const childrenCss = getChildrenCss(element, callback);

      return createCssRule(parent.value, `${declarations.join('')}${childrenCss}`);
    },
  });
