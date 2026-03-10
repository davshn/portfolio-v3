# Project Context

## Stack
TypeScript (strict), Astro 5.x, React 19, Node (ESM)

## Architecture
Astro static site with React islands for interactivity. Single-page portfolio with fixed sidebar nav. File-based routing under `src/pages/`. Flat component structure: `components/ui/`, `components/sections/`, `components/layout/`.

## Testing
No test runner detected. No jest/vitest config present.

## Style
ESLint (eslint-config-love + eslint-plugin-astro + jsx-a11y + import + prettier) + Prettier with prettier-plugin-astro.

## CI
Not detected.

## Conventions
ESM modules (`"type": "module"`). React JSX via `@astrojs/react` integration. Tailwind for styling (per CLAUDE.md). React islands use `client:visible` by default.
