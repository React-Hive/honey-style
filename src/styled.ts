import type { ElementType, ComponentProps, ComponentPropsWithRef } from 'react';
import { createElement, useInsertionEffect } from 'react';
import { isString, invokeIfFunction, definedProps } from '@react-hive/honey-utils';

import type {
  FastOmit,
  Override,
  HoneyHTMLDataAttributes,
  HoneyStyledInterpolation,
  HoneyStyledPropsWithAs,
  HoneyStyledContext,
} from './types';
import type { HoneyCSSClassName } from './css';
import { __DEV__, HONEY_STYLED_COMPONENT_ID_PROP } from './constants';
import {
  generateId,
  combineClassNames,
  resolveClassName,
  filterNonHtmlAttrs,
  isStyledComponent,
} from './utils';
import { css, processCss } from './css';
import { mountStyle } from './mount-style';
import { useHoneyStyle } from './hooks';

const evaluateDynamicCss = (
  interpolation: HoneyStyledInterpolation<any> | undefined,
  context: HoneyStyledContext<any>,
): string => {
  if (!interpolation) {
    return '';
  }

  if (isString(interpolation)) {
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

interface StyledOptions {
  omitProps?: (name: string) => boolean;
}

export const styled = <
  TargetProps extends object,
  Target extends ElementType = ElementType,
  OverrideTarget extends ElementType = Target,
>(
  target: Target,
  defaultProps?: DefaultPropsResolver<OverrideTarget, ComponentProps<OverrideTarget>, TargetProps>,
  { omitProps }: StyledOptions = {},
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

      const cleanedProps = definedProps(props);
      const resolvedDefaultProps = {
        ...(invokeIfFunction(defaultProps, {
          theme,
          as,
          className,
          ...cleanedProps,
        } as never) ?? ({} as never)),
        // Allow overriding the default "className" prop
        ...(className && { className }),
      };

      const context: HoneyStyledContext<any> = {
        ...resolvedDefaultProps,
        ...cleanedProps,
        theme,
      };

      const rawCss = computeCss(context);
      const baseClassName = resolveClassName(rawCss);

      useInsertionEffect(() => {
        const baseCss = processCss(rawCss, `.${baseClassName}`, {
          theme,
        });

        return mountStyle(baseClassName, baseCss, __compositionDepth);
      }, [baseClassName]);

      const cssPropRaw = invokeIfFunction(cssProp, context);
      const cssPropString = evaluateDynamicCss(cssPropRaw, context);

      const cssPropClassName = cssPropString ? resolveClassName(cssPropString) : '';

      useInsertionEffect(() => {
        if (cssPropClassName) {
          const overrideCss = processCss(cssPropString, `.${cssPropClassName}`, {
            theme,
          });

          return mountStyle(cssPropClassName, overrideCss, 1);
        }
      }, [cssPropClassName]);

      const finalClassName = combineClassNames([
        componentId,
        baseClassName,
        resolvedDefaultProps.className,
        cssPropClassName,
      ]);

      const mergedProps = {
        ...resolvedDefaultProps,
        ...cleanedProps,
        className: finalClassName,
      };

      const finalProps = omitProps
        ? Object.entries(mergedProps).reduce(
            (result, [propName, propValue]) =>
              omitProps(propName)
                ? result
                : {
                    ...result,
                    [propName]: propValue,
                  },
            {},
          )
        : mergedProps;

      const finalComponent = as || target;

      if (isString(target)) {
        const filteredProps = isString(finalComponent)
          ? filterNonHtmlAttrs(finalProps)
          : finalProps;

        return createElement(finalComponent, filteredProps);
      }

      return createElement(target, {
        ...finalProps,
        ...(as && { as }),
        ...(isStyledComponent(target) && {
          __compositionDepth: __compositionDepth - 1,
        }),
      });
    };

    StyledComponent[HONEY_STYLED_COMPONENT_ID_PROP] = componentId;

    if (__DEV__) {
      const componentName = isString(target)
        ? target
        : target.displayName || target.name || 'Component';

      StyledComponent.displayName = `HoneyStyledComponent(${componentName})`;
    }

    return StyledComponent;
  };
};
