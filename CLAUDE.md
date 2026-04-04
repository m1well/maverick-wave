# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MaverickWave is a lightweight, modern CSS framework providing a grid system, 25+ UI components, utility classes, and light/dark mode support. The repo also contains the showcase/documentation website bundled into the distribution.

## Commands

```bash
npm start          # Build + watch for changes (development)
npm run build      # Clean dist, then full build
npm run showcase   # Serve built dist on http://localhost:8888
npm run clean      # Remove dist/ and root maverick-wave.{css,js}
npm run format     # Format all SCSS, JS, JSON, HTML, MD with Prettier
npm run release    # Build non-minified maverick-wave.{css,js} in project root
```

There are no test or lint scripts.

## Architecture

**Build pipeline** — `gulpfile.js` orchestrates everything: SCSS compilation (autoprefixed, minified), JS minification via Terser, HTML templating via `gulp-file-include`, asset copying, and build-info injection (`{{VERSION}}`, `{{LAST_BUILD_DATE}}`, `{{LAST_BUILD_YEAR}}` placeholders replaced in HTML at build time).

**SCSS layers** (`src/scss/`) follow an ITCSS-inspired structure:

- `abstracts/` — CSS custom properties, mixins, SCSS functions (color variant generation)
- `base/` — Reset, element defaults, typography
- `components/` — Self-contained component styles (25+ files, one per component)
- `form-elements/` — Form input/select/checkbox-specific styles
- `layout/` — Grid, container, header/footer, section
- `utilities/` — Spacing, flex, display utility classes
- `main.scss` — Entry point using `@use`/`@forward` (not `@import`)

**JavaScript** (`src/js/main.js`) — Single file. All components auto-initialize on `DOMContentLoaded`. Includes: gallery slider, theme toggle (persisted to localStorage), accordion, mobile nav, progress bar (IntersectionObserver), scroll spy, tabs, alerts/toasts, modals, range inputs.

**HTML showcase** (`index.html` + `src/partials/`) — The top-level `index.html` uses `@@include()` syntax to pull in 40+ partials from `src/partials/`. These compile into `dist/index.html`.

## Naming Conventions

- **CSS classes**: `mw-` prefix for all framework classes (`.mw-button`, `.mw-card`, `.mw-modal`)
- **State classes**: `.mw-active`, `.mw-selected`
- **CSS custom properties**: `--mw-` prefix (`--mw-primary-color`, `--mw-font-family-base`)
- **Theme control**: `--mw-internal-theme-mode` CSS var controls whether theme is switchable/fixed-light/fixed-dark; body class `mw-theme-light` toggles light mode

## Code Formatting

Prettier is the single formatter. Config (`.prettierrc.json`): single quotes, 80-char print width, 2-space tabs, semicolons, trailing commas (ES5). Run `npm run format` before committing.

## Commit Convention

Follows Conventional Commits: `feat:`, `fix:`, `release:`, etc.
