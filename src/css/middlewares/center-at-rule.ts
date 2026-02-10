import type { CSSDeclaration } from './types';
import { createAtRuleMiddleware } from './factory';
import { createCssRule, getChildrenCss } from '../css';

export const createCenterAtRuleMiddleware = () =>
  createAtRuleMiddleware({
    name: 'center',
    transform: (args, element, callback) => {
      const { parent } = element;
      if (!parent) {
        return null;
      }

      const declarations: CSSDeclaration[] = [];

      switch (args[0]) {
        case 'horizontal':
        case 'x':
          declarations.push('display:flex;', 'justify-content:center;');
          break;
        case 'vertical':
        case 'y':
          declarations.push('display:flex;', 'align-items:center;');
          break;
        case 'block':
          declarations.push('display:block;', 'text-align:center;');
          break;
        case 'inline':
          declarations.push(
            'display:inline-flex;',
            'align-items:center;',
            'justify-content:center;',
          );
          break;
        default:
          declarations.push('display:flex;', 'align-items:center;', 'justify-content:center;');
          break;
      }

      const childrenCss = getChildrenCss(element, callback);

      return createCssRule(parent.value, `${declarations.join('')}${childrenCss}`);
    },
  });
