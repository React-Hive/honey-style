interface StyleRegistryEntry {
  css: string;
  usages: number;
  priority: number;
}

interface Window {
  __honeyStyleRegistry?: Map<string, StyleRegistryEntry>;
}
