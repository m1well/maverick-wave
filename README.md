# MaverickWave

A lightweight, modern CSS framework for building responsive websites with elegance and speed. MaverickWave provides a clean foundation suitable for projects ranging from personal portfolios to corporate websites and e-commerce platforms.

While AI tools helped kickstart the development of some components and provided initial structure, approximately 80% of the codebase required manual refinement and customization. The framework has been meticulously crafted to ensure:

- Consistent implementation of custom variables throughout the system
- Proper integration between components and logical SCSS structure
- Optimized specificity and selector hierarchy
- Reliable responsive behavior across devices
- Built-in dark mode support and accessibility considerations

The result is a framework that balances utility with simplicity, offering developers a solid foundation that can be easily customized.

➡️ [**View the Live Showcase & Documentation**](https://maverick-wave.m1well.com)

## Features

- Responsive Grid System
- 30+ UI Components: Buttons, Cards, Panels, Tabs, Accordions, Modals, Tiles, Alerts, Spinners, Progress Bars, Avatars, Tags, Ratings, Stepper, Skeleton Loader, Empty State, Divider, and more
- Form Elements: Input, Select, Textarea, Checkbox, Radio, Toggle, Input Group, with `mw-field` wrapper pattern for Angular Reactive Forms
- Utility Classes for spacing, flex, display, and typography
- Easy Customization via CSS Custom Properties
- Built-in Light & Dark Mode with optional theme switching
- SCSS Source Files for advanced customization (Dart Sass, `@use`/`@forward`)
- Minimal JavaScript footprint (single vanilla JS file, no dependencies)

## Installation & Usage

### 1. CDN (jsDelivr)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My MaverickWave Project</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/maverick-wave@3.7.0/maverick-wave.min.css"
    />
  </head>
  <body>
    <!-- Your content here -->
    <script src="https://cdn.jsdelivr.net/npm/maverick-wave@3.7.0/maverick-wave.min.js"></script>
  </body>
</html>
```

Always pin to a specific version in production for stability.

### 2. Direct Download

Download `maverick-wave.min.css` and `maverick-wave.min.js` from the [latest release](https://github.com/m1well/maverick-wave/releases) and include them manually:

```html
<link rel="stylesheet" href="path/to/maverick-wave.min.css" />
<script src="path/to/maverick-wave.min.js"></script>
```

## Customization

### CSS Custom Properties

There are thirteen root color tokens. Everything else — hover tones, translucent
backgrounds, borders, muted text — is derived from them at runtime with
`color-mix()`, so overriding a root token is enough. Load your stylesheet
**after** `maverick-wave.min.css`:

```css
:root {
  /* brand */
  --mw-primary-color: #e94560;
  --mw-secondary-color: #f39c12;

  /* status */
  --mw-success-color: #218838;
  --mw-warning-color: #d4a310;
  --mw-danger-color: #c82333;
  --mw-info-color: #17a2b8;

  /* neutrals and themes */
  --mw-gray-color: #565656;
  --mw-dark-page-background: #1a1a2e;
  --mw-dark-text-color: #d6dbdf;
  --mw-light-page-background: #f8f9fa;
  --mw-light-text-color: #1a1a1d;
  --mw-form-elements-background: #ffffff;

  /* text on solid colored surfaces: buttons, table and panel headers */
  --mw-accent-text-color: #ffffff;

  --mw-font-family-base: 'Your Font Name', sans-serif;
}
```

Setting `--mw-primary-color` alone also retunes `--mw-primary-color-hover`,
`--mw-primary-background`, `--mw-primary-background-hover`,
`--mw-primary-info-background` and `--mw-border-accent`. The same holds for
`--mw-dark-page-background`, which drives the dark card, footer and border
tones. Each derived token can still be overridden individually if you want to
break out of the scale.

### SCSS Source

For full control, clone the repository and integrate `src/scss/main.scss` into your Sass build (Dart Sass required). MaverickWave uses modern `@use`/`@forward` syntax. Pass your overrides through `with`:

```scss
// your styles.scss

@use 'path/to/maverick-wave/src/scss/main' with (
  // Optional: choose theme mode ('switchable' | 'dark' | 'light')
  $mw-theme-mode: 'switchable',

  // Override root colors
  $primary-color: #e94560,
  $secondary-color: #f39c12,
  $dark-background: #1f1f2e,
  $light-background: #f8f9fa
);
```

> Plain variable assignments before `@use` have no effect — the framework
> declares its root colors with `!default`, which only `@use ... with` feeds.

### Importing Only What You Need

Every layer forwards one module per file and no `@extend` crosses a file
boundary, so components can be imported individually. Applications typically
have no use for the marketing components (`blog-post`, `gallery`,
`content-slider`, `techstack-bucket`, `tiles`, `coming-soon`, `ratings`,
`home`), and Angular bundle budgets notice the difference.

```scss
// styles.scss — configuration first, then pick
@use 'maverick-wave/src/scss/abstracts/variables' with (
  $primary-color: #0f766e
);

@use 'maverick-wave/src/scss/base'; // required: :root tokens, reset, typography

@use 'maverick-wave/src/scss/layout/grid';
@use 'maverick-wave/src/scss/layout/page-header';
@use 'maverick-wave/src/scss/components/buttons';
@use 'maverick-wave/src/scss/components/cards';
@use 'maverick-wave/src/scss/components/modals';
@use 'maverick-wave/src/scss/components/tables';
@use 'maverick-wave/src/scss/components/tags';
@use 'maverick-wave/src/scss/form-elements';
@use 'maverick-wave/src/scss/utilities';
```

A typical application subset like the one above compiles to roughly 98 kB raw /
15 kB gzipped, against 147 kB / 22.5 kB for the full build.

> **`base` is not optional.** It carries the `:root` custom properties — without
> it every component renders without colors. If you bring your own reset, use
> `@use 'maverick-wave/src/scss/base/base'` for the token block alone.
> The `with (...)` configuration has to be the first statement in the file,
> because every module loads `abstracts/variables` itself.

### Angular Integration

Reference the stylesheet in `angular.json` (or import the SCSS source as shown
above):

```json
"styles": ["src/assets/maverick-wave.min.css", "src/styles.scss"]
```

> **Do not add `maverick-wave.min.js` to a SPA.** It wires everything up once on
> `DOMContentLoaded` and writes straight into the DOM: components rendered later
> are never initialized, and the theme toggle mutates the DOM behind Angular's
> change detection. The behaviors it covers (accordion, tabs, modal close, mobile
> nav, scroll spy, theme toggle, progress bars, sliders, alerts, galleries) are a
> few lines each in a component — the framework's state classes are the whole
> contract. Theme switching, for example, is a single class on `<body>`:

```typescript
// theme.service.ts
document.body.classList.toggle('mw-theme-light', isLight);
```

The `mw-field` wrapper groups label, control, hint and error. Bind the error
state yourself — the framework does not style Angular's `ng-invalid` /
`ng-touched` classes:

```html
<div
  class="mw-field"
  [class.mw-field-has-error]="email.invalid && email.touched"
>
  <label class="mw-field-label mw-required" for="email">Email</label>
  <input id="email" type="email" class="mw-input" formControlName="email" />
  @if (email.invalid && email.touched) {
  <span class="mw-field-error">
    <i class="fas fa-exclamation-circle"></i> Please enter a valid email
    address.
  </span>
  }
</div>
```

A complete usage guide for AI coding assistants — every component, token,
integration pattern and example — ships with the package as a Claude Code skill
in `.claude/skills/maverick-wave/`.

## Development

### Prerequisites

- Node.js v18 or newer
- npm
- Git

### Setup

```bash
git clone https://github.com/m1well/maverick-wave.git
cd maverick-wave
npm install
```

### Development Commands

```bash
npm run start     # Start Gulp watcher (recompiles on changes)
npm run showcase  # Serve the built dist/ on http://localhost:8888
npm run build     # Full clean build → dist/
npm run format    # Format all source files with Prettier
npm run verify    # Check dist/ for unused/undefined tokens and unknown classes
npm run release   # Build non-minified release files to project root
```

`npm run verify` runs against `dist/`, so build first. It fails when a token is
referenced but never defined, when a token is defined but never used, or when
the showcase or the docs use a `mw-*` class the CSS does not generate.

## Project Structure

```
maverick-wave/
├── dist/                   # Compiled output (CSS, JS, HTML showcase)
├── src/
│   ├── assets/             # Logos, favicons
│   ├── js/                 # JavaScript source (single file)
│   ├── partials/           # HTML partials for the showcase
│   └── scss/
│       ├── abstracts/      # Variables, mixins, functions
│       ├── base/           # Reset, typography
│       ├── components/     # Component styles (one file per component)
│       ├── form-elements/  # Input, select, checkbox, toggle, etc.
│       ├── layout/         # Grid, container, header, footer
│       ├── utilities/      # Spacing, flex, display helpers
│       └── main.scss       # SCSS entry point
├── .claude/
│   ├── commands/mw.md      # Claude Code slash command (Angular quick reference)
│   └── skills/
│       └── maverick-wave/  # Claude Code skill: full usage guide + examples
├── scripts/verify.js       # Class and token consistency check (npm run verify)
├── .prettierrc.json        # Prettier configuration
├── gulpfile.js             # Gulp tasks configuration
├── index.html              # Showcase entry point
└── package.json
```

## Contribution

Contributions are welcome!

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Make your changes and run `npm run format`, then `npm run build && npm run verify`.
4. Commit using Conventional Commits (e.g., `feat: add new component`).
5. Push and open a Pull Request.

## License

MIT License

## Author

Created by [m1well](https://m1well.com)
