import { useEffect } from 'react';

import { HONEY_STYLE_ATTR } from './constants';
import { css } from './css';
import { processCss, generateId } from './utils';
import { useHoneyStyle } from './hooks';
import type { HoneyStyledInterpolation, HoneyStyledContext } from './types';

export const createGlobalStyle = (
  strings: TemplateStringsArray,
  ...interpolations: HoneyStyledInterpolation<HoneyStyledContext<object>>[]
) => {
  const styleId = generateId('hsg');

  const computeCss = css(strings, ...interpolations);

  const GlobalStyle = () => {
    const { theme } = useHoneyStyle();

    useEffect(() => {
      if (document.getElementById(styleId)) {
        return;
      }

      const rawCss = computeCss({ theme });

      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = processCss(rawCss);
      styleElement.setAttribute(HONEY_STYLE_ATTR, 'true');

      document.head.appendChild(styleElement);

      return () => {
        styleElement.remove();
      };
    }, [theme]);

    return null;
  };

  return GlobalStyle;
};
