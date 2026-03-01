import type { HoneyCssAstNode, HoneyCssAstStylesheetNode } from '@react-hive/honey-css';

import { flattenCssRules } from '../flatten-css-rules';

const decl = (prop: string, value: string) => ({
  type: 'declaration' as const,
  prop,
  value,
});

const rule = (selector: string, body: HoneyCssAstNode[]) => ({
  type: 'rule' as const,
  selector,
  body,
});

const at = (name: string, params: string | undefined, body: HoneyCssAstNode[] | null) => ({
  type: 'atRule' as const,
  name,
  params,
  body,
});

const sheet = (body: HoneyCssAstNode[]): HoneyCssAstStylesheetNode => ({
  type: 'stylesheet',
  body,
});

describe('[flattenCssRules]', () => {
  it('should flatten descendant nesting', () => {
    const input = sheet([rule('.parent', [rule('.child', [decl('color', 'red')])])]);

    const expected = sheet([rule('.parent .child', [decl('color', 'red')])]);

    expect(flattenCssRules(input)).toStrictEqual(expected);
  });

  it('should resolve "&" selectors', () => {
    const input = sheet([rule('.btn', [rule('&:hover', [decl('opacity', '0.5')])])]);

    const expected = sheet([rule('.btn:hover', [decl('opacity', '0.5')])]);

    expect(flattenCssRules(input)).toStrictEqual(expected);
  });

  it('should preserve parent declarations', () => {
    const input = sheet([
      rule('.parent', [decl('color', 'red'), rule('.child', [decl('padding', '8px')])]),
    ]);

    const expected = sheet([
      rule('.parent', [decl('color', 'red')]),
      rule('.parent .child', [decl('padding', '8px')]),
    ]);

    expect(flattenCssRules(input)).toStrictEqual(expected);
  });

  it('should flatten deep selector chains', () => {
    const input = sheet([rule('.a', [rule('.b', [rule('.c', [decl('color', 'blue')])])])]);

    const expected = sheet([rule('.a .b .c', [decl('color', 'blue')])]);

    expect(flattenCssRules(input)).toStrictEqual(expected);
  });

  it('should flatten selector-context at-rules', () => {
    const input = sheet([
      rule('.btn', [at('media', '(max-width: 600px)', [decl('display', 'none')])]),
    ]);

    const expected = sheet([
      at('media', '(max-width: 600px)', [rule('.btn', [decl('display', 'none')])]),
    ]);

    expect(flattenCssRules(input)).toStrictEqual(expected);
  });

  it('should support nested selector-context at-rules', () => {
    const input = sheet([
      rule('.box', [
        at('media', '(max-width: 600px)', [
          at('supports', '(display: grid)', [decl('display', 'grid')]),
        ]),
      ]),
    ]);

    const expected = sheet([
      at('media', '(max-width: 600px)', [
        at('supports', '(display: grid)', [rule('.box', [decl('display', 'grid')])]),
      ]),
    ]);

    expect(flattenCssRules(input)).toStrictEqual(expected);
  });

  it('should preserve non-selector at-rules (font-face)', () => {
    const input = sheet([
      rule('.wrapper', [at('font-face', undefined, [decl('font-family', 'Test')])]),
    ]);

    const expected = sheet([at('font-face', undefined, [decl('font-family', 'Test')])]);

    expect(flattenCssRules(input)).toStrictEqual(expected);
  });

  it('should preserve directive at-rules (body: null)', () => {
    const input = sheet([at('import', 'url("file.css")', null)]);

    expect(flattenCssRules(input)).toStrictEqual(input);
  });

  it('should remove empty rules', () => {
    const input = sheet([rule('.empty', [])]);

    const expected = sheet([]);

    expect(flattenCssRules(input)).toStrictEqual(expected);
  });
});
