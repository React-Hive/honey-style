import { createAtRuleMiddleware } from './factory';
import type { CSSDeclaration } from './types';

export const createAbsoluteFillAtRuleMiddleware = () =>
  createAtRuleMiddleware({
    name: 'absolute-fill',
    transform: () => {
      const declarations: CSSDeclaration[] = ['position:absolute;', 'inset:0;'];

      return declarations.join('');
    },
  });
