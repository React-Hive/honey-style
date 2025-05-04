import React, { useMemo } from 'react';
import type { PropsWithChildren } from 'react';

import { HoneyStyleContext } from '../contexts';
import type { HoneyTheme } from '../types';
import type { HoneyStyleContextValue } from '../contexts';

interface HoneyStyleProviderProps {
  theme: HoneyTheme;
}

export const HoneyStyleProvider = ({
  children,
  theme,
}: PropsWithChildren<HoneyStyleProviderProps>) => {
  const contextValue = useMemo<HoneyStyleContextValue>(
    () => ({
      theme,
    }),
    [theme],
  );

  return <HoneyStyleContext value={contextValue}>{children}</HoneyStyleContext>;
};
