export const resolveSpacingValue = (value: string, spacingFactor: number): string => {
  const trimmed = value.trim();

  // CSS unit provided → keep as-is
  if (/[a-z%]+$/i.test(trimmed)) {
    return trimmed;
  }

  // Numeric multiplier
  if (/^-?\d*\.?\d+$/.test(trimmed)) {
    return `${parseFloat(trimmed) * spacingFactor}px`;
  }

  return trimmed;
};
