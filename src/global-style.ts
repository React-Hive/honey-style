import { useInsertionEffect } from 'react';

import type { HoneyStyledInterpolation, HoneyStyledContext } from './types';
import { HONEY_GLOBAL_STYLE_ATTR } from './constants';
import { css, processCss } from './css';
import { generateId } from './utils';
import { useHoneyStyle } from './hooks';

export const createGlobalStyle = (
  strings: TemplateStringsArray,
  ...interpolations: HoneyStyledInterpolation<HoneyStyledContext<object>>[]
) => {
  const styleId = generateId('hsg');

  const computeCss = css(strings, ...interpolations);

  const GlobalStyle = () => {
    const { theme } = useHoneyStyle();

    useInsertionEffect(() => {
      const rawCss = computeCss({ theme });
      const processedCss = processCss(rawCss);

      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = processedCss;
      styleElement.setAttribute(HONEY_GLOBAL_STYLE_ATTR, 'true');

      document.head.insertBefore(styleElement, document.head.firstChild);

      return () => {
        styleElement.remove();
      };
    }, [theme]);

    return null;
  };

  return GlobalStyle;
};
