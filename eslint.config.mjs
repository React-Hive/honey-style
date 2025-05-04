import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{ts,jsx,tsx}'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  pluginReact.configs.flat.recommended,
];
