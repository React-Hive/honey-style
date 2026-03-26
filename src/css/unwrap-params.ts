export const unwrapParams = (input?: string): string => {
  if (!input) {
    return '';
  }

  const trimmed = input.trim();

  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
};
