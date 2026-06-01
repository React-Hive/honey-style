import type { ComponentProps, ComponentPropsWithRef, ElementType, ReactElement } from 'react';
import { createElement, useInsertionEffect } from 'react';
import { definedProps, invokeIfFunction, isString } from '@react-hive/honey-utils';

import type {
  FastOmit,
  HoneyHtmlDataAttributes,
  HoneyStyledContext,
  HoneyStyledInterpolation,
  HoneyStyledPropsWithAs,
  Nullable,
  Override,
} from './types';
import type { HoneyCssClassName } from './css';
import { css, processCss } from './css';
import {
  __DEV__,
  HONEY_STYLED_COMPONENT_ID_PROP,
  HONEY_STYLED_COMPOSITION_DEPTH_PROP,
} from './constants';
import {
  buildClassName,
  combineClassNames,
  filterNonHtmlAttrs,
  generateId,
  isStyledComponent,
} from './utils';
import { mountStyle } from './mount-style';
import { useHoneyStyle } from './hooks';

export type HoneyStyledProps<
  Element extends ElementType,
  Props extends object,
> = HoneyStyledPropsWithAs<
  Element,
  HoneyHtmlDataAttributes & ComponentPropsWithRef<Element> & Props
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

type HoneyStyledInternalProps = {
  className?: HoneyCssClassName;
  [HONEY_STYLED_COMPOSITION_DEPTH_PROP]?: number;
};

type HoneyStyledPublicComponentProps<
  AsElement extends ElementType,
  Props extends object,
> = HoneyStyledPropsWithAs<AsElement, Override<ComponentProps<AsElement>, FastOmit<Props, 'as'>>>;

type HoneyStyledComponent<OverrideTarget extends ElementType, Props extends object> = (<
  AsElement extends ElementType = OverrideTarget,
>(
  props: HoneyStyledPublicComponentProps<AsElement, Props>,
) => Nullable<ReactElement<Props>>) & {
  [HONEY_STYLED_COMPONENT_ID_PROP]: string;
  displayName?: string;
};

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

    const StyledComponentImpl = <AsElement extends ElementType = OverrideTarget>({
      as,
      className,
      __compositionDepth = 0,
      ...props
    }: HoneyStyledPublicComponentProps<AsElement, Props> & HoneyStyledInternalProps) => {
      const { theme } = useHoneyStyle();

      const cleanedProps = definedProps(props);
      const resolvedDefaultProps = {
        ...(invokeIfFunction(defaultProps, {
          theme,
          as,
          className,
          ...cleanedProps,
        } as never) ?? {}),
        // Allow overriding the default "className" prop
        ...(className && { className }),
      };

      const context: HoneyStyledContext<any> = {
        ...resolvedDefaultProps,
        ...cleanedProps,
        theme,
      };

      const rawCss = computeCss(context);
      const baseClassName = buildClassName(rawCss);

      useInsertionEffect(() => {
        const baseCss = processCss(rawCss, {
          theme,
          selector: `.${baseClassName}`,
        });

        return mountStyle(baseClassName, baseCss, __compositionDepth);
      }, [baseClassName]);

      const finalClassName = combineClassNames([
        componentId,
        baseClassName,
        resolvedDefaultProps.className,
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
          [HONEY_STYLED_COMPOSITION_DEPTH_PROP]: __compositionDepth - 1,
        }),
      });
    };

    const StyledComponent = StyledComponentImpl as HoneyStyledComponent<OverrideTarget, Props>;

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
