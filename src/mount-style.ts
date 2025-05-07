import { HONEY_STYLE_ATTR } from './constants';

type StyleCleanupFn = () => void;

/**
 * Represents an entry in the style registry with the raw CSS string,
 * its usage count, and optional priority for ordering.
 */
interface StyleRegistryEntry {
  css: string;
  usages: number;
  priority: number;
}

/**
 * Global style registry, shared across reloads and modules.
 */
const getStyleRegistry = (): Map<string, StyleRegistryEntry> => {
  if (!window.__honeyStyleRegistry) {
    window.__honeyStyleRegistry = new Map<string, StyleRegistryEntry>();
  }

  return window.__honeyStyleRegistry;
};

const styleRegistry = getStyleRegistry();

let globalStyleTag: HTMLStyleElement | null = null;

/**
 * Ensures a single <style> tag exists and is attached to <head>.
 *
 * @returns The <style> element.
 */
const ensureGlobalStyleTag = (): HTMLStyleElement => {
  if (!globalStyleTag) {
    globalStyleTag = document.querySelector(`style[${HONEY_STYLE_ATTR}="true"]`);

    if (!globalStyleTag) {
      globalStyleTag = document.createElement('style');
      globalStyleTag.setAttribute(HONEY_STYLE_ATTR, 'true');

      document.head.appendChild(globalStyleTag);
    }
  }

  return globalStyleTag;
};

/**
 * Updates the global <style> tag with all currently active styles, sorted by priority.
 */
const updateGlobalStyleContent = () => {
  const styleTag = ensureGlobalStyleTag();

  const allCss = Array.from(styleRegistry.entries())
    .sort(([, a], [, b]) => a.priority - b.priority)
    .map(([, entry]) => entry.css)
    .join('\n');

  styleTag.textContent = allCss;
};

/**
 * Creates a cleanup function for a style, which decrements usage count and removes it if unused.
 *
 * @param className - The key of the style.
 */
const createCleanupFunction =
  (className: string): StyleCleanupFn =>
  () => {
    const entry = styleRegistry.get(className);
    if (!entry) {
      return;
    }

    entry.usages--;

    if (entry.usages <= 0) {
      styleRegistry.delete(className);

      updateGlobalStyleContent();
    }
  };

/**
 * Mounts a CSS string under a given class name. Injects into a global <style> tag and manages its lifecycle.
 *
 * @param className - Unique identifier for the style block.
 * @param css - Full CSS rule string (can include multiple rules, media queries, etc.)
 * @param priority - Optional number to determine style ordering (lower = earlier = lower specificity)
 *
 * @returns A cleanup function to unmount the style when it's no longer needed.
 */
export const mountStyle = (
  className: string,
  css: string,
  priority: number = 0,
): StyleCleanupFn => {
  const existing = styleRegistry.get(className);

  if (existing) {
    existing.usages++;

    return createCleanupFunction(className);
  }

  styleRegistry.set(className, {
    css,
    priority,
    usages: 1,
  });

  updateGlobalStyleContent();

  return createCleanupFunction(className);
};
