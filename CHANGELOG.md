# Changelog

All notable changes to this project will be documented in this file.
Patch releases are only for test purposes - here I only document major and minor releases.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.7.0] - 2026-10-03

### Added

- new header as floating island

## [6.6.0] - 2026-09-30

### Fixed

- accordion

## [6.5.0] - 2026-09-30

### Fixed

- dropdown

## [6.4.0] - 2026-09-30

### Fixed

- some small fixes for astro

## [6.3.0] - 2026-09-30

### Fixed

- some small fixes for angular

## [6.2.0] - 2026-09-29

### Fixed

- again tooltip

## [6.1.0] - 2026-09-29

### Fixed

- tooltip

## [6.0.0] - 2026-09-29

### Added

- app shell (`mw-app`) - sidebar beside a scrolling column, folds to an icon rail, a panel over the content on a phone
- app shell aside (`mw-app-aside`) - an inspector or assistant column, docked from `xl`, over the content below
- app shell tab bar (`mw-app-tabbar`) - the phone's navigation at the bottom edge
- `data-mw-app-persist` remembers the rail and the docked aside, `mw-app-content-flush` gives a canvas the whole column
- Czech flag (`mw-flag-cz`)
- footer bar (`mw-footer-bottom`) with a line for imprint and privacy (`mw-footer-links`), a dark footer (`mw-footer-dark`) and one for apps (`mw-footer-compact`)
- progress ring (`mw-progress-ring`) and an indeterminate bar (`mw-progress-indeterminate`)
- filter chips - a `button.mw-tag` with `aria-pressed`
- `mw-alert-actions`, `mw-spinner-inline` and `mw-empty-state-inline`
- tables: `aria-sort` arrows, row selection from `aria-selected` or a checked first cell, a bulk-action bar (`mw-table-bulk`) and a sticky first column (`mw-table-sticky-col`)
- pagination with numbered pages that turns into "3 of 12" on a phone (`mw-pagination-pages`), a compact timeline for activity feeds (`mw-timeline-compact`), `mw-avatar-more`, shortcuts in dropdown items, segmented controls on native radios
- tabs, accordions, breadcrumbs, stepper, dropdown, segmented and navbar links follow their ARIA state (`aria-selected`, `aria-expanded`, `aria-current`, `aria-pressed`) as well as their classes, and keep it visible under forced colors
- `--mw-form-elements-readonly-background` and `--mw-form-elements-disabled-background`
- drawer (`mw-modal-drawer`, `mw-modal-drawer-start`) - the `<dialog>` modal as a full-height side panel
- bento grid (`mw-bento`, `-wide`, `-tall`, `-lg`, `-full`, `-compact`)
- chat (`mw-chat`, `mw-chat-message`, `mw-chat-bubble`, `mw-chat-composer`, typing and thinking states)
- stat tiles (`mw-stat`, `mw-stat-group`, `mw-stat-delta-*`) and meters (`mw-meter`) on the native `<meter>`; a stat group keeps its row with `mw-card` on the same element
- before/after compare (`mw-compare`) on a native range input
- mobile action bar (`mw-action-bar`) for call, route and booking
- marquee (`mw-marquee`) for logos, seals and quotes
- image shapes (`mw-shape-arch`, `mw-shape-signature`, `mw-shape-leaf`)
- `mw-shadows-hard`, `mw-motion-off` and `mw-accent-text-auto` as site-wide variants
- `mw-tooltip-inline-end` places the bubble beside the trigger where the browser can anchor it
- `$mw-page-transitions` - opt-in crossfade between pages
- `prefers-contrast: more` and `prefers-reduced-transparency` support
- `motion-safe`, `motion-reduced` and `visually-hidden` mixins
- z-index key `action-bar`
- `mw-select-custom` - the open list in the framework's look where the browser supports `appearance: base-select`
- form controls read their error from `aria-invalid="true"` and Angular's `ng-invalid ng-touched` as well as `:user-invalid`
- checkbox, radio and toggle take `disabled` from the input, checkbox draws `indeterminate` as a bar, both show an invalid state
- forced-colors fallbacks for checkbox, radio, toggle and slider, including a visible keyboard focus

### Changed

- the showcase is split into one page per section
- browser floor raised to Chrome and Edge 123, Firefox 140, Safari and iOS 17.5 - the class-based theme fallback for browsers without `light-dark()` is gone
- bottom toast stacks move up while an action bar is visible
- the `scrollbar` mixin and the accordion's scroll area no longer style `::-webkit-scrollbar`
- placeholders at full opacity - faded they fell to 2.4:1
- `readonly` fields are matched by `[readonly]` instead of `:read-only`
- disabled and readonly fields share an opaque, clearly grey tone in both themes; readonly keeps full-strength text
- table rows only tint under the pointer with `mw-table-hover`
- breadcrumbs mark the current page only through `mw-breadcrumbs-current` or `aria-current="page"`, no longer by being last
- only a tag that is a link or a button reacts to hover
- alert text at full opacity; spinners draw in the system ink under forced colors
- the hidden input of checkbox, radio and toggle covers the row behind the label content, so VoiceOver finds it by touch

### Removed

- BREAKING: `mw-modal-overlay`, `mw-modal-open`, `mw-modal-backdrop` and the body scroll lock that came with them - use `<dialog class="mw-modal">`
- `mwOpenModal` / `mwCloseModal` only act on a `<dialog>`; the script closes a dialog on a backdrop click only for `closedby="any"`, where the browser does not do it itself

### Fixed

- occasions arrive and drift with the scroll in Firefox and in Safari before 26, which have no scroll timelines
- `pre code` no longer wraps mid-line on a phone
- badges keep their shape under forced colors
- dot spinners stay visible with reduced motion instead of freezing at scale 0
- progress, skeletons and spinners stay visible under forced colors; footer links and social buttons carry a focus ring and grow on touch
- the parked skip link no longer throws its shadow into the top of the page
- the timeline's entrance no longer scrolls a phone sideways, and entries past the tenth no longer stay invisible
- blocked storage (Safari with all cookies blocked, a sandboxed iframe) no longer stops the page script
- the focus ring on the header takes the header's light ink instead of the page's in a fixed light theme
- the scroll spy only moves the mark between links into the page itself - on a site with several pages the current page stays marked

## [5.39.0] - 2026-09-26

### Added

- device frames (`mw-devices`, `mw-device-laptop`, `mw-device-phone`) - a laptop and a phone in CSS with a screenshot that scrolls or a live page scaled to the glass

## [5.38.0] - 2026-09-26

### Added

- occasion on a single surface - the effect class on the card instead of `<html>`

## [5.37.0] - 2026-09-26

### Added

- FAQ (`mw-faq`, `mw-faq-cards`) on native details, a link to a question opens it

## [5.36.0] - 2026-09-26

### Fixed

- technical fixes

## [5.35.0] - 2026-09-26

### Fixed

- technical fixes

## [5.34.0] - 2026-09-26

### Added

- presentations and sample decks
- occasions

## [5.33.0] - 2026-09-25

### Fixed

- fixed header fix

## [5.32.0] - 2026-09-24

### Added

- `mw-home-bottom` puts the hero text on the lower edge
- `mw-home-actions` for the hero buttons, stacked at one width on a phone
- `$hero-ink-lightness` for text colors on the hero

### Fixed

- `mw-home-start` started left of the container edge
- testimonial quotes fill their card in an equal-height grid

## [5.31.0] - 2026-09-23

### Fixed

- modal dialog on iOS
- open modals lock the page scroll behind them

## [5.30.0] - 2026-09-23

### Fixed

- new gallery styles and mobile modal dialog

## [5.29.0] - 2026-09-23

### Added

- new gallery styles

### Changed

- removed some duplicated html showcase with toggle buttons for variants

## [5.28.0] - 2026-09-21

### Changed

- Grid update
- splitted main file

## [5.27.0] - 2026-09-21

### Changed

- Spacing and small refactorings in css code

## [5.26.0] - 2026-09-20

### Changed

- Spacing

## [5.25.0] - 2026-09-20

### Added

- print stylesheet
- `main-lean` entry point
- `mw-home-start` for a hero at the left container edge
- `mw-grid-from-*` keeps a grid single column up to that breakpoint

### Changed

- more "mobile first" design
- `mw-home` carries the container width

## [5.24.0] - 2026-09-20

### Changed

- section header overhaul

## [5.23.0] - 2026-09-20

### Added

- leader-row
- lunch menu with 2 variants
- contact cards

## [5.22.0] - 2026-09-19

### Fixed

- mobile navigation

## [5.21.0] - 2026-09-19

### Fixed

- mobile navigation - close button

## [5.20.0] - 2026-09-18

### Added

- new mobile navigation

## [5.19.0] - 2026-09-17

### Fixed

- technical issue

## [5.18.0] - 2026-09-17

### Added

- possibly keep buttons on a non-sticky header

## [5.17.0] - 2026-09-17

### Fixed

- tooltips
- modals use dialog

## [5.16.0] - 2026-09-15

### Added

- `--mw-section-padding-fluid` - section spacing that grows with the screen

## [5.15.0] - 2026-09-15

### Fixed

- new tooltips

## [5.14.0] - 2026-09-15

### Added

- `mw-tooltip-below` - the tooltip under its trigger
- `mw-tooltip-end` / `mw-tooltip-start` - the tooltip aligned to that edge of its trigger

## [5.13.0] - 2026-09-15

### Added

- `fluid()` function, takes scale keys or plain rem/px
- `touch-context`, `touch-floor` and `hit-area` mixins

### Changed

- responsive changes
- parallax effect with shadow

## [5.12.0] - 2026-09-13

### Fixed

- theme panel dropdowns

## [5.11.0] - 2026-09-13

### Changed

- showcase parallax effect

### Fixed

- small fixes

## [5.10.0] - 2026-09-13

### Fixed

- technical issues

## [5.9.0] - 2026-09-13

### Changed

- finalized showcase variants
- changed some little glow up

## [5.8.0] - 2026-09-12

### Added

- some other showcase variants

## [5.7.0] - 2026-09-12

### Added

- avatar hover animation

### Changed

- slimmer control heights
- showcase variants

## [5.6.0] - 2026-09-12

### Added

- showcase variants of some components / typography

## [5.5.0] - 2026-09-12

### Added

- showcase themes

### Fixed

- some firefox fixes
- scrolling

## [5.4.0] - 2026-09-11

### Added

- parallax layout
- parallax hero with flexible header navbar

## [5.3.0] - 2026-09-11

### Fixed

- progress animation

## [5.2.0] - 2026-09-11

### Fixed

- progress animation

## [5.1.0] - 2026-09-11

### Fixed

- progress animation

## [5.0.0] - 2026-09-11

### Added

- layers

### Changed

- tried out some skills and updated some stuff
- refactored complete code

## [4.28.0] - 2026-09-08

### Added

- language switcher in header

## [4.27.0] - 2026-09-07

### Fixed

- techstack bucket width

## [4.26.0] - 2026-09-06

### Fixed

- scroll ofset for static sites

## [4.25.0] - 2026-09-02

### Changed

- small fixes
- updated skill

## [4.24.0] - 2026-09-01

### Fixed

- `mw-reveal` is written as animation longhands

## [4.23.0] - 2026-09-01

### Changed

- Technical updates

## [4.22.0] - 2026-09-01

### Added

- `mw-announcement` - the ribbon under the fixed header (discount, launch note), with `-content`, `-highlight` pill, color variants, a `-static` in-flow variant and `--mw-announcement-height` driving the anchor scroll offset
- `mw-testimonial` - quote card with `-source`, `-detail` and `-featured`, built for walls of voices
- `mw-prose` - long-form running text container (legal pages, terms, articles): bare h2/h3/p/ul inside, no utility chains
- `mw-section-intro` - the lead paragraph under a `mw-section-title`
- `mw-reveal` - scroll entrance via `animation-timeline: view()`, guarded for reduced motion and older browsers
- `mw-media` - self-hosted audio and video sit full width, video in the surface silhouette

## [4.21.0] - 2026-08-31

### Fixed

- `mw-scroll-hint` keeps a smaller reserve below `md`, where the full one tipped the hero past 100dvh and moved the cue off screen

## [4.20.0] - 2026-08-31

### Added

- `mw-scroll-hint-end` - the hero scroll cue in the bottom right corner instead of centred
- `--mw-scroll-hint-inline` - side distance of the cue in that corner
- `--mw-scroll-hint-reserve` - room the hero keeps free at its bottom edge for the cue

## [4.19.0] - 2026-08-31

### Fixed

- `mw-scroll-hint` kept bobbing under `prefers-reduced-motion: reduce`

## [4.18.0] - 2026-08-31

### Added

- `mw-scroll-hint` - the "scroll down" cue at the bottom of a hero

### Changed

- some small chsnges in footer and avatar

## [4.17.0] - 2026-08-29

### Fixed

- some small fixes

## [4.16.0] - 2026-08-29

### Changed

- `mw-price-original` now takes its own line above the new price by default
- `mw-price-stacked` is gone, `mw-price-inline` takes its place

## [4.15.0] - 2026-08-29

### Added

- `mw-price` - the price figure: struck-through original, discounted amount, cents, unit, period and note, ...

## [4.14.0] - 2026-08-27

### Added

- unique maverick-wave corner colors in cards

## [4.13.0] - 2026-08-27

### Added

- `mw-link` / `mw-link-muted` - the link inside a sentence, same look as `mw-btn-link` without the control height

## [4.12.0] - 2026-08-27

### Fixed

- some fixes because of the big update previously

## [4.11.0] - 2026-08-27

### Changed

- claude ui/ux pro skill - glow up

## [4.10.0] - 2026-08-24

### Added

- `$header-surface` - SCSS knob for how dark the header bar sits
- `$mw-hero-text-color` - ink on the hero image, fixed across themes
- `$hero-filter-dark` / `$hero-filter-light` - per-theme filter on the hero image

### Changed

- header colours derive from `--mw-primary-color` instead of the dark theme background
- hero overlay replaced by `--mw-hero-image-filter`

### Fixed

- active navbar link was barely readable on the header
- `backdrop-filter` now carries its `-webkit-` prefix for Safari below 18 (`browserslist` in package.json)
- hero text went dark over an unchanged image in light mode

## [4.9.0] - 2026-08-22

### Added

- `mw-card-title-icon` - round icon badge in front of the card title, coloured by `mw-card-addon-*`

### Changed

- `mw-card-stack-icon` follows `mw-card-addon-*` as well, primary stays the default

### Fixed

- hero no longer centers behind the fixed header - content above the first line stays visible on mobile

## [4.8.0] - 2026-08-22

### Added

- `mw-card-feature` - frame with a label bar around a highlighted card, in primary, secondary and info

## [4.7.0] - 2026-08-22

### Changed

- mobile breakpoints view adjustments

## [4.6.0] - 2026-08-22

### Changed

- some color adjustments

## [4.5.0] - 2026-08-21

### Changed

- new color concept and new default color palette
- `mw-item-list-compact` sits on a card surface now

## [4.4.0] - 2026-08-20

### Added

- prefilled marker for form controls (`mw-prefilled`)

### Fixed

- disabled select lost its arrow

## [4.3.0] - 2026-08-19

### Fixed

- font family tokens lost their quotes

## [4.2.0] - 2026-08-19

### Added

- font stacks are configurable via SCSS (`$font-family-base`, `-heading`, `-mono`)

### Fixed

- code blocks and kanban ids hardcoded their monospace stack and ignored
  `--mw-font-family-mono` - they use the token now
- removed the unused `$font-family` variable

## [4.1.0] - 2026-08-19

### Fixed

- changelog

## [4.0.0] - 2026-08-19

### Added

- calendar (month, week and compact month)

### Changed

- pagination frame now matches the calendar
- big update with the needs of another project

## [3.11.0] - 2026-08-12

### Fixed

- footer color

## [3.10.0] - 2026-08-10

### Added

- kanban board

## [3.9.0] - 2026-08-07

### Fixed

- technical issues

## [3.8.0] - 2026-08-07

### Fixed

- technical issues

## [3.7.0] - 2026-08-07

### Changed

- Header container layout

### Fixed

- Cards no longer create a stacking context
- Tooltips inside cards are no longer cut off
- Tooltip arrow visibility

## [3.6.0] - 2026-08-05

### Fixed

- fixed tooltip and alert close text color

## [3.5.0] - 2026-08-05

### Added

- flexible header height

## [3.4.0] - 2026-08-04

### Added

- Claude Code skill
- some new elements

### Changed

- Big update!
- A few claude code ideas from a few other private projects
- Small fixes

## [3.3.0] - 2026-04-12

### Fixed

- blockquote
- grids
- blogposts

## [3.2.0] - 2026-04-12

### Changed

- complete rework of spacing
- rework of some attributes

## [3.1.0] - 2026-04-04

### Changed

- release now via npm

## [3.0.0] - 2026-04-04

### Added

- started now with claude code integration
- some additional components and form elements

### Fixed

- some minor fixes found by claude code

## [2.36.0] - 2026-03-24

### Fixed

- removed tooltip directive cursor

## [2.35.0] - 2026-03-24

### Added

- new mini info

## [2.34.0] - 2026-03-23

### Added

- new mini-buttons
- changed alert and tag "x" to new mini-button

## [2.33.0] - 2026-02-24

### Fixed

- timeline dates cursor

## [2.32.0] - 2026-02-24

### Changed

- some small updates

## [2.31.0] - 2026-01-30

### Changed

- use of global z-index function

## [2.30.0] - 2026-01-29

### Fixed

- status background colors
- alert backgrounds

## [2.29.0] - 2026-01-29

### Changed

- simple timeline date
- global spacing 7 and 8

## [2.28.0] - 2026-01-28

### Changed

- alerts rework

## [2.27.0] - 2026-01-28

### Added

- tags rework

### Changed

- modal sizes
- checkbox inline group spacing

## [2.26.0] - 2026-01-26

### Added

- text in danger color

## [2.25.0] - 2025-12-31

### Fixed

- reverted status color background names

## [2.24.0] - 2025-12-31

### Fixed

- reverted status color background names

## [2.23.0] - 2025-12-31

### Changed

- gallery container with max-width

## [2.22.0] - 2025-12-31

### Changed

- container width
- status color background names

### Added

- Techstack Buckets

## [2.21.0] - 2025-12-26

### Added

- Cards title divider

## [2.20.0] - 2025-12-22

### Added

- Events (certificates for example) for the big timeline

## [2.19.0] - 2025-12-10

### Added

- Tooltip

## [2.18.0] - 2025-12-08

### Added

- active marker for timelines
- function for font-weights

## [2.17.0] - 2025-07-16

### Added

- selectable item-list with checkboxes

### Fixed

- sizing on gallery

## [2.16.0] - 2025-07-07

### Fixed

- some spacing
- icons

## [2.15.0] - 2025-07-01

### Fixed

- tiles spacing

## [2.14.0] - 2025-07-01

### Added

- breadcrumbs
- tiles

### Fixed

- main centering

## [2.13.0] - 2025-06-30

### Fixed

- burger button without theme toggle

## [2.12.0] - 2025-06-30

### Fixed

- simple timeline content

## [2.11.0] - 2025-06-30

### Fixed

- home centering

## [2.10.0] - 2025-06-30

### Fixed

- login width
- main / home / content styles

## [2.9.0] - 2025-06-30

### Added

- login info text

### Fixed

- login width
- content height

## [2.8.0] - 2025-06-27

### Fixed

- smooth scrolling offset

## [2.7.0] - 2025-06-27

### Added

- content slider (image slider)
- buttons active state

## [2.6.0] - 2025-06-25

### Added

- alternate section with css pattern

## [2.5.0] - 2025-06-18

### Added

- button bar

## [2.4.0] - 2025-06-10

### Fixed

- login button (click and disabled)

## [2.3.0] - 2025-06-10

### Fixed

- header navbar

## [2.2.0] - 2025-06-10

### Changed

- header navbar with login button

## [2.1.0] - 2025-06-09

### Fixed

- grid spacing

## [2.0.0] - 2025-06-09

### Added

- big update
- modals
- pagination
- item lists
- form and form-elements
- different flex grid ratios

### Changes

- sizing sizing sizing
- complete grid rework
- progress bars update

## [1.21.0] - 2025-05-23

### Changed

- counters to info as badges or counters

## [1.20.0] - 2025-05-23

### Changed

- reworked allerts

## [1.19.0] - 2025-05-22

### Added

- badge for cards
- ribbon for cards

### Changed

- text-secondary to text-muted
- Spacing within cards
- color variants in components as loop

## [1.18.0] - 2025-05-22

### Changed

- spacing in many components
- header logo as svg
- some stuff in new timeline components

## [1.17.0] - 2025-05-21

### Added

- timeline components

## [1.16.0] - 2025-05-20

### Changed

- sizes of the loading spinner

## [1.15.0] - 2025-05-14

### Fixed

- spacing of mw-content
- spacing and elements of mw-blog-post
- spacing of tags

## [1.14.0] - 2025-05-14

### Added

- rating component

## [1.13.0] - 2025-05-13

### Fixed

- login form width

## [1.12.0] - 2025-05-13

### Changed

- login form

## [1.11.0] - 2025-05-13

### Fixed

- removed text-align center from new mw-content

## [1.10.0] - 2025-05-13

### Changed

- main and home parts and added hero with full-size background image
- changed some little styles

## [1.9.0] - 2025-05-05

### Added

- card subtitle

### Changed

- some color and size adjustments

## [1.8.0] - 2025-05-03

### Fixed

- too small font-size on blog-post

## [1.7.0] - 2025-05-03

### Changed

- home section
- all "@media" to "@include"

## [1.6.0] - 2025-05-03

### Fixed

- multiple font-family variables

## [1.5.0] - 2025-05-02

### Fixed

- wrong mapping of the text color on primary or secondary elements

## [1.4.0] - 2025-05-02

### Added

- new color variables for text on primary or secondary elements
- new color variables for the fixed header/navbar
- CHANGELOG.md

### Changed

- updated complete header and navbar
- ol/ul-list margin in the blog-post

## [1.3.0] - 2025-04-30

### Added

- let's say "initial release"
