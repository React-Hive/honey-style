import { createAtRuleMiddleware } from './factory';
import type { CSSDeclaration } from './types';

interface CreateStackAtRuleMiddlewareOptions {
  /**
   * @default 0
   */
  spacingMultiplier?: number;
}

export const createStackAtRuleMiddleware = ({
  spacingMultiplier = 0,
}: CreateStackAtRuleMiddlewareOptions) =>
  createAtRuleMiddleware({
    name: 'stack',
    transform: args => {
      const declarations: CSSDeclaration[] = ['display:flex;', 'flex-direction:column;'];

      if (args?.length) {
        const isNumber = /^-?\d*\.?\d+$/.test(args[0]);
        const gap = isNumber ? `${parseFloat(args[0]) * spacingMultiplier}px` : args;

        declarations.push(`gap:${gap};`);
      }

      return declarations.join('');
    },
  });
