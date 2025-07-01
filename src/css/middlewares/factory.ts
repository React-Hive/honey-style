import { compile, serialize } from 'stylis';
import type { Element, Middleware } from 'stylis';

interface AtRuleMiddlewareOptions {
  name: string;
  /**
   * A transformation function that returns CSS declarations.
   *
   * @param args - The parsed argument string inside the parentheses, if any.
   * @param element - The Stylis AST element for the current at-rule.
   * @param name - The name of the rule, same as `name` from the options.
   *
   * @returns A string of CSS declarations (e.g., `display:flex;gap:8px;`)
   */
  transform: (args: string | undefined, element: Element, name: string) => string;
}

/**
 * Creates a Stylis middleware that transforms a custom @honey-* at-rule
 * into standard CSS declarations. It supports optional arguments via parentheses
 * and nested rule content.
 *
 * @example
 * // For @honey-stack(2) { gap: 1; }
 * createAtRuleMiddleware({
 *   name: 'stack',
 *   transform: args => `display:flex;gap:${parseFloat(args || '0') * 8}px;`
 * });
 *
 * @param options - Middleware creation options.
 *
 * @returns A Stylis middleware function.
 */
export const createAtRuleMiddleware = ({
  name,
  transform,
}: AtRuleMiddlewareOptions): Middleware => {
  return (element, _i, _children, callback) => {
    if (element.parent?.type !== 'rule' || element.type !== `@honey-${name}`) {
      return;
    }

    const parentSelector = element.parent?.value;
    if (!parentSelector) {
      return;
    }

    const argsMatch = element.value
      .trim()
      .match(new RegExp(`^${element.type}\\s*\\(\\s*([^)]+?)\\s*\\)\\s*;?$`, 'i'));

    const args = argsMatch ? argsMatch[1].trim() : undefined;

    const transformedCSS = transform(args, element, name);

    const serializedChildren = Array.isArray(element.children)
      ? serialize(element.children, callback)
      : '';

    element.type = 'decl';
    element.return = serialize(
      compile(`${parentSelector}{${transformedCSS}${serializedChildren}}`),
      callback,
    );
  };
};
