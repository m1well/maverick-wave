# Theming, tokens & partial imports

## The model

Thirteen colours are configured, everything else is derived from them **at
runtime** with `color-mix()` and relative colour syntax. Overriding a root token
therefore retunes its whole family - hover tone, translucent backgrounds,
borders, the theme's surface stack, the ink variant the dark theme needs. That is
the difference to pre-3.4.0, where derived values were baked in at compile time
and a palette switch meant setting 41 variables.

Browser floor for that: `color-mix()` **and** `oklch(from ...)` - Chrome 119+,
Safari 16.4+, Firefox 128+.

```css
/* loaded after maverick-wave.min.css */
:root {
  --mw-primary-color: #0f766e; /* also retunes hover, backgrounds, border accent */
  --mw-secondary-color: #f39c12;

  --mw-success-color: #157f4b;
  --mw-warning-color: #bda817;
  --mw-danger-color: #c42b1c;
  --mw-info-color: #14618f;

  --mw-gray-color: #5a6478;

  --mw-dark-page-background: #171f30;
  --mw-dark-text-color: #e8ecf1;
  --mw-light-page-background: #f2f5f8;
  --mw-light-text-color: #0c1119;

  --mw-form-elements-background: #f4f7fb;

  /* text on every solid coloured surface, and the one token that cannot be
     derived: light brand colours need a dark label, dark ones a light label */
  --mw-accent-text-color: #ffffff;

  --mw-font-family-base: 'Inter', sans-serif;
}
```

## Which token for what

| Token                                                                                                                                                                              | Role                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mw-primary-color`                                                                                                                                                               | Brand colour as a **fill**: primary buttons, table headers, bars, badges - the label on top is `--mw-accent-text-color`                                                                                                   |
| `--mw-primary-text-color`                                                                                                                                                          | Brand colour as **ink** on a theme surface: text, icons, focus rings, accent borders. Derived by clamping OKLch lightness (`max(l, .68)` on dark, `min(l, .55)` on light), so a colour already in range is used untouched |
| `--mw-primary-color-hover`                                                                                                                                                         | Solid hover surface (derived: base + `$hover-shift` black, in both themes)                                                                                                                                                |
| `--mw-primary-background`                                                                                                                                                          | 20% tint - focus halo, alert/badge/tag surface, scrollbar tracks                                                                                                                                                          |
| `--mw-primary-background-hover`                                                                                                                                                    | 45% tint - row and list hover                                                                                                                                                                                             |
| `--mw-primary-info-background`                                                                                                                                                     | Alias of `--mw-primary-background`, so a component can interpolate one name across all six colours                                                                                                                        |
| `--mw-border-accent`                                                                                                                                                               | Translucent accent **line**: panel rules, dividers, tab underlines. Theme-aware (70% of `--mw-*-text-color`)                                                                                                              |
| `--mw-secondary-*`                                                                                                                                                                 | Same set for the second brand colour                                                                                                                                                                                      |
| `--mw-success/warning/danger/info-color`                                                                                                                                           | Status colours, each with `-text-color`, `-color-hover`, `-info-background`, `-info-background-hover`                                                                                                                     |
| `--mw-accent-text-color`                                                                                                                                                           | Text on any solid coloured surface (buttons, table/panel headers, badges, stepper dots)                                                                                                                                   |
| `--mw-gray-color`                                                                                                                                                                  | Neutral foreground: muted icons, tooltips                                                                                                                                                                                 |
| `--mw-gray-background`                                                                                                                                                             | Subtle neutral surface (20% alpha): zebra rows, disabled fields, tracks, skeletons                                                                                                                                        |
| `--mw-surface-muted`                                                                                                                                                               | Alias of `--mw-gray-background` under the name you reach for: a slightly set-off area _inside_ a card - hint block, framed paragraph, form summary                                                                        |
| `--mw-overlay-background`                                                                                                                                                          | Heavy scrim (60%) behind modals and blocking spinners                                                                                                                                                                     |
| `--mw-page-background`, `--mw-card-background`, `--mw-footer-background`, `--mw-border`, `--mw-shadow`, `--mw-text-color`, `--mw-text-muted-color`, `--mw-hero-overlay-background` | The **active theme** - aliases pointing at the `--mw-dark-*` or `--mw-light-*` set                                                                                                                                        |
| `--mw-header-*`                                                                                                                                                                    | Header chrome: `background`, `text-color`, `navbar-list-color`, `navbar-list-active-color`, `burgerbutton-color`, `border` - dark in both themes                                                                          |
| `--mw-form-elements-background`, `--mw-form-elements-color`                                                                                                                        | Form controls stay light in both themes and therefore have their own pair                                                                                                                                                 |
| `--mw-font-family-base`, `-heading`, `-mono`                                                                                                                                       | Font stacks - system stacks by default (`-mono` leads with Fira Code); no font is bundled. Configurable in SCSS, see below                                                                                                |
| `--mw-hero-background`                                                                                                                                                             | Hero image (`url(...)`)                                                                                                                                                                                                   |
| `--mw-transition`                                                                                                                                                                  | Global transition (`all 0.3s ease`)                                                                                                                                                                                       |
| `--mw-card-img-height`                                                                                                                                                             | Per-card image height (default `210px`; `mw-card-lg`/`-xl` set it to 340px/480px)                                                                                                                                         |
| `--mw-card-addon-color`                                                                                                                                                            | Background of `mw-card-badge` / `mw-card-ribbon`; the `mw-card-addon-*` classes set it, override it for a custom colour                                                                                                   |
| `--mw-table-scroll-height`                                                                                                                                                         | Per-table height cap for `mw-table-responsive-scroll`                                                                                                                                                                     |
| `--mw-kanban-background`, `--mw-kanban-lane-border`, `--mw-kanban-column-min-height`                                                                                               | Per-board surface, lane border and lane floor (120px, 90px on `mw-kanban-compact`)                                                                                                                                        |
| `--mw-container-width`, `--mw-container-width-sm`                                                                                                                                  | Content width of `mw-container` (`min(1200px, 89%)`, below 576px a 1rem gutter)                                                                                                                                           |
| `--mw-section-padding-block`                                                                                                                                                       | Top/bottom rhythm of `mw-section` (1.75rem)                                                                                                                                                                               |
| `--mw-calendar-dot`                                                                                                                                                                | Colour of a single calendar dot - set it per dot or per cell; the `mw-calendar-dot-*` classes are presets for it                                                                                                          |
| `--mw-scroll-hint-cover`                                                                                                                                                           | Colour the scroll hint on a tab bar fades into. Preset to the page, re-pointed to the card background inside `mw-card`, `mw-panel`, `mw-modal`, `mw-tile`, `mw-calendar`                                                  |
| `--mw-internal-theme-mode`                                                                                                                                                         | Read-only: what `$mw-theme-mode` was compiled to                                                                                                                                                                          |

`--mw-container-width`, `--mw-container-width-sm` and
`--mw-section-padding-block` are the knobs a good default cannot settle, because
the right answer differs per project: what reads as generous on a landing page
costs visible content in an application with a sticky header.

Two rules that prevent most colour bugs:

1. **Fill or ink.** A colour that _fills_ something is `--mw-*-color`; a colour
   _drawn on_ a theme surface - text, icon, focus ring, accent border, thin
   divider - is `--mw-*-text-color`. A colour picked to carry a label is by
   definition unreadable on the page it sits on, so ink is always the
   `-text-color` variant. For a generic rule or outline use `--mw-border-accent`
   or `--mw-border`.
2. **`--mw-text-muted-color` is only for text on theme surfaces** (cards, page
   background) - it follows the theme. It is a true gray with `$muted-tint`
   (12%) of the primary mixed in, not a stepped-back text colour, so it stays
   gray no matter how tinted the palette is. On a colour surface that stays the same
   in both themes it is always wrong: use `--mw-accent-text-color`, or `opacity`
   for a disabled look.

## Light & dark

- Dark is the base. Light is applied by putting `mw-theme-light` on `<body>` -
  that class only re-points the theme aliases at the `--mw-light-*` set.
- Card, footer and border are derived from the page background by scaling its
  OKLch lightness and chroma by one factor. A card steps **away from the text
  colour** - darker than the page in the dark theme, lighter in the light one.
  A near-black `--mw-dark-page-background` leaves no headroom underneath and
  cards collapse into it; keep it around OKLch lightness 0.24.
- Header, footer chrome and form controls deliberately stay dark/light
  respectively in both themes.
- Persisting the choice, the toggle UI and the initial class are the
  application's job in a SPA (`examples/angular-services.md`). The shipped JS
  does it for static pages using `localStorage` under the key `mw-theme`.

```ts
document.body.classList.toggle('mw-theme-light', isLight);
```

## SCSS configuration

Only `@use ... with (...)` works - a plain assignment before the `@use` has no
effect, because the root colours are declared with `!default`.

```scss
@use 'maverick-wave/src/scss/main' with (
  $mw-theme-mode: 'switchable',
  // 'switchable' | 'dark' | 'light'
  $primary-color: #0f766e,
  $secondary-color: #b45309,
  $success-color: #15803d,
  $warning-color: #a16207,
  $danger-color: #b91c1c,
  $info-color: #0e7490,
  $gray-color: #64748b,
  $dark-background: #172127,
  $dark-text-color: #e8eef0,
  $light-background: #f2f6f7,
  $light-text-color: #172127,
  $form-elements-background: #f5f9fa,
  $accent-text-color: #f2fafa,
  // the three derivation knobs, all optional
  $hover-shift: 15%,
  $ink-lightness-dark: 0.68,
  $ink-lightness-light: 0.55,
  $muted-tint: 12%,
  $mw-hero-image: url('/assets/hero.jpg'),
  $font-family-base: (
    'Inter',
    sans-serif,
  ),
  $font-family-heading: (
    'Inter',
    sans-serif,
  ),
  $font-family-mono: (
    'JetBrains Mono',
    monospace,
  )
);
```

The three font stacks are the one place where the parentheses matter: a
comma-separated stack is a Sass list, and without them the commas would read as
further arguments to `with (...)`. A single family (`$font-family-base: 'Inter'`)
needs none.

`$mw-theme-mode: 'dark'` or `'light'` compiles a single theme - the other set of
variables is omitted and `mw-theme-light` has no effect. The theme toggle
component reads `--mw-internal-theme-mode` and disables itself.

Overriding a value that is not on the list above is done in CSS afterwards -
they are all `var()` references anyway:

```scss
@use 'maverick-wave/src/scss/main' with (
  $primary-color: #0f766e
);

:root {
  /* break out of the derived scale for one token */
  --mw-primary-background-hover: color-mix(
    in srgb,
    var(--mw-primary-color) 35%,
    transparent
  );
}
```

## Importing only what you need

The full stylesheet is ~172 kB raw / ~26 kB gzipped. Marketing components
(`blog-post`, `gallery`, `content-slider`, `techstack-bucket`, `tiles`,
`coming-soon`, `ratings`, `home`, `hero`) are dead weight in an application, and
Angular bundle budgets notice.

Every layer forwards one module per file, and no `@extend` crosses a file
boundary, so partial imports are safe. **The one thing you must not drop is
`base`** - it carries the `:root` tokens; without it every component renders
colourless.

```scss
// styles.scss - configure first, then pick
@use 'maverick-wave/src/scss/abstracts/variables' with (
  $primary-color: #0f766e
);

@use 'maverick-wave/src/scss/base'; // :root tokens + reset + typography

@use 'maverick-wave/src/scss/layout/grid';
@use 'maverick-wave/src/scss/layout/main';
@use 'maverick-wave/src/scss/layout/page-header';
@use 'maverick-wave/src/scss/layout/section';

@use 'maverick-wave/src/scss/components/alerts';
@use 'maverick-wave/src/scss/components/buttons';
@use 'maverick-wave/src/scss/components/cards';
@use 'maverick-wave/src/scss/components/empty-state';
@use 'maverick-wave/src/scss/components/modals';
@use 'maverick-wave/src/scss/components/panels';
@use 'maverick-wave/src/scss/components/skeleton';
@use 'maverick-wave/src/scss/components/spinners';
@use 'maverick-wave/src/scss/components/tables';
@use 'maverick-wave/src/scss/components/tags';
@use 'maverick-wave/src/scss/components/toasts';

@use 'maverick-wave/src/scss/form-elements'; // or single files
@use 'maverick-wave/src/scss/utilities';
```

That set compiles to ~77 kB raw / ~13 kB gzipped - well under half the full
build.

Details worth knowing:

- **Configuration has to come first.** `abstracts/variables` must be configured
  before any other module loads it, so the `with (...)` line goes at the top of
  the file. Configuring `main` instead pulls in everything again.
- `base` forwards `reset`, `base` and `typography`. If you already have your own
  reset, `@use '.../base/base'` gives you the `:root` block alone (~9 kB with a
  component or two).
- Module names are the file names without the leading underscore:
  `components/_buttons.scss` becomes `components/buttons`.
- Layer index files (`components`, `form-elements`, `layout`, `utilities`,
  `base`) pull in their whole layer - convenient for the small ones
  (`utilities`, `form-elements`), wasteful for `components`.
- Some components expect a sibling: `lists` styles checkbox rows and looks best
  with `form-elements/checkbox`; `tags` uses `mw-btn-mini` from `buttons` for
  its remove button.
