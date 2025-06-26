import React, { useMemo } from 'react';
import type { PropsWithChildren } from 'react';

import { HoneyStyleContext } from '../contexts';
import { resolveColor, resolveDimension, resolveFont, resolveSpacing } from '../utils';
import type { HoneyTheme } from '../types';
import type { HoneyStyleContextValue } from '../contexts';

export interface HoneyStyleProviderProps {
  theme: HoneyTheme;
}

export const HoneyStyleProvider = ({
  children,
  theme,
}: PropsWithChildren<HoneyStyleProviderProps>) => {
  const contextValue = useMemo<HoneyStyleContextValue>(
    () => ({
      theme,
      resolveSpacing: (...args) => resolveSpacing(...args)({ theme }),
      resolveColor: (...args) => resolveColor(...args)({ theme }),
      resolveFont: (...args) => resolveFont(...args)({ theme }),
      resolveDimension: (...args) => resolveDimension(...args)({ theme }),
    }),
    [theme],
  );

  return <HoneyStyleContext value={contextValue}>{children}</HoneyStyleContext>;
};
