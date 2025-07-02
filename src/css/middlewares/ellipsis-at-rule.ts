import { createAtRuleMiddleware } from './factory';
import type { CSSDeclaration } from './types';

export const createEllipsisAtRuleMiddleware = () =>
  createAtRuleMiddleware({
    name: 'ellipsis',
    transform: () => {
      const declarations: CSSDeclaration[] = [
        'white-space:nowrap;',
        'overflow:hidden;',
        'text-overflow:ellipsis;',
      ];

      return declarations.join('');
    },
  });
