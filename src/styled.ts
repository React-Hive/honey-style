import { createElement, useInsertionEffect } from 'react';
import type { ElementType, ComponentProps, ComponentPropsWithRef } from 'react';

import { VALID_DOM_ELEMENT_ATTRS } from './constants';
import { css } from './css';
import { mountStyle } from './mount-style';
import { useHoneyStyle } from './hooks';
import { processCss, generateId, hashString, makeClassName } from './utils';
import type {
  FastOmit,
  Override,
  HoneyHTMLDataAttributes,
  HoneyStyledInterpolation,
  HoneyStyledPropsWithAs,
  HoneyStyledContext,
} from './types';

/**
 * Filters out non-standard HTML attributes from the props object when rendering a native HTML element.
 *
 * Keeps only valid HTML attributes, including `data-*` and `aria-*` attributes.
 * Useful for preventing React warnings and ensuring proper HTML output.
 *
 * @template Props - The type of the props object
 *
 * @param props - The component props to filter
 *
 * @returns A new props object containing only valid HTML attributes
 */
const filterNonHtmlProps = <Props extends object>(props: Props): Props =>
  Object.entries(props).reduce((allowedProps, [propName, propValue]) => {
    if (
      VALID_DOM_ELEMENT_ATTRS.has(propName) ||
      propName.startsWith('data-') ||
      propName.startsWith('aria-')
    ) {
      allowedProps[propName as keyof Props] = propValue;
    }
    return allowedProps;
  }, {} as Props);

export type HoneyStyledProps<
  Element extends ElementType,
  Props extends object,
> = HoneyStyledPropsWithAs<
  Element,
  HoneyHTMLDataAttributes & ComponentPropsWithRef<Element> & Props
>;

type DefaultPropsResolver<
  Target extends ElementType,
  DefaultProps extends object,
  Props extends object,
  CombinedProps extends object = Override<DefaultProps, Props>,
> =
  | HoneyStyledPropsWithAs<Target, FastOmit<Partial<CombinedProps>, 'as'>>
  | ((
      props: HoneyStyledContext<HoneyStyledPropsWithAs<Target, CombinedProps>>,
    ) => HoneyStyledPropsWithAs<Target, FastOmit<Partial<CombinedProps>, 'as'>>);

export const styled = <
  TargetProps extends object,
  Target extends ElementType = ElementType,
  OverrideTarget extends ElementType = Target,
>(
  target: Target,
  defaultProps?: DefaultPropsResolver<OverrideTarget, ComponentProps<OverrideTarget>, TargetProps>,
) => {
  return <Props extends object = TargetProps>(
    strings: TemplateStringsArray,
    ...interpolations: HoneyStyledInterpolation<Override<ComponentProps<OverrideTarget>, Props>>[]
  ) => {
    const componentId = generateId('hsc');
    const computeCss = css(strings, ...interpolations);

    const StyledComponent = <AsElement extends ElementType = OverrideTarget>({
      as,
      className,
      __chain,
      css: cssProp,
      ...props
    }: HoneyStyledPropsWithAs<
      AsElement,
      Override<ComponentProps<AsElement>, FastOmit<Props, 'as'>>
    > & {
      css?: HoneyStyledInterpolation<Props>;
      className?: string;
      __chain?: string;
    }) => {
      const { theme } = useHoneyStyle();

      const cleanedProps = Object.fromEntries(
        Object.entries(props).filter(([, value]) => value !== undefined),
      );

      const resolvedDefaultProps: typeof defaultProps =
        typeof defaultProps === 'function'
          ? defaultProps({ theme, as, className, ...cleanedProps } as never)
          : (defaultProps ?? ({} as never));

      const context: HoneyStyledContext<any> = {
        ...resolvedDefaultProps,
        ...cleanedProps,
        theme,
      };

      const rawCss = computeCss(context);
      const baseClassName = `hscn-${hashString(rawCss)}`;

      const baseCss = processCss(rawCss, `.${baseClassName}`);

      useInsertionEffect(
        () => mountStyle(baseClassName, baseCss, __chain ? 0 : 1),
        [baseClassName],
      );

      const cssPropRaw = typeof cssProp === 'function' ? cssProp(context) : cssProp;

      const cssPropString = cssPropRaw
        ? typeof cssPropRaw === 'string'
          ? cssPropRaw
          : // @ts-ignore
            css([''], [cssPropRaw])(context)
        : '';

      const cssPropClassName = cssPropString ? `hscn-${hashString(cssPropString)}` : '';

      useInsertionEffect(() => {
        if (cssPropClassName) {
          return mountStyle(cssPropClassName, processCss(cssPropString, `.${cssPropClassName}`), 2);
        }
      }, [cssPropClassName]);

      const mergedProps = {
        ...resolvedDefaultProps,
        ...cleanedProps,
        className: makeClassName([componentId, baseClassName, className, cssPropClassName]),
      };

      const finalComponent = as || target;

      if (typeof target === 'string') {
        const filteredProps =
          typeof finalComponent === 'string' ? filterNonHtmlProps(mergedProps) : mergedProps;

        return createElement(finalComponent, filteredProps);
      }

      // Recreate all elements in the chain
      return createElement(target, {
        ...mergedProps,
        ...(as && { as }),
        __chain: 'true',
      });
    };

    StyledComponent.$$ComponentId = componentId;
    StyledComponent.displayName = `HoneyStyledComponent(${typeof target === 'string' ? target : target.displayName || target.name || 'Component'})`;

    return StyledComponent;
  };
};
