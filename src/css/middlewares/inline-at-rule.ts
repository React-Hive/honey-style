import type { HoneyTheme } from '../../types';
import type { CSSDeclaration } from './types';
import { createAtRuleMiddleware } from './factory';
import { createCssRule, getChildrenCss } from '../css';

interface CreateInlineAtRuleMiddlewareOptions {
  theme?: HoneyTheme;
}

export const createInlineAtRuleMiddleware = ({ theme }: CreateInlineAtRuleMiddlewareOptions = {}) =>
  createAtRuleMiddleware({
    name: 'inline',
    transform: (args, element, callback) => {
      const { parent } = element;
      if (!parent) {
        return null;
      }

      const declarations: CSSDeclaration[] = ['display:flex;', 'align-items:center;'];

      if (args.length) {
        const spacing = theme?.spacings.base ?? 0;

        const isNumber = /^-?\d*\.?\d+$/.test(args[0]);
        const gap = isNumber ? `${parseFloat(args[0]) * spacing}px` : args;

        declarations.push(`gap:${gap};`);
      }

      const childrenCss = getChildrenCss(element, callback);

      return createCssRule(parent.value, `${declarations.join('')}${childrenCss}`);
    },
  });
