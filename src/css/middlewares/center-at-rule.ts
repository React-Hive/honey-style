import { createAtRuleMiddleware } from './factory';
import type { CSSDeclaration } from './types';

export const createCenterAtRuleMiddleware = () =>
  createAtRuleMiddleware({
    name: 'center',
    transform: (args = []) => {
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

      return declarations.join('');
    },
  });
