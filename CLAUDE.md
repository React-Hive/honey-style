# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`@react-hive/honey-style` — a runtime CSS-in-JS library for React 19. It compiles tagged-template CSS into scoped, deduplicated rules injected through `<style>` tags, with a themed `@honey-*` at-rule layer on top of standard CSS.

Package manager is **pnpm** (see `pnpm-workspace.yaml`, `pnpm-lock.yaml`).

## Commands

```bash
pnpm test                                  # run the full suite once (vitest has watch:false)
pnpm test src/css/__tests__/if-at-rule.spec.tsx   # single file
pnpm vitest -t 'should resolve "&" inside'        # single test by name
pnpm build                                 # webpack → dist (ESM + CJS + dev CJS)
pnpm performanceTest                       # benchmarks, writes benchmarks/*.json
pnpm diagnostics                           # tsc --extendedDiagnostics → diagnostics/latest.json
pnpm eslint .                              # no npm script; eslint.config.mjs is configured
```

`pnpm test` excludes `**/*.performance.spec.tsx`; only `pnpm performanceTest` runs those.

The husky `pre-commit` hook runs `pnpm diagnostics` and `git add diagnostics`, so `diagnostics/latest.json` is committed on every commit — expect it in diffs.

Release: `prepublishOnly` runs clean → test → build; pushing to the `release` branch triggers the publish workflow. Commit subjects follow `<version> - <summary>` and the version in `package.json` is bumped in the same commit.

## Architecture

### The two-stage CSS pipeline

Styles are compiled in two distinct stages, which is the single most important thing to understand:

1. **Template → raw CSS string.** `css()` (`src/css/css.ts`) returns a closure `(context) => string`. It is created once at component-definition time. Interpolations resolve at render time against the context (`{ ...defaultProps, ...props, theme }`). A styled component interpolated into another's template resolves to its component-id selector (`.hsc-xxx`), which is how `${Box} { ... }` targeting works.

2. **Raw CSS → final CSS.** `processCss()` (`src/css/process-css.ts`) wraps the raw CSS in the scope selector, parses it to an AST with `parseCss` from `@react-hive/honey-css`, runs an ordered transformer chain, then `compileCss()` (`src/css/compile-css.ts`) scopes selectors, flattens nesting, and stringifies.

All CSS parsing/AST/stringify primitives live in the **`@react-hive/honey-css`** dependency, not in this repo. This repo owns the transformers and the React integration. `@react-hive/honey-utils` supplies generic helpers (`hashString`, `toKebabCase`, `assert`, …).

### Transformer chain

The order in the `transformers` array in `process-css.ts` is significant: `if → stack → inline → center → absolute-fill → ellipsis → media → spacing`. Spacing runs last so it also normalizes declarations emitted by the earlier at-rule transformers.

**To add a new `@honey-*` at-rule:**
- Create `src/css/transform-<name>-at-rule.ts` using `createAtRuleTransformer(name, handler)`. The handler returns replacement AST nodes; `node.body` has already been recursively transformed for you. Return `[]` to drop the block.
- If the rule needs the theme, export a `create<Name>Transformer({ theme })` factory instead (see `create-media-at-rule-transformer.ts`, `create-spacing-transformer.ts`).
- Register it in the `transformers` array in `process-css.ts`.
- Add a spec in `src/css/__tests__/`.

`compileCss` only scopes at-rules listed in `SCOPED_AT_RULES` (`media`, `supports`, `container`, `layer`); other at-rules pass through untouched.

### Style registry and injection (`src/mount-style.ts`)

- The class name is a **hash of the raw CSS** (`hscn-<hash>`), so identical CSS from different components collapses to one registry entry, refcounted via `usages`.
- The registry lives on `window[Symbol.for('honey-style-registry')]` so duplicate module instances share it.
- One `<style data-honey-style>` tag **per priority number**, inserted into `<head>` in ascending priority order.
- Mounting updates the tag synchronously; cleanup is batched through `queueMicrotask`. When `usages` hits zero the entry is dropped and the tag rebuilt (or removed if empty).

### Priority = composition depth

`priority` is the `__compositionDepth` prop (`HONEY_STYLED_COMPOSITION_DEPTH_PROP`). When a styled component wraps another styled component, it passes `__compositionDepth - 1` down. Base components therefore get lower (more negative) priorities, their style tags land earlier in `<head>`, and the outer wrapper's CSS wins by source order — no `!important` or specificity hacks. Changing this propagation changes override semantics across the whole library.

### Styled component identity

Each styled component gets two class names: a stable per-component `componentId` (`hsc-<id>`, exposed as the `$$ComponentId` property and used for interpolation targeting) and the hashed `hscn-<hash>` class that actually carries the CSS. Styles mount in `useInsertionEffect` keyed on the hashed class name.

### Prop filtering

When the finally rendered element is a native tag, props are filtered through `filterNonHtmlAttrs` against the `VALID_DOM_ELEMENT_ATTRS` set in `src/constants.ts` (plus any `data-*` / `aria-*`). **A new HTML/SVG/event attribute silently disappears unless it is added to those sets.** The `omitProps` option on `styled()` strips props before this step.

### Theme

`HoneyStyleProvider` → `HoneyStyleContext` → `useHoneyStyle()` (asserts the provider is present). The theme shape is designed for **module augmentation**: consumers `declare module '@react-hive/honey-style'` to extend `HoneyColors`, `HoneyFonts`, `HoneyDimensions`, and `HoneyTheme` (see the JSDoc examples in `src/types/theme.ts`). Resolver helpers (`resolveSpacing`, `resolveColor`, `resolveFont`, `resolveDimension` in `src/utils.ts`) are curried as `(args) => ({ theme }) => value` so they can be dropped straight into a template literal, and are also exposed pre-bound on the context value.

Spacing tokens: unitless numbers in spacing properties are multiplied by `theme.spacings.base` (`padding: 2` → `16px`). Values carrying a unit, or containing parentheses (`calc()`, `var()`), pass through untouched — see `resolve-spacing-value.ts`.

### `__DEV__`

`__DEV__` (`src/constants.ts`) is true only when `NODE_ENV !== 'production'`, `window` exists, **and** `VITEST_WORKER_ID` is unset — so dev-only warnings and `displayName` assignment are off during tests. Don't write tests that assert on dev warnings.

## Testing conventions

- Tests live in `__tests__/` directories beside the code, named `*.spec.ts(x)`; mocks in `src/__mocks__` (`themeMock`).
- Vitest globals are enabled — no need to import `describe`/`it`/`expect`.
- Component tests render through a local `customRender` helper that wraps the element in `<HoneyStyleProvider theme={themeMock}>`, then assert with `toHaveStyle` / `toHaveAttribute` from `@testing-library/jest-dom`.
- Pure AST tests (e.g. `compile-css.spec.ts`) build nodes with small local `decl`/`rule`/`at`/`sheet` factory helpers and assert on the exact stringified output.
- `styled-components` is a peer dependency used only by the comparison benchmark in `src/__tests__/styled-components.performance.spec.tsx`.

## Build output

`webpack.config.mjs` emits three bundles from `src/index.ts`: `index.mjs` (ESM), `index.cjs` (CJS), and `index.dev.cjs` (development mode, wired to the `development` export condition in `package.json`). `react` is external. `tsconfig.build.json` emits declarations and excludes mocks and tests.
