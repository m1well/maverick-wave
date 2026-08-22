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
      href="https://cdn.jsdelivr.net/npm/maverick-wave@4.4.1/maverick-wave.min.css"
    />
  </head>
  <body>
    <!-- Your content here -->
    <script src="https://cdn.jsdelivr.net/npm/maverick-wave@4.4.1/maverick-wave.min.js"></script>
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

There are thirteen root color tokens. Everything else - hover tones, translucent
backgrounds, borders, muted text - is derived from them at runtime with
`color-mix()`, so overriding a root token is enough. Load your stylesheet
**after** `maverick-wave.min.css`:

```css
:root {
  /* brand */
  --mw-primary-color: #0f766e;
  --mw-secondary-color: #b45309;

  /* status */
  --mw-success-color: #15803d;
  --mw-warning-color: #a16207;
  --mw-danger-color: #b91c1c;
  --mw-info-color: #0e7490;

  /* neutrals and themes */
  --mw-gray-color: #64748b;
  --mw-dark-page-background: #172127;
  --mw-dark-text-color: #e8eef0;
  --mw-light-page-background: #f2f6f7;
  --mw-light-text-color: #172127;
  --mw-form-elements-background: #f5f9fa;

  /* text on every solid colored surface: buttons, table and panel headers.
     The one token that cannot be derived - a light brand color needs a dark
     label, a dark one a light label. Set it opposite your --mw-primary-color. */
  --mw-accent-text-color: #f2fafa;

  /* per color override of that label, for a palette that does not sit on one
     side of the lightness scale. Same token for secondary, success, warning,
     danger and info. */
  --mw-primary-accent-text-color: #0b0f0a;

  --mw-font-family-base: 'Your Font Name', sans-serif;
}
```

Setting `--mw-primary-color` alone also retunes `--mw-primary-color-hover`,
`--mw-primary-background`, `--mw-primary-background-hover`,
`--mw-primary-text-color` and `--mw-border-accent`. The same holds for
`--mw-dark-page-background`, which drives the dark card, footer and border
tones. Each derived token can still be overridden individually if you want to
break out of the scale.

> The derivation needs `color-mix()` **and** relative colour syntax
> (`oklch(from ...)`): Chrome 119+, Safari 16.4+, Firefox 128+. Older browsers
> get no colours at all, not merely worse ones.

### Fill or ink

Every brand and status colour comes in two tokens, and picking the right one is
the whole trick:

- `--mw-primary-color` is the exact colour, for anything it **fills** - buttons,
  badges, bars, progress. The label on top is
  `--mw-primary-accent-text-color`.
- `--mw-primary-text-color` is the same colour tuned to the active theme, for
  anything drawn **on** a theme surface - text, icons, focus rings, accent
  borders and dividers.

The second one exists because a colour picked to carry a label is by definition
too dark or too light to be read _on_ the page it sits on. The ink token is
derived by clamping OKLch lightness and keeping hue and chroma:

```css
--mw-dark-primary-text-color: oklch(
  from var(--mw-primary-color) max(l, 0.68) c h
);
--mw-light-primary-text-color: oklch(
  from var(--mw-primary-color) min(l, 0.55) c h
);
```

That is a bound, not a target, which is what makes it work for any palette. A
dark brand colour gets lifted, a very light one gets deepened, and a colour
already inside the range passes through untouched - a neon green stays neon on
the dark page and only turns into a real green on the light one. The bounds are
`$ink-lightness-dark` and `$ink-lightness-light` in SCSS.
`--mw-secondary-text-color` and `--mw-success/warning/danger/info-text-color`
are derived the same way.

### The label on a fill

`--mw-accent-text-color` is the text on every solid coloured surface, and one
value for the whole palette only holds while all six colours sit on the same
side of the lightness scale. A neon green primary next to a deep blue secondary
needs a dark label on the one and a light label on the other, so every colour
carries its own override:

```css
:root {
  --mw-primary-color: #39ff14;
  /* the shared label stays light for the rest of the palette ... */
  --mw-accent-text-color: #f2f6fc;
  /* ... only the neon primary gets a dark one */
  --mw-primary-accent-text-color: #0b0f0a;
}
```

`--mw-secondary-accent-text-color` and
`--mw-success/warning/danger/info-accent-text-color` work the same way, and each
defaults to `--mw-accent-text-color`, so nothing changes until you set one.

Everything that fills a surface with one of the six colours reads the matching
token: buttons and mini buttons, the burger button, table and panel headers,
card badges and ribbons, segmented and tab items, stepper dots, calendar
selection, timeline dates, accordion headers and progress labels. The burger
button switches to `--mw-secondary-accent-text-color` while the drawer is open,
because its surface does the same - `--mw-header-burgerbutton-color` and
`--mw-header-burgerbutton-open-color` override the two states individually.

`--mw-text-muted-color` is built the other way round: a true gray at a fixed
lightness with `$muted-tint` (12%) of the primary colour mixed in, so the gray
belongs to the palette without carrying its saturation. Stepping the theme's
text colour back instead would hand its tint straight through - a mint white
page would end up with mint green secondary text. Set `$muted-tint: 0%` for a
neutral gray.

Tinted surfaces follow one rule as well: `--mw-*-background` is 20% of the
colour, `--mw-*-background-hover` 45%. Both stay close enough to the surface
underneath that `--mw-text-color` keeps working on top, which is what makes an
alert, badge or tag readable in either theme.

### The surface stack

Card, footer and border are derived from the page background by scaling its
OKLch lightness _and_ chroma by one factor, keeping the hue:

```css
--mw-dark-card-background: oklch(
  from var(--mw-dark-page-background) calc(l * 0.75) calc(c * 0.75) h
);
```

Both themes step a card **away from their text colour** - down into the dark
theme, up into the light one - so content always sits on the cleaner of the two
surfaces. Chroma rides along with lightness because that is what a hand-picked
stack does: a darker surface of the same hue carries less colour, not the same
colour at a lower lightness.

The one thing to know when picking `--mw-dark-page-background`: it needs
headroom underneath. On a near-black page the surfaces below it have nowhere to
go and cards collapse into the background, leaving only the border to separate
them. The default sits at OKLch lightness 0.24 for that reason.

Each factor is a `!default` SCSS knob, so how far a card sits from the page is
one number per theme:

| Knob                    | Default | Effect                                                             |
| ----------------------- | ------- | ------------------------------------------------------------------ |
| `$card-surface-dark`    | `0.85`  | Card in the dark theme - lower means a darker, more separated card |
| `$card-surface-light`   | `1.05`  | Card in the light theme - higher means a lighter card              |
| `$footer-surface-dark`  | `0.75`  | Footer and header chrome, dark theme                               |
| `$footer-surface-light` | `0.95`  | Footer and header chrome, light theme                              |

Below 1 steps toward black, above 1 toward white, so read `0.85` as "the card
sits at 85% of the page's lightness". Move both card knobs toward 1 for a flat,
borderless look; push them apart for cards that read as raised panels. The
footer knobs go further out than the card in the dark theme and the other way in
the light one, so the band under the page reads as chrome rather than as another
card - keep that ordering if you retune the card, or the footer stops looking
like a footer. The rule between the surfaces keeps its own fixed factor: it runs
against the card, or it disappears into what it separates.

### SCSS Source

For full control, clone the repository and integrate `src/scss/main.scss` into your Sass build (Dart Sass required). MaverickWave uses modern `@use`/`@forward` syntax. Pass your overrides through `with`:

```scss
// your styles.scss

@use 'path/to/maverick-wave/src/scss/main' with (
  // Optional: choose theme mode ('switchable' | 'dark' | 'light')
  $mw-theme-mode: 'switchable',

  // Override root colors
  $primary-color: #0f766e,
  $secondary-color: #b45309,
  $dark-background: #172127,
  $light-background: #f2f6f7,

  // Optional: the derivation knobs
  $ink-lightness-dark: 0.68,
  $ink-lightness-light: 0.55,
  $muted-tint: 12%,

  // Optional: how far card and footer sit from the page background
  $card-surface-dark: 0.85,
  $card-surface-light: 1.05,
  $footer-surface-dark: 0.75,
  $footer-surface-light: 0.95
);
```

> Plain variable assignments before `@use` have no effect - the framework
> declares its root colors with `!default`, which only `@use ... with` feeds.

### Importing Only What You Need

Every layer forwards one module per file and no `@extend` crosses a file
boundary, so components can be imported individually. Applications typically
have no use for the marketing components (`blog-post`, `gallery`,
`content-slider`, `techstack-bucket`, `tiles`, `coming-soon`, `ratings`,
`home`), and Angular bundle budgets notice the difference.

```scss
// styles.scss - configuration first, then pick
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

> **`base` is not optional.** It carries the `:root` custom properties - without
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
> few lines each in a component - the framework's state classes are the whole
> contract. Theme switching, for example, is a single class on `<body>`:

```typescript
// theme.service.ts
document.body.classList.toggle('mw-theme-light', isLight);
```

The `mw-field` wrapper groups label, control, hint and error. Bind the error
state yourself - the framework does not style Angular's `ng-invalid` /
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

A complete usage guide for AI coding assistants - every component, token,
integration pattern and example - ships with the package as a Claude Code skill
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
