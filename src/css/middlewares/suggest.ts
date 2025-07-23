import type { Middleware, Element } from 'stylis';

interface Declaration {
  prop: string;
  value: string;
}

const collectDeclarations = (rule: Element): Declaration[] => {
  if (!rule.children || !Array.isArray(rule.children)) {
    return [];
  }

  return rule.children
    .filter(
      child =>
        child.type === 'decl' &&
        typeof child.props === 'string' &&
        typeof child.children === 'string',
    )
    .map(child => ({
      prop: child.props,
      value: child.children,
    })) as Declaration[];
};

interface KnownPattern {
  name: string;
  match: (declarations: Declaration[]) => boolean;
}

const knownPatterns: KnownPattern[] = [
  {
    name: '@honey-center',
    match: (declarations: Declaration[]) =>
      declarations.some(d => d.prop === 'display' && d.value === 'flex') &&
      declarations.some(d => d.prop === 'align-items' && d.value === 'center') &&
      declarations.some(d => d.prop === 'justify-content' && d.value === 'center'),
  },
  {
    name: '@honey-stack',
    match: (declarations: Declaration[]) =>
      declarations.some(d => d.prop === 'display' && d.value === 'flex') &&
      declarations.some(d => d.prop === 'flex-direction' && d.value === 'column'),
  },
  {
    name: '@honey-inline',
    match: (declarations: Declaration[]) =>
      declarations.some(d => d.prop === 'display' && d.value === 'flex') &&
      declarations.some(d => d.prop === 'align-items' && d.value === 'center'),
  },
];

export const suggestAtRuleMiddleware: Middleware = element => {
  if (element.type !== 'rule' || !element.children) {
    return;
  }

  const declarations = collectDeclarations(element);

  for (const pattern of knownPatterns) {
    if (pattern.match(declarations)) {
      console.info(
        `[@react-hive/honey-style]: The CSS rule "${element.value}" can be simplified using the shorthand at-rule "${pattern.name}".`,
      );

      break;
    }
  }
};
