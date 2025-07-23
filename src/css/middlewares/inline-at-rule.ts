import { createAtRuleMiddleware } from './factory';
import type { CSSDeclaration } from './types';

interface CreateInlineAtRuleMiddlewareOptions {
  /**
   * @default 0
   */
  spacing?: number;
}

export const createInlineAtRuleMiddleware = ({
  spacing = 0,
}: CreateInlineAtRuleMiddlewareOptions = {}) =>
  createAtRuleMiddleware({
    name: 'inline',
    transform: args => {
      const declarations: CSSDeclaration[] = ['display:flex;', 'align-items:center;'];

      if (args?.length) {
        const isNumber = /^-?\d*\.?\d+$/.test(args[0]);
        const gap = isNumber ? `${parseFloat(args[0]) * spacing}px` : args;

        declarations.push(`gap:${gap};`);
      }

      return declarations.join('');
    },
  });
