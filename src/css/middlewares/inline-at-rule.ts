import { createAtRuleMiddleware } from './factory';
import type { CSSDeclaration } from './types';

interface CreateInlineAtRuleMiddlewareOptions {
  /**
   * @default 0
   */
  spacingMultiplier?: number;
}

export const createInlineAtRuleMiddleware = ({
  spacingMultiplier = 0,
}: CreateInlineAtRuleMiddlewareOptions = {}) =>
  createAtRuleMiddleware({
    name: 'inline',
    transform: args => {
      const declarations: CSSDeclaration[] = ['display:flex;', 'align-items:center;'];

      if (args) {
        const isNumber = /^-?\d*\.?\d+$/.test(args);
        const gap = isNumber ? `${parseFloat(args) * spacingMultiplier}px` : args;

        declarations.push(`gap:${gap};`);
      }

      return declarations.join('');
    },
  });
