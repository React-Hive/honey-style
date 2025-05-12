import { createElement, useInsertionEffect } from 'react';
import type { ElementType, ComponentProps, ComponentPropsWithRef } from 'react';

import { __DEV__ } from './constants';
import {
  processCss,
  generateId,
  combineClassNames,
  resolveClassName,
  filterNonHtmlAttrs,
} from './utils';
import { css } from './css';
import { mountStyle } from './mount-style';
import { useHoneyStyle } from './hooks';
import type {
  FastOmit,
  Override,
  HoneyCSSClassName,
  HoneyHTMLDataAttributes,
  HoneyStyledInterpolation,
  HoneyStyledPropsWithAs,
  HoneyStyledContext,
} from './types';

const evaluateDynamicCss = (
  interpolation: HoneyStyledInterpolation<any> | undefined,
  context: HoneyStyledContext<any>,
): string => {
  if (!interpolation) {
    return '';
  }

  if (typeof interpolation === 'string') {
    return interpolation;
  }

  // @ts-expect-error
  return css([''], [interpolation])(context);
};

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
      __compositionDepth = 0,
      css: cssProp,
      ...props
    }: HoneyStyledPropsWithAs<
      AsElement,
      Override<ComponentProps<AsElement>, FastOmit<Props, 'as'>>
    > & {
      /**
       * @deprecated Please use inheritance instead.
       */
      css?: HoneyStyledInterpolation<Props>;
      className?: HoneyCSSClassName;
      __compositionDepth?: number;
    }) => {
      if (__DEV__ && cssProp) {
        console.warn(
          `[@react-hive/honey-style]: The "css" prop is deprecated. Please use inheritance or composition instead.`,
        );
      }

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
      const baseClassName = resolveClassName(rawCss);

      useInsertionEffect(() => {
        const baseCss = processCss(rawCss, `.${baseClassName}`);

        return mountStyle(baseClassName, baseCss, __compositionDepth);
      }, [baseClassName]);

      const cssPropRaw = typeof cssProp === 'function' ? cssProp(context) : cssProp;
      const cssPropString = evaluateDynamicCss(cssPropRaw, context);

      const cssPropClassName = cssPropString ? resolveClassName(cssPropString) : '';

      useInsertionEffect(() => {
        if (cssPropClassName) {
          const overrideCss = processCss(cssPropString, `.${cssPropClassName}`);

          return mountStyle(cssPropClassName, overrideCss, 1);
        }
      }, [cssPropClassName]);

      const mergedProps = {
        ...resolvedDefaultProps,
        ...cleanedProps,
        className: combineClassNames([componentId, baseClassName, className, cssPropClassName]),
      };

      const finalComponent = as || target;

      if (typeof target === 'string') {
        const filteredProps =
          typeof finalComponent === 'string' ? filterNonHtmlAttrs(mergedProps) : mergedProps;

        return createElement(finalComponent, filteredProps);
      }

      // Recreate all elements in the chain
      return createElement(target, {
        ...mergedProps,
        ...(as && { as }),
        __compositionDepth: __compositionDepth - 1,
      });
    };

    StyledComponent.$$ComponentId = componentId;

    if (__DEV__) {
      const componentName =
        typeof target === 'string' ? target : target.displayName || target.name || 'Component';

      StyledComponent.displayName = `HoneyStyledComponent(${componentName})`;
    }

    return StyledComponent;
  };
};
