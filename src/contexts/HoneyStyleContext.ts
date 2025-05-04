import { createContext } from 'react';

import type { HoneyTheme } from '../types';

export interface HoneyStyleContextValue {
  /**
   * Represents the theme object.
   */
  theme: HoneyTheme;
}

export const HoneyStyleContext = createContext<HoneyStyleContextValue | undefined>(undefined);
