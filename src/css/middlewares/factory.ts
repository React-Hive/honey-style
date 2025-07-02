import { compile, serialize } from 'stylis';
import type { Element, Middleware } from 'stylis';

interface AtRuleMiddlewareOptions {
  /**
   * The suffix name of the custom at-rule without the `@honey-` prefix.
   *
   * For example, if you want to handle `@honey-stack`, set this to `"stack"`.
   *
   * This name is used to match the rule in the Stylis AST.
   */
  name: string;
  /**
   * A transformation function that returns CSS declarations to be injected
   * in place of the custom at-rule.
   *
   * @param args - An array of parsed arguments inside the at-rule parentheses.
   *               Arguments are split by spaces. If no arguments are provided,
   *               this will be `undefined`.
   *
   *               For example:
   *               - `@honey-stack(2)` → `args = ['2']`
   *               - `@honey-inline(2 center)` → `args = ['2', 'center']`
   *
   * @param element - The Stylis AST element representing the current at-rule node.
   *                  Can be useful for accessing raw content or children.
   *
   * @param name - The same name as passed in `options.name`, for convenience.
   *
   * @returns A string of one or more CSS declarations (e.g., `display:flex;gap:8px;`).
   *          This string will be injected into the compiled output in place of the at-rule.
   */
  transform: (args: string[] | undefined, element: Element, name: string) => string;
}

/**
 * Creates a Stylis middleware for transforming custom `@honey-*` at-rules into
 * regular CSS declarations.
 *
 * This utility enables the definition of expressive, domain-specific at-rules
 * such as `@honey-stack`, `@honey-inline`, or `@honey-center`, which can then be
 * expanded into valid CSS at build time.
 *
 * Supports optional arguments passed via parentheses (e.g., `@honey-stack(2)`),
 * as well as nested rule bodies (e.g., `@honey-stack { .child { ... } }`).
 *
 * ---
 *
 * ### Example
 * ```ts
 * createAtRuleMiddleware({
 *   name: 'stack',
 *   transform: args => {
 *     const gap = parseFloat(args?.[0] ?? '0') * 8;
 *
 *     return `display:flex;flex-direction:column;gap:${gap}px;`;
 *   }
 * });
 * ```
 *
 * ---
 *
 * ### Behavior
 * - Matches only rules of the form `@honey-${name}` inside standard CSS rules.
 * - Parses arguments from parentheses (e.g. `@honey-name (arg1 arg2)`).
 * - Serializes nested content (children) and appends it to the output.
 *
 * @param options - Options for configuring the middleware:
 *   - `name`: the custom at-rule suffix, without the `@honey-` prefix.
 *   - `transform`: a function to convert parsed args and the AST node into CSS declarations.
 *
 * @returns A Stylis `Middleware` function that replaces the matched at-rule with the generated CSS.
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

    const args = argsMatch ? argsMatch[1].split(' ').filter(Boolean) : undefined;

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
