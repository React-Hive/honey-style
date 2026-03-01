import type { HoneyCssAstNode, HoneyCssAstStylesheetNode } from '@react-hive/honey-css';
import { parseCss } from '@react-hive/honey-css';

import { compileCss } from '../compile-css';

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

describe('[compileCss]', () => {
  it('should compile a simple rule without scope', () => {
    const ast = sheet([rule('.child', [decl('color', 'red')])]);

    expect(compileCss(ast)).toBe('.child{color:red;}');
  });

  it('should flatten nested descendant rules without scope', () => {
    const ast = sheet([rule('.parent', [rule('.child', [decl('padding', '8px')])])]);

    expect(compileCss(ast)).toBe('.parent .child{padding:8px;}');
  });

  it('should resolve "&" inside nested rules without scope', () => {
    const ast = sheet([rule('.btn', [rule('&:hover', [decl('opacity', '0.5')])])]);

    expect(compileCss(ast)).toBe('.btn:hover{opacity:0.5;}');
  });

  it('should preserve at-rules without scope', () => {
    const ast = sheet([
      at('media', '(max-width: 768px)', [rule('.child', [decl('display', 'none')])]),
    ]);

    expect(compileCss(ast)).toBe('@media (max-width: 768px){.child{display:none;}}');
  });

  it('should scope a simple rule', () => {
    const ast = sheet([rule('.child', [decl('color', 'red')])]);

    expect(compileCss(ast, '.scope')).toBe('.scope .child{color:red;}');
  });

  it('should replace "&" with scope', () => {
    const ast = sheet([rule('&:hover', [decl('opacity', '0.5')])]);

    expect(compileCss(ast, '.btn')).toBe('.btn:hover{opacity:0.5;}');
  });

  it('should resolve combinators correctly', () => {
    expect(compileCss(sheet([rule('+ .item', [decl('margin-top', '12px')])]), '.card')).toBe(
      '.card + .item{margin-top:12px;}',
    );

    expect(compileCss(sheet([rule('> .content', [decl('width', '100%')])]), '.layout')).toBe(
      '.layout > .content{width:100%;}',
    );
  });

  it('should scope multiple selectors separated by commas', () => {
    const ast = sheet([rule('.a, .b', [decl('color', 'red')])]);

    expect(compileCss(ast, '.scope')).toBe('.scope .a, .scope .b{color:red;}');
  });

  it('should scope multiple parent selectors', () => {
    const ast = sheet([rule('.child', [decl('color', 'red')])]);

    expect(compileCss(ast, '.a, .b')).toBe('.a .child, .b .child{color:red;}');
  });

  it('should resolve "&" with multiple parent selectors', () => {
    const ast = sheet([rule('&:hover', [decl('color', 'red')])]);

    expect(compileCss(ast, '.a, .b')).toBe('.a:hover, .b:hover{color:red;}');
  });

  it('should flatten nested rules with scope', () => {
    const ast = sheet([rule('.parent', [rule('.child', [decl('padding', '8px')])])]);

    expect(compileCss(ast, '.scope')).toBe('.scope .parent .child{padding:8px;}');
  });

  it('should flatten nested "&" rules with scope', () => {
    const ast = sheet([rule('.btn', [rule('&:active', [decl('transform', 'scale(0.9)')])])]);

    expect(compileCss(ast, '.scope')).toBe('.scope .btn:active{transform:scale(0.9);}');
  });

  it('should flatten multiple nested rules into multiple outputs', () => {
    const ast = sheet([
      rule('.card', [
        decl('padding', '12px'),
        rule('.title', [decl('font-weight', 'bold')]),
        rule('.desc', [decl('opacity', '0.8')]),
      ]),
    ]);

    expect(compileCss(ast, '.scope')).toBe(
      '.scope .card{padding:12px;}.scope .card .title{font-weight:bold;}.scope .card .desc{opacity:0.8;}',
    );
  });

  it('should scope rules inside at-rules', () => {
    const ast = sheet([
      at('media', '(max-width: 768px)', [rule('.child', [decl('display', 'none')])]),
    ]);

    expect(compileCss(ast, '.scope')).toBe(
      '@media (max-width: 768px){.scope .child{display:none;}}',
    );
  });

  it('should scope deeply nested selector-context at-rules', () => {
    const css = compileCss(
      parseCss(`
        @media (max-width: 600px) {
          @supports (display: grid) {
            .child { display: grid; }
          }
        }
      `),
      '.scope',
    );

    expect(css).toBe(
      '@media (max-width: 600px){@supports (display: grid){.scope .child{display:grid;}}}',
    );
  });

  it('should preserve directive at-rules with scope', () => {
    const ast = sheet([at('import', 'url("file.css")', null)]);

    expect(compileCss(ast, '.scope')).toBe('@import url("file.css");');
  });

  it('should not scope or flatten keyframes', () => {
    const css = compileCss(
      parseCss(`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `),
      '.scope',
    );

    expect(css).toContain('@keyframes spin');
    expect(css).not.toContain('.scope 0%');
  });

  it('should not split commas inside pseudo-functions', () => {
    const css = compileCss(parseCss(`:is(.a, .b) { color: red; }`), '.scope');

    expect(css).toBe('.scope :is(.a, .b){color:red;}');
  });

  it('should remove empty nested rules after scoping', () => {
    const css = compileCss(
      parseCss(`
        .parent {
          .child {}
        }
      `),
      '.scope',
    );

    expect(css).toBe('');
  });
});
