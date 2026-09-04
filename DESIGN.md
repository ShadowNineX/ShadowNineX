---
name: ShadowNine's workshop
description: A little workshop for good ideas.
colors:
  twilight: '#211e2b'
  warm-paper: '#fff3d9'
  light-ink: '#42323f'
  dark-ink: '#fff5df'
  dark-honey: '#ffc65b'
  light-honey: '#a35720'
  dark-orange: '#ef9866'
  light-orange: '#cf673e'
  dark-mint: '#a8ccbd'
  light-mint: '#497765'
typography:
  header:
    fontFamily: 'Trebuchet MS, Verdana, sans-serif'
    fontWeight: 700
rounded:
  header: '22px'
---

# ShadowNine's profile design

## Overview

A warm inventor's workshop: playful fox energy, kind language, real technical work. ShadowNine is the public name. Keep the phrase “A little workshop for good ideas.” and the occasional `:]`.

## Colors

Twilight and warm paper are the two SVG grounds. Honey carries the name and primary trail; orange carries its companion. Mint is a small supporting accent. GitHub owns the surrounding page's theme, links, and text colors.

## Typography

The SVG header uses the local font stack above, at 100 viewBox units on desktop and 66 on compact layouts. Tagline text is 27 units. Native Markdown supplies all body text and accessible project links. Do not rely on external font loading inside an SVG image.

## Layout

One readable column: welcome, growing ideas, featured public work, automatically refreshed workbench, toolbox disclosure, music, contribution trail, lemon disclosure, and workshop close. The original Labs logo links to the organization; Emon stays plainly labeled private. The header selects compact assets at a viewport width of 600px, with dark-mode sources ordered before their light fallback.

## Shapes

Two curved trails are the main graphic gesture. Header corners have a 22-unit radius. The user-supplied fox-and-lantern logo and pre-existing workshop artwork remain intact.

## Components

- Headers: four self-contained SVGs from `scripts/build-header.mjs`; a brief line reveal settles within four seconds and turns off under reduced motion.
- Workbench: three public repositories with last-push dates and descriptions, using normal clickable text. The updater edits only its marked block.
- Toolbox and lemon drawer: native `details`/`summary`, keeping GitHub keyboard behavior.
- Music: retained Spotify and Last.fm images plus direct listening links. Existing services own their internal appearance.
- Contribution trail: warm light/dark palettes, generated into the `output` branch.

## Do's and Don'ts

Keep project claims grounded in public repositories or the user's explicit descriptions. Preserve the original logo and keep real navigation as native links. Never invent a public Emon URL, expose private repository activity, add scripted controls GitHub cannot render, or replace personal copy with achievement counters.
