import {
  HONEY_STYLE_ATTR,
  HONEY_STYLE_PRIORITY_ATTR,
  HONEY_STYLE_REGISTRY_SYMBOL,
} from './constants';

interface HoneyWindow extends Window {
  [HONEY_STYLE_REGISTRY_SYMBOL]?: Map<string, StyleRegistryEntry>;
}

type StyleCleanupFn = () => void;

interface StyleRegistryEntry {
  css: string;
  usages: number;
  priority: number;
}

const getStyleRegistry = (): Map<string, StyleRegistryEntry> => {
  const w = window as HoneyWindow;

  if (!w[HONEY_STYLE_REGISTRY_SYMBOL]) {
    w[HONEY_STYLE_REGISTRY_SYMBOL] = new Map();
  }

  return w[HONEY_STYLE_REGISTRY_SYMBOL];
};

const styleRegistry = getStyleRegistry();

/**
 * Cache style tags per priority
 */
const styleTagsByPriority = new Map<number, HTMLStyleElement>();

const pendingStyleUpdatePriorities = new Set<number>();
let isStyleUpdateScheduled = false;

/**
 * Ensures a <style> tag exists for a given priority.
 */
const ensureStyleTagForPriority = (priority: number): HTMLStyleElement => {
  let styleElement = styleTagsByPriority.get(priority);
  if (styleElement) return styleElement;

  styleElement = document.createElement('style');
  styleElement.setAttribute(HONEY_STYLE_ATTR, 'true');
  styleElement.setAttribute(HONEY_STYLE_PRIORITY_ATTR, String(priority));

  const existing = Array.from(document.querySelectorAll(`style[${HONEY_STYLE_ATTR}="true"]`));

  const insertBefore = existing.find(
    el => Number(el.getAttribute(HONEY_STYLE_PRIORITY_ATTR)) > priority,
  );

  if (insertBefore) {
    document.head.insertBefore(styleElement, insertBefore);
  } else {
    document.head.appendChild(styleElement);
  }

  styleTagsByPriority.set(priority, styleElement);

  return styleElement;
};

const updateStyleTagForPriority = (priority: number) => {
  const tag = ensureStyleTagForPriority(priority);

  const css = Array.from(styleRegistry.values())
    .filter(entry => entry.priority === priority)
    .map(entry => entry.css)
    .join('\n');

  if (css) {
    tag.textContent = css;
  } else {
    tag.remove();
    styleTagsByPriority.delete(priority);
  }
};

const flushStyleUpdates = () => {
  for (const priority of pendingStyleUpdatePriorities) {
    updateStyleTagForPriority(priority);
  }

  pendingStyleUpdatePriorities.clear();
};

const scheduleStyleUpdate = (priority: number) => {
  pendingStyleUpdatePriorities.add(priority);

  if (isStyleUpdateScheduled) {
    return;
  }

  isStyleUpdateScheduled = true;

  // microtask → no flicker (runs before paint)
  queueMicrotask(() => {
    isStyleUpdateScheduled = false;

    flushStyleUpdates();
  });
};

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

      scheduleStyleUpdate(entry.priority);
    }
  };

export const mountStyle = (
  className: string,
  css: string,
  priority: number = 0,
): StyleCleanupFn => {
  const existing = styleRegistry.get(className);

  if (existing) {
    existing.usages++;

    if (existing.priority > priority) {
      existing.priority = priority;

      updateStyleTagForPriority(priority);
    }

    return createCleanupFunction(className);
  }

  styleRegistry.set(className, {
    css,
    priority,
    usages: 1,
  });

  updateStyleTagForPriority(priority);

  return createCleanupFunction(className);
};
