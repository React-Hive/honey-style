import type { ComponentProps, ElementType, ReactElement } from 'react';
import { createElement, useInsertionEffect } from 'react';
import { definedProps, invokeIfFunction, isString } from '@react-hive/honey-utils';

import type {
  FastOmit,
  HoneyStyledContext,
  HoneyStyledInterpolation,
  HoneyStyledPropsWithAs,
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

type DefaultPropsResolver<
  Target extends ElementType,
  DefaultProps extends object,
  Props extends object,
  CombinedProps extends object = FastOmit<Override<DefaultProps, Props>, 'as'>,
> =
  | HoneyStyledPropsWithAs<Target, Partial<CombinedProps>>
  | ((
      props: HoneyStyledContext<HoneyStyledPropsWithAs<Target, CombinedProps>>,
    ) => HoneyStyledPropsWithAs<Target, Partial<CombinedProps>>);

type HoneyStyledInternalProps = {
  className?: HoneyCssClassName;
  [HONEY_STYLED_COMPOSITION_DEPTH_PROP]?: number;
};

type HoneyStyledPublicComponentProps<
  AsElement extends ElementType,
  Props extends object,
> = HoneyStyledPropsWithAs<AsElement, Override<ComponentProps<AsElement>, Props>>;

type HoneyStyledComponent<OverrideTarget extends ElementType, Props extends object> = (<
  AsElement extends ElementType = OverrideTarget,
>(
  props: HoneyStyledPublicComponentProps<AsElement, FastOmit<Props, 'as'>>,
) => ReactElement<Props>) & {
  [HONEY_STYLED_COMPONENT_ID_PROP]: string;
  displayName?: string;
};

interface StyledOptions {
  /**
   * Determines whether a prop should be removed before being forwarded
   * to the rendered element.
   *
   * @param propName - The prop name to check.
   *
   * @returns Returns true if the prop should be omitted.
   */
  omitProps?: (propName: string) => boolean;
}

/**
 * Creates a Honey-styled component from an HTML element or React component.
 *
 * The returned function accepts a tagged template literal with static CSS and dynamic
 * interpolations. Interpolations receive the resolved styled context, including the
 * current theme, default props, and props passed to the component.
 *
 * The generated component supports the polymorphic `as` prop, so the rendered element
 * can be changed while preserving the native props of the selected element.
 *
 * Default props can be provided as either an object or a resolver function. Props passed
 * directly to the rendered styled component override default props.
 *
 * @template TargetProps - The custom props available to style interpolations.
 * @template Target - The base HTML element or React component used for rendering.
 * @template OverrideTarget - The default polymorphic element used for public prop inference.
 *
 * @param target - The base HTML element or React component to style.
 * @param defaultProps - Optional default props or a function that resolves default props from context.
 * @param options - Optional styled component options.
 *
 * @returns A tagged template function that creates a styled component.
 *
 * @example
 * ```tsx
 * const Box = styled('div')`
 *   color: red;
 * `;
 *
 * <Box data-testid="box">Content</Box>
 * ```
 *
 * @example
 * ```tsx
 * const Button = styled<{ variant: 'primary' | 'secondary' }, 'button'>('button')`
 *   ${({ variant }) => css`
 *     color: ${variant === 'primary' ? 'white' : 'black'};
 *   `}
 * `;
 *
 * <Button variant="primary" type="button" />
 * ```
 *
 * @example
 * ```tsx
 * const LinkBox = styled('div')`
 *   color: blue;
 * `;
 *
 * <LinkBox as="a" href="https://example.com">
 *   Link
 * </LinkBox>
 * ```
 */
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
    }: HoneyStyledPublicComponentProps<AsElement, FastOmit<Props, 'as'>> &
      HoneyStyledInternalProps) => {
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
