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

### 1. CDN (jsDelivr — GitHub)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My MaverickWave Project</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/m1well/maverick-wave@v2.36.1/maverick-wave.min.css"
    />
  </head>
  <body>
    <!-- Your content here -->

    <script src="https://cdn.jsdelivr.net/gh/m1well/maverick-wave@v2.36.1/maverick-wave.min.js"></script>
  </body>
</html>
```

Always pin to a specific version tag (e.g., `@v2.36.1`) in production for stability.

### 2. Direct Download

Download `maverick-wave.min.css` and `maverick-wave.min.js` from the [latest release](https://github.com/m1well/maverick-wave/releases) and include them manually:

```html
<link rel="stylesheet" href="path/to/maverick-wave.min.css" />
<script src="path/to/maverick-wave.min.js"></script>
```

## Customization

### CSS Custom Properties

Override framework variables in your own stylesheet (load it **after** `maverick-wave.min.css`):

```css
:root {
  --mw-primary-color: #your-brand-color;
  --mw-secondary-color: #your-secondary-color;
  --mw-dark-page-background: #1a1a2e;
  --mw-dark-card-background: #2a2a4a;
  --mw-font-family-base: 'Your Font Name', sans-serif;
}
```

### SCSS Source

For full control, clone the repository and integrate `src/scss/main.scss` into your Sass build (Dart Sass required). MaverickWave uses modern `@use`/`@forward` syntax. Set your variable overrides before the `@use` statement:

```scss
// your styles.scss

// Optional: choose theme mode ('switchable' | 'dark' | 'light')
$mw-theme-mode: 'switchable';

// Override base colors
$primary-color: #e94560;
$secondary-color: #f39c12;
$dark-background: #1f1f2e;
$light-background: #f8f9fa;

// Import the framework
@use 'path/to/maverick-wave/src/scss/main';
```

### Angular Integration

Copy `maverick-wave.min.css` and `maverick-wave.min.js` into your Angular project (e.g. `src/assets/`) and reference them in `angular.json`:

```json
"styles": ["src/assets/maverick-wave.min.css", "src/styles.scss"],
"scripts": ["src/assets/maverick-wave.min.js"]
```

MaverickWave automatically styles Angular Reactive Forms state classes (`.ng-invalid.ng-touched`, `.ng-valid.ng-touched.ng-dirty`). Use the `mw-field` wrapper pattern:

```html
<div
  class="mw-field"
  [class.mw-field-has-error]="email.invalid && email.touched"
>
  <label class="mw-field-label mw-required" for="email">Email</label>
  <input id="email" type="email" class="mw-input" formControlName="email" />
  <span class="mw-field-error" *ngIf="email.invalid && email.touched">
    <i class="fas fa-exclamation-circle"></i> Please enter a valid email
    address.
  </span>
</div>
```

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
npm run release   # Build non-minified release files to project root
```

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
│   └── commands/mw.md      # Claude Code slash command for Angular projects
├── .prettierrc.json        # Prettier configuration
├── gulpfile.js             # Gulp tasks configuration
├── index.html              # Showcase entry point
└── package.json
```

## Contribution

Contributions are welcome!

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Make your changes and run `npm run format`.
4. Commit using Conventional Commits (e.g., `feat: add new component`).
5. Push and open a Pull Request.

## License

MIT License

## Author

Created by [m1well](https://m1well.com)
