# Changelog

All notable changes to this project will be documented in this file.
Patch releases are only for test purposes - here I only document major and minor releases.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0] - 2026-08-19

### Added

- mw-sr-only
- mw-row-split (+ center)
- mw-btn-plain
- mw-tag-neutral / mw-tags-neutral
- mw-button-bar-center
- mw-segmented (+ secondary, auto)
- mw-text-currency
- mw-table-responsive-hint
- mw-actions-note
- scroll hint on the tab bar, no JavaScript needed
- touch targets grow on a coarse pointer or below 768px
- tokens: --mw-surface-muted, --mw-container-width, --mw-container-width-sm,
  --mw-section-padding-block, --mw-calendar-dot, --mw-scroll-hint-cover

### Changed

- **Breaking:** mw-text-numeric is now digits only - use mw-text-currency for a
  money column
- **Breaking:** mw-container drops to a 1rem gutter below 576px instead of 89%
- mw-active is the state class everywhere; bare active still works but is
  deprecated
- calendar dot colour comes from --mw-calendar-dot, tone classes are presets
- mw-modal-backdrop works as a button without a reset
- modal widths evenly stepped: 370 / 520 / 720 / 960px
- mw-form-actions-hint is now mw-actions-note and works in modal, card and
  panel footers too; the old name stays as an alias

## [3.12.0] - 2026-08-19

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
