export const unwrapParams = (params?: string): string => {
  if (!params) {
    return '';
  }

  const trimmed = params.trim();

  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
};
