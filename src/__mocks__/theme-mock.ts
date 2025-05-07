import type { HoneyTheme } from '../types';

export const themeMock: HoneyTheme = {
  breakpoints: {
    xs: 480,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1440,
  },
  container: {
    maxWidth: '1450px',
  },
  spacings: {
    base: 8,
    small: 4,
    medium: 12,
    large: 16,
  },
  fonts: {
    body: {
      size: 14,
      family: 'Roboto',
      weight: 400,
      lineHeight: 1,
      letterSpacing: 1,
    },
  },
  colors: {
    primary: {
      royalBlue: '#4169E1',
    },
    secondary: {},
    accent: {},
    neutral: {
      charcoalDark: '#222222',
    },
    success: {},
    warning: {},
    error: {},
  },
  dimensions: {
    //
  },
};
