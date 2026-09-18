# MaverickWave

A lightweight, modern CSS framework for building responsive websites with elegance and speed. MaverickWave provides a clean foundation suitable for projects ranging from personal portfolios to corporate websites and e-commerce platforms.

While AI tools helped kickstart the development of some components and provided initial structure, approximately 80% of the codebase required manual refinement and customization. The framework has been meticulously crafted to ensure:

- Consistent implementation of custom variables throughout the system
- Proper integration between components and logical SCSS structure
- Cascade layers throughout, so a project overrides any `mw-` class with a plain selector
- Reliable responsive behavior across devices
- Built-in dark mode support and accessibility considerations

The result is a framework that balances utility with simplicity, offering developers a solid foundation that can be easily customized.

➡️ [**View the Live Showcase & Documentation**](https://maverick-wave.m1well.com)

## Features

- Responsive Grid System
- 30+ UI Components: Buttons, Cards, Panels, Tabs, Accordions, Modals, Tiles, Alerts, Spinners, Progress Bars, Avatars, Tags, Badges, Dropdown, Ratings, Stepper, Skeleton Loader, Empty State, Price, Offer Cards, Divider, and more
- Form Elements: Input, Select, Textarea, Checkbox, Radio, Toggle, Input Group, with `mw-field` wrapper pattern for Angular Reactive Forms
- Utility Classes for spacing, flex, display, typography, text overflow, elevation and aspect ratio
- A five-step elevation ramp and a motion scale, so every shadow and every transition in the framework comes from one place
- Mobile as a first-class target: 44px touch targets on a coarse pointer, modals that become bottom sheets, press states on everything, and hover effects that do not latch after a tap
- Easy Customization via CSS Custom Properties
- Built-in Light & Dark Mode - follows the OS by default, switchable per reader
- SCSS Source Files for advanced customization (Dart Sass, `@use`/`@forward`)
- Modals as `<div>` or as `<dialog>` - the latter brings the focus trap, Escape and the inert background from the platform
- Native form validation is styled through `:user-invalid`, alongside the class-driven error states for reactive forms
- Minimal JavaScript footprint (single vanilla JS file, no dependencies)

## Installation & Usage

### 1. CDN (jsDelivr)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, viewport-fit=cover"
    />
    <title>My MaverickWave Project</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/maverick-wave@5.20.0/maverick-wave.min.css"
    />
  </head>
  <body>
    <!-- Your content here -->
    <script src="https://cdn.jsdelivr.net/npm/maverick-wave@5.20.0/maverick-wave.min.js"></script>
  </body>
</html>
```

Always pin to a specific version in production for stability.

`viewport-fit=cover` is not optional. The container gutter, the mobile nav panel
and the modals budget for the cutout with `env(safe-area-inset-*)`, and iOS
resolves every one of those to `0` without it. On localhost the framework writes
a console warning when it is missing.

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
`--mw-primary-text-color`, `--mw-border-accent` and the whole `--mw-header-*`
set - the bar is the primary darkened toward black, so the chrome follows the
brand without a second value. The same holds for `--mw-dark-page-background`,
which drives the dark card, footer and border tones. Each derived token can
still be overridden individually if you want to break out of the scale.

> The derivation needs `color-mix()` **and** relative colour syntax
> (`oklch(from ...)`): Chrome 119+, Safari 16.4+, Firefox 128+. Older browsers
> get no colours at all, not merely worse ones. The same floor is set as
> `browserslist` in `package.json`, which is what Autoprefixer and cssnano read
> when building `dist/`.

### Elevation and motion

Two scales that are not colours, and both are tokens for the same reason: a
framework where every component picks its own shadow and its own timing looks
assembled rather than designed.

```css
:root {
  /* Elevation. Each level is two shadows - a tight contact layer that gives
     the box weight, and a wide ambient one that says how high it floats.
     One ramp for both themes; the theme arrives through the shadow tokens
     the levels are built from. */
  --mw-elevation-1: /* resting: inputs, tags, small controls */;
  --mw-elevation-2: /* raised: cards and panels at rest */;
  --mw-elevation-3: /* floating: a card under the pointer */;
  --mw-elevation-4: /* overlay: dropdowns, popovers, drawer */;
  --mw-elevation-5: /* modal */;

  /* Motion */
  --mw-duration-instant: 90ms; /* a press */
  --mw-duration-fast: 150ms; /* a colour swap under the pointer */
  --mw-duration-base: 240ms; /* the default */
  --mw-duration-slow: 400ms; /* something crossing the screen */
  --mw-duration-slower: 700ms; /* a slider, a progress bar */
  --mw-ease-out: cubic-bezier(0.22, 1, 0.36, 1); /* things arriving */
  --mw-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1); /* A to B and back */
  --mw-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* a pop */

  /* The two ready-made transitions every component uses */
  --mw-transition: /* the explicit paint-only property list, base duration */;
  --mw-transition-fast: /* the same list, fast duration */;

  /* Control sizes - one height per step, shared by input, select, textarea
     and button, so a field and the button beside it line up */
  --mw-control-height-sm: 1.875rem;
  --mw-control-height: 2.125rem;
  --mw-control-height-lg: 2.375rem;
  --mw-control-font-sm: 0.8rem;
  --mw-control-font: 0.9rem;
  --mw-control-font-lg: 1rem;
  --mw-control-line-height: 1.35;

  /* Focus */
  --mw-focus-ring-width: 2px;
  --mw-focus-ring-offset: 2px;
  --mw-focus-ring-color: var(--mw-primary-text-color);
  --mw-focus-halo-size: 3px; /* the soft ring a form field gets instead */
  --mw-focus-halo-opacity: 28%;
}
```

`--mw-transition` deliberately lists its properties rather than saying `all`: a
width that changes at a breakpoint should snap, not crawl. Anything that really
does want to animate a size says so itself. `--mw-duration-zoom` (650ms) is the
one for a large surface actually travelling - an image scaling inside a card, a
slider track crossing its frame - because the eye reads speed as distance over
time, and the 300ms that feels right on a 40px button feels snatched on a 300px
photo.

The control scale is what makes a form row line up. Each field used to work its
own height out from its own font size, its own line-height and its own padding,
and no two of them agreed: an input, a select and a button side by side measured
32.2, 34.4 and 37.2 pixels. They all measure the same now, and the fields share
one font scale instead of the select sitting a step below the input next to it.

Under `prefers-reduced-motion: reduce` the duration tokens all drop to 1ms and a
blanket rule catches anything that names its own timing - including whatever you
wrote yourself. 1ms rather than 0, so a script waiting on `transitionend` still
gets one.

To retune from SCSS instead, the same values are `$duration-*`, `$ease-*`,
`$control-height*` / `$control-font*`, `$focus-ring-*` and `$shadow-near-*` /
`$shadow-far-*` in `abstracts/_variables.scss`, all `!default`.

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

### Overriding

Everything the framework emits sits in cascade layers:

```css
@layer mw.reset, mw.base, mw.forms, mw.components, mw.layout, mw.utilities;
```

An unlayered rule beats every layer no matter how specific it is, so a project
overrides a component with a single class selector - no `!important`, no
`.mw-card.mw-card`:

```css
.mw-card {
  border-radius: 12px;
}
```

`!important` is not the stronger version of that, it is the weaker one: for
important declarations the layer order reverses and unlayered comes last, so an
important rule in `mw.base` beats an important one of yours even behind an ID
selector. A project coming from before 5.0 can drop the `!important`s it carried
for these overrides - the plain rule already wins.

That cuts both ways: third-party CSS loaded unlayered also beats the framework,
which is how an icon font ends up winning over `mw-tags-icon`. Load it into a
layer of its own:

```html
<style>
  @layer vendor, mw;
  @import url('https://cdn.example.com/font-awesome.css') layer(vendor);
</style>
<link rel="stylesheet" href="maverick-wave.min.css" />
```

### Site-wide variants

Fifteen classes on `<html>` retune the whole look without touching markup or
rebuilding. They stack.

| Class                | Effect                                                                  |
| -------------------- | ----------------------------------------------------------------------- |
| `mw-corners-even`    | Drops the surface signature - every panel becomes an evenly rounded box |
| `mw-accent-single`   | One brand colour instead of two; `mw-btn-secondary` turns outline       |
| `mw-shadows-flat`    | Elevation 1-3 to `none`; dropdown and modal keep theirs                 |
| `mw-surfaces-flush`  | Cards, panels and footer on the page colour, held by their border       |
| `mw-hover-static`    | No hover travels - lifts and image zooms go, colour still responds      |
| `mw-scroll-static`   | No scroll entrance - `mw-reveal` blocks sit where they land             |
| `mw-sections-plain`  | The hatch behind `mw-section-alternate` collapses into the page colour  |
| `mw-headings-caps`   | `h1`-`h3` in capitals                                                   |
| `mw-links-underline` | Links underlined at rest; the stroke thickens on hover                  |
| `mw-btn-pill`        | Fully rounded buttons; form fields keep their radius                    |
| `mw-btn-square`      | Buttons cut to a hard corner while the page keeps its radius            |
| `mw-btn-glass`       | Filled buttons become a translucent wash with a lit top edge            |
| `mw-btn-tactile`     | Filled buttons stand on a darker edge and sink onto it when pressed     |
| `mw-density-compact` | Less padding in cards, panels and controls; type stays put              |
| `mw-density-roomy`   | More of the same                                                        |

Six properties do the rest: `--mw-radius-scale` multiplies every radius (`0`
squares the framework off), `--mw-root-font-size` moves the whole rem scale,
`--mw-motion-scale` the tempo of every transition, plus
`--mw-font-family-heading`, `--mw-container-width` and
`--mw-section-padding-block`.

The [showcase](https://maverick-wave.m1well.com) has a picker for all of them,
and the URL carries whatever is set - send that link and the next person opens
the page exactly as you left it. The panel prints the same setup as markup and
CSS to copy into a project.

A variant of your own that retunes a theme-bound token has to target
`:root.your-class` **and** `:root.your-class .mw-theme-light` - the light theme
re-declares those on `<body>` and would shadow a root-only value. The elevation
tokens are the exception and need only `:root`.

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

### Mixins and Functions

`@use 'maverick-wave/src/scss/abstracts' as *` brings these into your own rules.
They exist on the SCSS path only - the compiled CSS carries none of them.

- `fluid($min, $max, $from: 'xs', $to: 'md')` - a clamp between two sizes. Each
  end is a key of `$font-sizes` or a plain rem/px length, so a hero that does not
  sit on the scale still gets one. The rem term is the point: a vw-only clamp
  ignores the reader's font size. The default range stops at `md`, a headline
  passes `$to: 'xl'`.
- `media-up($bp)` / `media-down($bp)` - the `$breakpoints` map as a query.
- `touch-context($bp: 'md')` - coarse pointer _or_ narrow viewport, the condition
  every target-size rule in the framework hangs under.
- `touch-floor($size: 2.75rem)` - that condition plus a `min-height`. Not for a
  link inside a sentence: WCAG 2.5.8 exempts those, and a `min-height` there
  pushes the lines of the paragraph apart.
- `hit-area($grow: 6px)` - grows the hit area through `::after` without touching
  the silhouette, for a control whose size is the design. Neighbours need a gap
  of at least twice `$grow`, or two hit areas overlap.

```scss
@use 'maverick-wave/src/scss/abstracts' as *;

.hero h1 {
  font-size: fluid(1.95rem, 4.2rem, $to: 'xl');
}

.my-close-button {
  @include touch-floor;
}
```

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

A typical application subset like the one above compiles to roughly 113 kB raw /
17 kB gzipped, against 281 kB / 40 kB for the full build.

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
> contract. Theme switching, for example, is a pair of classes on `<body>`:

```typescript
// theme.service.ts - mw-theme-switching suppresses the transitions the flip
// would otherwise start on every element at once
const root = document.documentElement;

root.classList.add('mw-theme-switching');
document.body.classList.toggle('mw-theme-light', isLight);
// the explicit counterpart - without it a dark choice on a light machine
// falls back to the OS preference
document.body.classList.toggle('mw-theme-dark', !isLight);
void root.offsetHeight;
root.classList.remove('mw-theme-switching');
```

With neither class the page follows `prefers-color-scheme`, so an app that has
nothing stored yet can simply leave both off.

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
in `.claude/skills/mw-maverick-wave/`.

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
│   └── skills/
│       └── mw-maverick-wave/  # Claude Code skill: full usage guide + examples
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
